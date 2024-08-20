import {
  pipe,
  clamp,
  interpolate,
  blendColor,
  conditional
} from "popmotion.transform";
import { decay, spring, transform, value, easing, keyframes } from "popmotion";
export {
  decay,
  spring,
  transform,
  value,
  easing,
  keyframes,
  pipe,
  clamp,
  interpolate,
  blendColor,
  conditional
};
export default {
  btn: {
    hoverable: true,
    pressable: true,
    init: {
      background: "var(--component-bg)",
      color: "var(--primary)",
      boxShadow: ""
    },
    hover: { scale: 1.1 },
    press: { scale: 0.8 }
  },
  collapsibleHeight: {
    closed: { height: 0 },
    open: { height: "auto" }
  }
};
