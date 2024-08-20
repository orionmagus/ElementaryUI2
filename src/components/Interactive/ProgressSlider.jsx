import React, { useState, useRef } from "react";

import { Record } from "immutable";

import styled, { css, keyframes } from "styled-components";

import { StyledButton, flatGrad } from "./index";
const IndicatingBG = (hue, deg) => `
linear-gradient(
  ${deg}deg,
  hsla(${hue}, 100%, 50%, 0) 10%,
  hsla(${hue}, 100%, 80%, 0.8) 50%,
  hsla(${hue}, 100%, 50%, 0) 70%
)
`;
const IndicatingAnim = (vertical = false) => keyframes`
to {
  background-position: ${vertical ? "0 350%" : "100vw 0"}, 0 0;
}
`;
class Background {
  constructor(opts = {}, bg_ref = []) {
    Object.entries({ position: "0 0", size: "100% 100%", image: "", origin: "0 0", color: "transparent", repeat: "no-repeat", clip: "", attachment: "", ...opts }).forEach(
      ([k, v]) => (this[k] = v)
    );
    this.bg_ref = bg_ref;
  }
  get = k => this[k] || "";
  toString() {
    const { color, image, position, size, repeat, origin, clip, attachment } = this;
    return css`
      ${[color, image, position, size, repeat, origin, clip, attachment].filter(v => !!v).join(" ")}
    `;
  }
  get index() {
    if (this.bg_ref) {
      return this.bg_ref.indexOf(this);
    }
    return -1;
  }
}
class BackgroundMixer {
  constructor(...bgs) {
    this.backgrounds = [];
    this.addBackgrounds(...bgs);
  }
  byProp = (props = ["image", "position", "size", "repeat"]) => css`
    ${props.map(name => `  background-${name}: ${this.backgrounds.map(bg => bg.get(name)).join(", ")};`).join(`    
`)}
  `;
  buildBackground = ({ x = 0, y = 0, w = "100%", h = "100%", ...opts }) =>
    new Background(
      {
        position: [x, y].join(" "),
        size: [w, h].join(" "),
        image: "",
        origin: false,
        color: false,
        repeat: "no-repeat",
        clip: false,
        attachment: false,
        ...opts
      },
      this
    );
  indexOf = v => this.backgrounds.indexOf(v);
  remove = v => (this.indexOf(v) !== -1 ? this.backgrounds.splice(this.indexOf(v), 1) : [v]);
  insertBackground = props => this.backgrounds.unshift(this.buildBackground(props));
  addBackground = props => this.backgrounds.push(this.buildBackground(props));
  addBackgrounds = (...bgs) => bgs.forEach(o => this.addBackground(o));
  toString() {
    return this.byProp();
  }
  valueOf() {
    return this.byProp();
  }
}
const Handle = styled.button.attrs(({ value, vertical, ...props }) => ({
  left: vertical ? "3px" : `${value * 100}%` || 0,
  top: vertical ? `${value * 100}%` || 0 : "2px",
  trans: vertical ? `0,-100%` : "-110%,0",
  ...props
}))`
  border-radius: 1000px;
  width: 1rem;
  height: 1rem;
  max-width: 1rem;
  padding: 0 4px;
  border: 0;
  line-height: 1rem;
  max-height: 1rem;
  top: ${({ top }) => top};
  left: ${({ left }) => left};
  transform: translate(${props => props.trans});
  position: absolute;
  opacity: 0.5;
  z-index: 2;
  overflow: hidden;
`;
//({ vertical, percent, before, show_value }) =>
export const BackgroundMeter = css`

position: relative;
overflow:hidden;
&:hover {
  &:before {
    opacity: 1;
  }
}
&::before {
  z-index: 1;
  content: "${({ show_value, percent }) => `${show_value ? percent + "%" : ""}`}";
  line-height: 1.2em;
  text-shadow: 0px 0px 3px #000;
  font-weight: bold;
  text-indent: 91%;
  overflow: visible;
  white-space: nowrap;
  box-sizing: border-box;

  border-radius: ${({ radius }) => radius};
  pointer-events: none;
  display: block;
  position: absolute;
  left: 2px;
  top: 2px;
  ${({ vertical, percent }) =>
    vertical
      ? css`
          right: 2px;
          height: calc(${percent}% - 4px);
        `
      : css`
          bottom: 2px;
          width: calc(${percent}% - 4px);
        `}
  opacity: 0.7;
  transition: width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s;

  ${({ before }) => before}
  animation: ${({ indicating, vertical }) =>
    indicating
      ? css`
          ${IndicatingAnim(vertical)} 3.5s infinite
        `
      : "none"};
}
`;
export const ProgressSlider = styled.div.attrs(({ value, vertical, theme, indicating, bg_opacity, handle = true, padding = 1, background, prog = 1, caps = 0, ...props }) => {
  const { colors, fn, global } = theme,
    { addAlpha, component_bg, secondary, hue, panel_radius = 8, secondary_hover } = { ...colors, ...fn, ...global };
  const deg = vertical ? 0 : 90;
  const before = new BackgroundMixer({ image: `linear-gradient(${deg}deg,${secondary},${secondary_hover})` });
  if (indicating) {
    before.insertBackground({ x: "-150%", w: "80px", image: IndicatingBG(hue, deg) });
  }

  return {
    percent: value * 100 || 0,
    background: background || flatGrad(addAlpha(component_bg, bg_opacity)),
    before,
    width: vertical ? props.size || "1.4rem" : "100%",
    height: vertical ? "100%" : props.size || "1.4rem",
    margin: props.margin || 0,
    cap_radius: caps * panel_radius,
    radius: (vertical ? [caps, caps, prog, prog] : [caps, prog, prog, caps]).reduce((a, v) => `${a} ${v * (panel_radius - 2)}px`, ``),
    // theme,
    children: (
      <Handle icon="bars" {...{ value, vertical }}>
        =
      </Handle>
    ),
    ...props
  };
})`
  cursor: pointer;
  background-image: ${props => props.background};
  width: ${props => props.width};
  height: ${props => props.height};
  margin: ${props => props.margin};
  box-shadow: inset 3px 3px 2px 3px rgba(0, 0, 0, 0.125);
  /* width: fit-content;
height: fit-content; */
  /* border: 1px solid #36f; */
  border-radius: ${({ cap_radius }) => cap_radius}px;
  padding: 3px;
  z-index: 1;
  backface-visibility: hidden;
  perspective: 1000px;
  transform: translateZ(0);
  padding-left: 6px;
  ${BackgroundMeter}
`;
ProgressSlider.defaultProps = {
  indicating: true,
  vertical: false,
  show_value: false,
  value: 0,
  bg_opacity: 0.08
};
