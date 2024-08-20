import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import styled from "styled-components";
import { useMouse } from "../../lib/hooks/useCursorProximity";
import useBounds from "../../lib/hooks/useBounds";
import withErrorBoundary from "../../lib/hof/withErrorBoundary";
import { keyframes, tween } from "popmotion";
import posed from "react-pose";
const FluentBackground = styled.div.attrs(props => ({
    background: props.bg || "rgba(5, 7, 9, 0.75)",
    borderWidth: props.borderWidth || 2
  }))`
    background: ${({ background }) => background};
    width: 100%;
    height: 100%;
    overflow: hidden;
    color: #dedede;
    border: 0;
    cursor: pointer;
    transition: all 0.6s cubic-bezier(0.6, -0.6, 0.5, 0.5);
    background-blend-mode: multiply;
  `,
  FluentBorder = styled.div.attrs(({ children, ...props }) => ({
    gradient: props.gradient || "transparent",
    background: props.bgrad || "transparent",
    borderWidth: props.borderWidth || 1,
    borderRadius: props.borderRadius || 0
  }))`
    padding: ${props => props.borderWidth}px;
    display: block;
    /* transition: all 0.6s cubic-bezier(0.6, -0.6, 0.5, 0.5); */
    backface-visibility: hidden;
    perspective: 1000px;
    transform: translateZ(0);
    will-change: background-image;
    /* min-width: 20px; */
    /* min-height: 34px; */
    width: 100%;
    height: 100%;
    position: relative;
    & > ${FluentBackground} {
      border-radius: ${props => props.borderRadius}px;
      display: block;
      min-width: 20px;
      min-height: 20px;
      &.abs {
        text-align: center;
        position: absolute;
        top: ${props => props.borderWidth}px;
        left: ${props => props.borderWidth}px;
        right: ${props => props.borderWidth}px;
        bottom: ${props => props.borderWidth}px;
      }
      user-select: none;
    }
    background-image: ${({ background, gradient }) => [gradient].join(", ")};
  `,
  isN = n => isNaN(n) || n === null || n === undefined,
  generateBackground = (radius = 150, colors = ["rgba(255,255,255,0.3)", "rgba(150,255,255,0.0)"]) => ({ x, y }) =>
    `radial-gradient(circle ${radius}px at ${isN(x) ? -600 : x}px ${isN(y) ? -600 : y}px, ${colors.join(", ")})`,
  gradGenerate = generateBackground(150);
const Fluent = ({ style, x, y, lightColor, transparentColor, radius, ...props }) => {
  const ref = useRef();
  const bnds = useBounds(ref),
    { left, top } = bnds || {};
  const gbg = gradGenerate({ x: x - left, y: y - top });
  // console.log(left);
  return (
    <FluentBorder gradient={gbg} ref={ref} {...props}>
      {/* {props.children} */}
      <FluentBackground>{props.children}</FluentBackground>
    </FluentBorder>
  );
};
Fluent.defaultProps = {
  lightColor: "rgba(255,255,255,0.3)",
  transparentColor: "rgba(150,255,255,0.0)",
  bg: "rgba(5, 7, 9, 0.75)",
  radius: 100,
  x: 0,
  y: 0,
  style: {},
  borderWidth: 2,
  borderRadius: 0
};
export default Fluent;
