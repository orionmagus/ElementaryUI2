const UIactions = {
  hover: {
    hoverable: true,
    init: {
      boxShadow: "0px 0px 0px 0px rgba(0,0,0,0) "
    },
    hover: {
      boxShadow: "0px 5px 10px 5px rgba(0,0,0,0.2)"
    }
  },
  focus: {
    focusable: true,
    init: {
      color: "#aaa",
      outlineWidth: "0px",
      outlineOffset: "0px"
    },
    focus: {
      color: "#000",
      outlineWidth: "12px",
      outlineOffset: "5px",
      outlineColor: "#AB36FF"
    }
  },
  drag: {},
  press: {
    pressable: true,
    hoverable: true,
    init: {
      boxShadow: "0px 0px 0px 0px rgba(0,0,0,0), 0px 0px 0px rgba(0,0,0,0) inset"
    },
    hover: {
      boxShadow: "0px 5px 10px 5px rgba(0,0,0,0.2), 0px 0px 0px rgba(0,0,0,0) inset"
    },
    press: {
      boxShadow: "0px 0px 0px 0px rgba(0,0,0,0), 2px 2px 5px 2px rgba(0,0,0,0.8) inset"
    },
    onPressStart: v => v,
    onPressEnd: v => v
  }
};

// const buttonCSS = {
//   basic: css`
//     background: var(--button-color);
//     color: var(--text);
//     &.hover,
//     &:hover {
//       background: var(--primary);
//       color: var(--text-hover);
//     }
//     &.active,
//     &:active {
//       background: var(--primary);
//       -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
//       -moz-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
//       box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
//       &.hover,
//       &:hover {
//         background: var(--primary-hover);
//         color: var(--text-hover);
//       }
//     }
//   `,
//   primary: css`
//     background-color: var(--primary);
//     color: var(--text);
//     border-color: var(--border-color);

//     &:hover,
//     &:active {
//       background-color: var(--primary-hover);
//     }
//   `
// };
