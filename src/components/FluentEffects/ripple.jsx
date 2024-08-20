import { css } from "styled-components";

const rippleEffect = (radius, background = "rgba(0,0,0,0.06)") => css`
  position: absolute;
  top: calc(50% - ${radius}%);
  left: calc(50% - ${radius}%);
  width: ${radius * 2}%;
  height: ${radius * 2}%;
  transition: opacity 250ms linear;
  border-radius: 50%;
  opacity: 0;
  pointer-events: none;
  background-color: ${background};
  content: "";
`;

const rippleMixin = (radius = 100, background = "rgba(0,0,0,0.06)") => css`
  will-change: transform, opacity;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  &:after {
    transform-origin: center center;
    ${rippleEffect(radius, background)}
  }
  &:before {
    ${rippleEffect(radius, background)}
  }
  &:hover:before,
  &:focus:before,
  &:active:after {
    transition-duration: 85ms;
    opacity: 0.6;
  }
`;

export default rippleMixin;
