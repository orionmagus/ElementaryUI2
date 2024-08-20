import React, { useState } from "react";
import Lib512 from "../../style/icons/512";

import { mapMerg } from "../../lib/lodash/transformUtils";
import styled from "styled-components";
// import "./style.scss";

const processIconLibrary = iconRaw => {
    const { icons, viewBox } = iconRaw;
    return mapMerg(icons, (d, k) => ({ [k]: { d, viewBox } }));
  },
  Lib = [Lib512].reduce((a, c) => ({ ...a, ...processIconLibrary(c) }), {});
// {d='', viewBox="0 0 28 22"},
const IconPath = styled.path`
  display: block;
  z-index: 20;
  fill: currentColor;
  backface-visibility: hidden;
  transform-origin: 50% 50%;
  perspective: 1000px;
  transform: translateZ(0) scale(1);
`;
export const SVGIcon = styled.svg`
  display: inline-flex;
  flex-direction: row;
  justify-content: start;
  margin: auto 0.25rem;
  align-items: center;
  cursor: pointer;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
`;
export const Icon = styled.svg.attrs(({ name, circled, ...props }) => ({
  viewBox: name in Lib ? Lib[name].viewBox : "0 0 28 22",
  children: (
    <g>
      {circled && <circle cx={0} cy={0} r={10} />}
      <IconPath d={name in Lib ? Lib[name].d : ""} />
    </g>
  )
}))`
  display: inline-flex;
  flex-direction: row;
  justify-content: start;
  margin: auto 0.25rem;
  align-items: center;
  cursor: pointer;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  &-label {
    display: none;
  }
  ${IconPath} {
    width: ${props => props.size}px;
    height: ${props => props.size}px;

    transition: all 0.8s ease-in-out 0.8s;
  }
`;

Icon.defaultProps = {
  name: false,
  size: 24,
  selected: false,
  circled: false,
  defaults: { d: "", viewBox: "0 0 28 22" }
};
export const Icons = props => (
  <div>
    {Object.keys(Lib).map((name, i) => (
      <div>
        <span>{name}</span>
        <Icon title={name} key={i} name={name} />
      </div>
    ))}
  </div>
);
export { Lib };
