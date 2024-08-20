import React, { createContext, useEffect, useCallback, useState } from "react";
import { BehaviorSubject, AsyncSubject, interval, of, from, animationFrameScheduler, isObservable } from "rxjs";
import crossfilter from "crossfilter2";
import reductio from "reductio";
import { useObservable } from "rxjs-hooks";
import { Record, Seq } from "immutable";
import { map, withLatestFrom } from "rxjs/operators";
import { value } from "popmotion";
const callServer = fetch("https://silstats.4-sure.net/simple_reports/sp_stats_all?start=2019-04-01%2000%3A00%3A00&end=2019-04-30%2023%3A59%3A59", {
  credentials: "omit",
  headers: {
    "content-type": "application/json",
    "x-auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjAsImV4cCI6MTU2MDE1MjAxNS40MTU1NDl9.HTl3pzMwfZDke4UvuqpfC3Ybm6Xzkg7xHgKwTMMwJVw",
    "x-csrftoken": "w7z2LOZQ75qapnClbR3owIKLqevsTczw"
  },
  referrer: "https://silstats.4-sure.net/static/dash/no-referrer",
  referrerPolicy: "no-referrer-when-downgrade",
  body: null,
  method: "GET",
  mode: "cors"
});
const fnMap = {
  value: (reduct, accessor, args) => reduct.value(args),
  filter: (reduct, accessor, cb) => reduct.filter(cb),
  avg: (reduct, accessor) =>
    reduct
      .count(true)
      .sum(accessor)
      .avg(true),
  exceptionSum: (reduct, accessor, value) =>
    reduct
      .exception(value)
      .exceptionCount(true)
      .exceptionSum(accessor),
  exceptionCount: (reduct, accessor, args) => reduct.exception(accessor).exceptionCount(true)
};
const chainRed = (accessor, methods) =>
    methods.reduce((reduct, { method, args }) => (method in fnMap ? fnMap[method](reduct, accessor, args) : reduct[method](accessor)), reductio()),
  createReductio = (attr, methods) => chainRed(d => d[attr], methods),
  onChang = (dimension, group, group_accessor, rdct) => props =>
    useObservable(
      state$ =>
        state$.pipe(
          map(([dim, rdct, prop]) => {
            rdct(dim);
            return dim[group_accessor]();
          })
        ),
      dimension[group](),
      rdct,
      props
    );

const wrapperDimension = dim => {
  const sub = new BehaviorSubject({ type: "", payload: {} }),
    dispatch = sub.next;
  let value = 0;
  return {
    dim,
    sub,
    action$: src => src.pipe(),
    dispose: () => dim.dispose(),
    filter: (...args) => {
      dispatch({ type: "filter" });
      value++;
      return dim.filter(...args);
    },
    filterAll: (...args) => {
      dispatch({ type: "filter" });
      value++;
      return dim.filterAll(...args);
    },
    isin: arr => dim.filterFunction(d => d),
    filterFunction: (...args) => {
      dispatch({ type: "filter" });
      value++;
      return dim.filterFunction(...args);
    },
    group: (...args) => dim.group(...args),
    groupAll: (...args) => dim.groupAll(...args),
    subscribe: subscriber => {
      const unsub = dispatch.subscribe(subscriber);
      return () => unsub();
    },
    valueOf: () => value
  };
};
class CrossFilter {
  constructor(initialData) {}
}
const CFData = initialData => {
    let value = 0;
  },
  addGetSet = (obj, name, gett = () => undefined, sett = v => v, value = undefined, observe = false) => {
    const a = observe ? (isObservable(observe) ? observe : new BehaviorSubject(value)) : { next: v => v, subscribe: v => v };
    sett.versions = [value];
    Object.defineProperty(obj, name, {
      get: () => gett(),
      set: newValue => {
        if (sett.versions[sett.versions.length - 1] !== newValue) {
          sett(newValue);
          a.next(newValue);
        }
      },
      enumerable: true,
      writable: true
    });
    return a;
  };
const conv = (js, RecordCls = null) => RecordCls || Record(js);

const convertJs = (RecordCls = null, js) => {
    let cb = !!RecordCls ? a => convertJs(RecordCls, a) : convertJs;
    if (typeof js !== "object" || js === null) {
      return js;
    }

    if (Array.isArray(js)) {
      return Seq(js)
        .map(cb)
        .toList();
    }
    RecordCls = conv(js, RecordCls);
    cb = a => convertJs(RecordCls, a);
    return new RecordCls(Seq(js).map(cb));
  },
  closure = f => d => d.getIn(Array.isArray(f) ? f : f.split("."));
export const useCrossfilter = ({ data, attributes }) => {
  const [cfstate, setState] = useState();
  const ef = useEffect(() => {
    const cfData = crossfilter(data),
      mkeys = [[]];
    const cf = {
      crossfilter: cfData,
      getMulti: (i = 0) => mkeys[i],
      setMulti: (i = 0, v = []) => mkeys.splice(i, 1, v),
      _dimension: {},
      _metric: {},
      _reduct: {}
    };
    class DataCls extends Record({ parent: v => v, mIndex: 0, ...attributes }) {
      get mkey() {
        if (this.multi.length === 0) {
          return;
        }
        return this.multi.map(f => this.get(f)).join("|");
      }
      get multi() {
        return this.parent.getMulti(this.mIndex);
      }
      set multi(v) {
        this.parent.setMulti(this.mIndex, value);
      }
    }
    const constrainData = data =>
      Seq(data)
        .map(d => convertJs(DataCls, { parent: cf, ...d }))
        .toJS();

    setState(cf);

    const dataset = addGetSet(cf, "dataset", () => cfData.groupAll(), data => cfData.add(constrainData(data)), cfData.groupAll());
    return {
      cfData,
      reductio: (name, { attr, methods }) => createReductio(attr, methods),
      metric: (name, dim_name, reduct_name) => cf,
      dimension: (name, ...flds) =>
        cf[name] || flds.length > 0 ? addGetSet(cf, name, wrapperDimension(cfData.dimension(flds.length > 1 ? d => flds.map(f => d[f]).join("|") : d => d[flds[0]]))) : null
    };
  });
};
