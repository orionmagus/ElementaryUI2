import React, { createContext, useEffect, useCallback, useState, useContext } from "react";
import { BehaviorSubject } from "rxjs";
import crossfilter from "crossfilter2";
import reductio from "reductio";
// Object.defineProperty(obj, prop, descriptor)

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
  createReductio = (attr, methods) => chainRed(d => d[attr], methods);

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
class CF {
  constructor({ endpoints, engine_config: { reducers, dimensions } }) {
    this._data = crossfilter([]);
    this._dimensions = {};
    this._reducers = {};

    this.metrics = {};
    this.createReducer = (name, { attrs, methods }) => (this._reducers[name] = createReductio(attrs, methods));
  }
  set data(data) {
    this.addData(data);
  }
  get data() {
    return this._data;
  }
  addData = data => {
    if (this._data.size() > 0) {
      this._data.remove();
    }
    if (Array.isArray(data[0])) {
      data = data[0];
    }
    if (Array.isArray(data)) {
      this._data.add(data);
    }
  };
  addDimension(dim_name, field) {
    if (field === false) {
      return;
    }
    this._dimensions[dim_name] = this._data.dimension(Array.isArray(field) ? d => field.map(f => d[f]).join("|") : d => d[field]);
    return this._dimensions[dim_name];
  }
  dimension = (dim_name, field = false) => this.dimensions[dim_name] || this.addDimension(dim_name, field);
}
const CreateCF = config => {
  return;
};
const withCrossFilter = config => WrappedComponent => {
  const cf = useContext();
};
