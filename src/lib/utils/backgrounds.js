import React from "react";
import { css } from "styled-components";
import { Record } from "immutable";

class Background extends Record({ position: "", size: "", image: "", origin: "", color: "", repeat: "no-repeat", clip: "", attachment: "" }) {
  valueOf() {}
  toString() {
    const { color, image, position, size, repeat, origin, clip, attachment } = this;
    return css`
      ${[color, image, position, size, repeat, origin, clip, attachment].filter(v => !!v).join(" ")}
    `;
  }
}

class BackgroundMixer {
  constructor(...bgs) {
    this.backgrounds = [];

    this.addBackgrounds(...bgs);
  }
  get all() {
    //origin,clip,attachment
    return "image,position,size,repeat".split(",").reduce((acc, k) => ({ ...acc, [k]: this.backgrounds.map(bg => bg.get(k)) }), {});
  }
  addBackground = ({ x = 0, y = 0, w = "100%", h = "100%", ...opts }) => {
    const bg = new Background({
      position: [x, y].join(" "),
      size: [w, h].join(" "),
      image: "",
      origin: false,
      color: false,
      repeat: "no-repeat",
      clip: false,
      attachment: false,
      ...opts
    });
    this.backgrounds.push(bg);
  };
  addBackgrounds = (...bgs) => bgs.forEach(o => this.addBackground(o));
  toString() {
    return Object.entries(this.all).map(([name, value]) => `  background-${name}: ${value.join(", ")};`).join(`    
    `);
  }
}
