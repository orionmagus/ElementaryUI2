import { rgb } from "d3-color";

export const within_bounds = ([[xn, yn], [xx, yx]], [x, y]) => xn <= x && x <= xx && yn <= y && y <= yx,
  luma = ({ r, g, b }) => 0.2126 * r + 0.7152 * g + 0.0722 * b, // per ITU-R BT.709
  luminosity = c => luma(c) / 254.999,
  to_fg_color = (color, k = 2) => (luminosity(color) > 0.5 ? color.darker(k) : color.brighter(k)).toString(),
  in_fg = color => (luminosity(color) > 0.5 ? "#242424" : "#dedede"),
  isDarkColor = c => luma(c) < 40,
  ckeys = ["r", "g", "b", "opacity"],
  colFactor = ({ r, g, b, opacity }, factor = 0.5) => ({ r: r * factor, g: g * factor, b: b * factor, opacity: opacity * factor }),
  mixColor = (cA, cB, factor = 0.5) => [colFactor(rgb(cB), factor)].reduce((a, c) => rgb(ckeys.map(k => a[k] + c[k])), colFactor(rgb(cA), 1.0 - factor));
