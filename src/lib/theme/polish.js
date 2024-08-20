import Color from "color";
import { rgb, hsl } from "d3-color";
export const toHex = c => (c.opacity < 1 ? c.rgb().toString() : c.hex()),
  desaturate = (col, l1) => {
    const r = (100 - l1 * 100) / 100;
    var c = hsl(col);
    c.s *= r;
    return clampHSL(c);
  },
  saturate = (col, l1) => {
    const r = (100 + l1 * 100) / 100;
    var c = hsl(col);
    c.s *= r;
    return clampHSL(c);
  },
  invert = (col, amount = 1.0) =>
    rgb(
      Color(col)
        .negate()
        .string()
    ).toString(),
  invertValue = col => {
    var c = hsl(col);
    const l = c.l;
    c.l = 1 - l;
    return clampHSL(c);
  },
  clampHSL = c => {
    c.h = c.h > 0 ? Math.min(c.h, 360) : Math.max(c.h, 0);
    c.s = c.s > 0 ? Math.min(c.s, 1) : Math.max(c.s, 0);
    c.l = c.l > 0 ? Math.min(c.l, 1) : Math.max(c.l, 0);
    c.opacity = c.opacity > 0 ? Math.min(c.opacity, 1) : Math.max(c.opacity, 0);
    return toHex(c);
  },
  mix = (a, b, factor = 0.5) =>
    clampHSL(
      hsl(
        Color(a)
          .mix(Color(b), factor)
          .toString()
      )
    ),
  scale_color = (col, hue = 1.0, l1 = 100, s1 = 100) => {
    let c = hsl(col);
    const rl = (100 + l1) / 100,
      sl = (100 + s1) / 100;
    c.h *= hue;
    c.l *= rl;
    c.s *= sl;
    return clampHSL(c);
  },
  rotate = (col, degrees) => {
    var c = hsl(col);
    var hue = c.h;
    hue = (hue + degrees) % 360;
    hue = hue < 0 ? 360 + hue : hue;
    c.h = hue;
    return c;
  },
  lighten = (col, l1) => {
    const r = (100 + l1 * 100) / 100;
    var c = hsl(col);
    c.l *= r;
    return clampHSL(c);
  },
  darken = (col, l1) => {
    const r = (100 - l1 * 100) / 100;
    var c = hsl(col);
    c.l *= r;
    return clampHSL(c);
  },
  adjCol = (col, h1 = -16, s1 = -55, l1 = 2.5, direct = false) => {
    var c = rotate(col, h1);
    let { s, l } = c;
    s *= s1 / 100;
    l *= l1 / 100;
    if (direct) {
      c.s += s1 / 100;
      c.l += l1 / 100;
    } else {
      c.s += s / 100;
      c.l += l / 100;
    }
    return clampHSL(c);
  },
  complement = col => clampHSL(rotate(hsl(col), 180));
