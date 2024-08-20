import React, { useState } from "react";
import posed from "react-pose";
import { rgb } from "d3-color";
import styled, { withTheme } from "styled-components";
import { mix, brighter } from "../../lib/theme/functions";
const fns = {
    brighter: (col, k = 1) => col.brighter(k),
    darker: (col, k = 1) => col.darker(k),
    setAlpha: (c, a = 1) => {
      c.opacity = 1;
      return c;
    }
  },
  alterColor = (col, funcs) => {
    const c = rgb(col);
    return Object.entries(funcs).reduce((acc, [name, fnCfg]) => ({ ...acc, [name]: Object.entries(fnCfg).reduce((a, [fn, args]) => fns[fn](a, args), c) }), {});
  };
const GradientBorderStyle = styled.div.attrs(props => {
  const colors = {
    ...alterColor(props.theme.colors.secondary || props.primary_color, {
      shadow_color: { setAlpha: 0.3, brighter: 1 },
      primary_light: { setAlpha: 0.9, brighter: 2 },
      primary_dark: { setAlpha: 0.8, darker: 3 }
    }),
    ...alterColor(mix(props.theme.colors.component, props.theme.colors.primary, 0.7) || props.background, {
      background_light: { setAlpha: 1, brighter: 2 },
      background_dark: { setAlpha: 0.9, darker: 3 }
    })
  };
  return {
    ...props,
    ...colors,
    beforeBG: `radial-gradient( 30% 80px at top, ${colors.background_light}, ${colors.background_dark}) `,
    bg: ` radial-gradient( 60% 75% at top, ${colors.primary_light}, ${colors.primary_dark}) `,
    borderWidthTimes2: props.borderWidth * 2,
    inner: {
      radius: props.radius - props.borderWidth > 3 ? props.radius - props.borderWidth : 3
    }
  };
})`
  border-radius: ${props => props.radius}px;
  background-image: ${props => props.bg};
  padding: ${props => props.borderWidth + props.padding}px;

  width: ${props => props.width};
  height: ${props => props.height};
  position: relative;
  box-sizing: border-box;
  /* box-shadow: 0px 0px 25px 3px ${props => props.shadow_color}; */
  min-height: fit-content;
  z-index:0;
  &::before {
    border-radius: ${props => props.inner.radius}px;
    background-image: ${props => props.beforeBG};
  
    box-sizing: content-box;
    display:block;
    /* box-shadow: 0 0 8px 2px ${props => props.shadow_color} inset; */
    /* box-shadow: 0 0 18px 18px ${props => props.shadow_color} inset; */
    width: calc(${props => props.width} - ${props => props.borderWidthTimes2}px);
    height: calc(${props => props.height} - ${props => props.borderWidthTimes2}px);
    top: ${props => props.borderWidth}px;
    left: ${props => props.borderWidth}px;
    content: "";
    position: absolute;
    z-index: -1;
  }
`;

GradientBorderStyle.defaultProps = {
  radius: 24,
  borderWidth: 8,
  width: "100%",
  height: "100%",
  primary_color: "#0099ff",
  background: "#252525",
  padding: 12,
  useShadow: true
};
export const GradientBorder = withTheme(
  posed(GradientBorderStyle)({
    enter: { x: 0, opacity: 1 },
    visible: { x: 0, opacity: 1 },
    exit: { x: 200, opacity: 0 }
    // hoverable: true,
    // init: {
    //   boxShadow: props => `0px 0px 25px -6px ${props.theme.colors.secondary}`,
    //   transition: { type: "tween", delay: 300, duration: 800 }
    // },
    // hover: {
    //   boxShadow: props => `0px 0px 35px 3px ${brighter(props.theme.colors.secondary, 3)}`,
    //   transition: { type: "tween", delay: 300, duration: 1800 }
    // }
  })
);
export default GradientBorder;
