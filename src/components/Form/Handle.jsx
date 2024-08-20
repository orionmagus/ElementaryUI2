import React, { useState, useMemo } from "react";
import posed from "react-pose";
import { transform } from "popmotion";
import ld from "../../lib/lodash";
import styled from "styled-components";
const { pipe, clamp, blendColor, interpolate } = transform;
const bt = styled.button`
  background: var(--component-bg);
  box-shadow: 0px 0px 0px rgba(0, 0, 0, 0);
  color: var(--text);
  border: 0;
  outline: none;
  width: 10px;
  height: 10px;
  border-radius: var(--round-radius);
  :hover {
    background: var(--primary);
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.2);
  }
`;
export const useField = initial => {
    const [value, set] = useState(initial);
    return {
      value,
      set,
      reset: () => set(initial),
      props: {
        value,
        onChange: e => set(e.target.value)
      }
    };
  },
  mni = [[0, 100], [0, 1]],
  Handgle = posed.div({
    draggable: "x",
    // init: ({ x, range: [m1, m2], max }) => ({ left: x }),
    dragBounds: ({ max, min = 1 }) => ({ left: min, right: max }),
    passive: ({ range, min = 1, max = 300 }) => ({
      currentValue: [
        "x",
        pipe(
          parseFloat,
          interpolate([min, max], range)
        ),
        true
      ]
    })
    // dragBounds: { left: "-100%", right: "100%" }
  }),
  Handle = posed(bt)({
    draggable: "x",
    dragBounds: ({ max, min = 1 }) => ({ left: min, right: max }),
    passive: ({ range, min = 1, max = 300 }) => ({
      currentValue: [
        "x",
        pipe(
          parseFloat,
          interpolate([min, max], range)
        ),
        true
      ]
    }),
    pressable: true,
    init: {
      background: "var(--component-bg)",
      boxShadow: "0px 0px 0px rgba(0,0,0,0)"
    },
    press: {
      background: "var(--primary)",
      boxShadow: "0px 5px 10px rgba(0,0,0,0.2)"
    }
  }),
  Slider = ({ onStart = v => v, onEnd = v => v, onDrag = v => v, range = [10, 500], initvalue = 20000, width = 200, ...nprops }) => {
    const lerp = v => {
        let xo = pipe(
          parseFloat,
          interpolate(range, [1, width])
        )(v);
        // console.log(v, xo);
        return xo;
      },
      rev_lerp = v =>
        pipe(
          parseFloat,
          interpolate([1, width], range)
        )(v);

    const { value, props, set } = useField(lerp(initvalue)),
      textVal = useMemo(v => ld.formatter("2.0s")(value), [value]);

    // const format =;
    const setUp = pp => {
      set(pp);
      return pp;
    };
    const handle_props = {
      max: width,
      value,
      style: {
        left: lerp(value)
      },
      onDragStart: v => onStart(setUp(rev_lerp(v))),
      onDragEnd: v => onEnd(value),
      onValueChange: {
        x: v => onDrag(setUp(rev_lerp(v)))
      }
    };
    return (
      <div
        style={{
          width,
          background: "rgba(10,24,67,0.1)",
          fontSize: 10,
          height: 35,
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          justifyContent: "center"
        }}
        className="slider">
        <Handle className="handle" {...handle_props}>
          <span style={{ position: "absolute", left: 25, top: 12 }} className="value">
            {textVal}m
          </span>
        </Handle>
      </div>
    );
  };
