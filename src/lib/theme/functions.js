import Color from "color";
import { rgb } from "d3-color";
import { css } from "styled-components";
import { mix, toHex, scale_color, adjCol, complement, invert, invertValue, darken, lighten, saturate, desaturate } from "./polish";
export const createMediaQueryFunctions = (sizes, baseEm = 16) =>
    Object.entries(sizes).reduce((acc, [name, value]) => {
      acc[name] = (...args) => css`
        @media (min-width: ${value / baseEm}em) {
          ${css(...args)}
        }
      `;
      return acc;
    }, {}),
  isDark = col => Color(col).isDark(),
  hsl = (h, s, l) => Color({ h, s, l }).string(),
  addAlpha = (col, alpha = 0.95) =>
    Color(col)
      .alpha(alpha)
      .string(),
  brighter = (col, k = 1) =>
    rgb(col)
      .brighter(k)
      .toString(),
  darker = (col, k = 1) =>
    rgb(col)
      .darker(k)
      .toString();
export { mix, toHex, scale_color, adjCol, complement, invert, invertValue, darken, lighten, saturate, desaturate };
// window.Color = Color;
// window.fnc = { hsl, mix, addAlpha, scale_color, adjCol, invert, darken, lighten, invertValue, desaturate };
