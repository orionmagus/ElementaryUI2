import React, { useRef, useState, useEffect } from "react";
import { Text } from "../Text";
import { Icon } from "../Icon";
import { get } from "../../lib/lodash/transformUtils";
import styled, { css } from "styled-components";
import { useTransition, animated } from "react-spring";
import useBounds, { useMeasure } from "../../lib/hooks/useBounds";
import { mix, darker, brighter, desaturate, addAlpha } from "../../lib/theme/functions";

export { ProgressSlider } from "./ProgressSlider";

const placement = {
  top: "column",
  left: "row",
  right: "row-reverse",
  bottom: "column-reverse"
};
const BG = color => `
radial-gradient(85% 80% at center top, ${color}, ${darker(color, 2)})
`,
  Badge = props => {
    const { tertiary } = props.theme.colors,
      size = props.size || 20;
    return css`
      position: relative;
      overflow: visible;
      &:hover {
        &:after {
        }
      }

      &::after {
        z-index: 1;
        content: "${props.badge}";
        line-height: ${size}px;
        text-shadow: 0px 0px 3px #000;
        font-weight: bold;
        overflow: visible;
        white-space: nowrap;
        box-sizing: border-box;
        text-align: center;
        background-color: ${tertiary};
        pointer-events: none;
        box-shadow: 0px 2px 5px ${addAlpha("#000", 0.5)};
        display: ${props.badge ? "block" : "none"};
        position: absolute;
        right: -${size / 2}px;
        top: -${size / 8}px;
        transition: width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s;

        opacity: 1;
        width: ${size}px;
        height: ${size}px;
        border-radius: 1000px;
      }
    `;
  };
const clamp = (v, min = 0) => (v < min ? min : v);

// const MessageHub = ({ config = { tension: 125, friction: 20, precision: 0.1 }, timeout = 3000, children, ...props }) => {
//   const [refMap] = useState(() => new WeakMap());
//   const [cancelMap] = useState(() => new WeakMap());
//   const [items, setItems] = useState([]);
//   const id = useRef(0);
//   const transitions = useTransition(items, item => item.key, {
//     from: { opacity: 0, height: 0, life: "100%" },
//     enter: item => async next => await next({ opacity: 1, height: refMap.get(item).offsetHeight }),
//     leave: item => async (next, cancel) => {
//       cancelMap.set(item, cancel);
//       await next({ life: "0%" });
//       await next({ opacity: 0 });
//       await next({ height: 0 });
//     },
//     onRest: item => setItems(state => state.filter(i => i.key !== item.key)),
//     config: (item, state) => (state === "leave" ? [{ duration: timeout }, config, config] : config)
//   });

//   useEffect(() => void children(msg => setItems(state => [...state, { key: id.current++, msg }])), []);
//   return (
//     <Container>
//       {transitions.map(({ key, item, props: { life, ...style } }) => (
//         <Message key={key} style={style}>
//           <Content ref={ref => ref && refMap.set(item, ref)}>
//             <Life style={{ right: life }} />
//             <p>{item.msg}</p>
//             <Button
//               onClick={e => {
//                 e.stopPropagation();
//                 cancelMap.has(item) && cancelMap.get(item)();
//               }}>
//               <X size={18} />
//             </Button>
//           </Content>
//         </Message>
//       ))}
//     </Container>
//   );
// };
const rippleMixin = (radius = 50, bg_color_stops = "rgb(0,0,0,0) 10%, rgb(0,0,0,0.5) 99%,  rgb(0,0,0,0) 100%") => css`
  position: absolute;
  top: -${radius}px;
  left: -${radius}px;
  width: ${radius * 2}px;
  height: ${radius * 2}px;
  border-radius: ${radius * 2}px;
  transform-origin: ${radius}px ${radius}px;
  background-image: radial-gradient(circle ${radius}px at ${radius}px ${radius}px, ${bg_color_stops});
`;
const glowMixin = color =>
  css`
    box-shadow: 0 0 1px ${color}, inset 0 0 5px ${color};
  `;
export const Ripple = styled(animated.div).attrs(({ x = 0, y = 0, radius = 50, highlight_color = "#FFF", ...props }) => {
    return {
      x,
      y,
      radius,
      // glow: glowMixin(addAlpha(highlight_color, 0.6)),
      mixin: rippleMixin(
        radius,
        Object.entries({
          10: 0,
          50: 0.2,
          99: 0.5,
          100: 0
        })
          .map(([pos, opacity]) => `${addAlpha(highlight_color, opacity)} ${pos}%`)
          .join(", ")
      ),
      ...props
    };
  })`
    opacity: 1;
    pointer-events: none;
    ${({ mixin }) => mixin};
    ${({ glow }) => glow};
    transform-origin: ${({ radius }) => `${radius}px ${radius}px`};

    backface-visibility: hidden;
    will-change: transform, opacity;
    content: "";
  `,
  RippleContainer = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    background-blend-mode: color-dodge;
  `;

const ColorStops = stops => {};
/* 
{
         0: addAlpha(highlight_color, 0),
        30: addAlpha(highlight_color, 0),
        
        45: addAlpha(highlight_color, 0.2), 
        50: addAlpha(highlight_color, 0),
        75: addAlpha(highlight_color, 0.2),
        80: addAlpha(highlight_color, 0.0), 
        85: addAlpha(highlight_color, 0.5), 
        99: addAlpha(highlight_color, 0.5),
        100: addAlpha(highlight_color, 0)
      }
*/
var uid = 0;
const getXY = ({ pageX, pageY }, { top, left }) => ({ x: pageX - left, y: pageY - top });
const RippleEffect = ({ config = { tension: 125, friction: 20, precision: 0.1 }, timeout = 300, children, ...props }) => {
  const [items, setItems] = useState([]);

  const containeRef = useRef(),
    id = useRef(0);
  const bounds = useBounds(containeRef);
  const transitions = useTransition(items, item => item.key, {
      from: ({ x, y, ...item }) => ({ opacity: 1, transform: `translate(${x}px, ${y}px) scale(0)` }),
      enter:
        ({ x, y, ...item }) =>
        async next =>
          await next({ opacity: 0.05, transform: `translate(${x}px, ${y}px) scale(2)` }),
      leave:
        ({ x, y, ...item }) =>
        async (next, cancel) => {
          await next({ opacity: 0.02 });
          await next({ transform: `translate(${x}px, ${y}px) scale(3)` });
          await next({ opacity: 0 });
        },
      onRest: item => setItems(state => state.filter(i => i.key !== item.key)),
      config: (item, state) => [{ duration: timeout }, config, config]
    }),
    mouseDown = ({ pageX, pageY }) => {
      if (!bounds) {
        return;
      }
      const item = {
        key: uid++,
        ...getXY({ pageX, pageY }, bounds)
      };
      console.log(item);
      setItems(state => [...state, item]);
    };

  return (
    <RippleContainer className="effect" ref={containeRef} onMouseDown={mouseDown}>
      {children}
      {transitions.map(({ key, item, props }) => (
        <Ripple key={key} style={props} {...item} />
      ))}
    </RippleContainer>
  );
};
const ButtonComponent = ({ effect = false, icon, text, cstate, enabled, active, primary, rounded, measureCallBack = v => v, children, ...props }) => {
  const ref = useRef();
  const [{ x, y }, setPos] = useState({ x: 0, y: 0, show: false, pageX: 0, pageY: 0 });

  const bounds = useBounds(ref, measureCallBack),
    button_props = {
      ...props,
      // bounds,
      style: { "--x": `${x}px`, "--y": `${y}px`, "--before-opacity": 1, ...props.style },
      onMouseMove: ({ pageX, pageY }) => setPos(state => ({ ...state, pageX, pageY, ...getXY({ pageX, pageY }, bounds) }))
      // onMouseEnter: e => setPos(state => ({ ...state, show: true })),
      // onMouseLeave: e => setPos(state => ({ ...state, show: true }))
    };

  const contents = (
    <React.Fragment>
      {icon && <Icon name={icon} />}
      {(text || children) && <Text>{text || children}</Text>}
    </React.Fragment>
  );
  return (
    <animated.button ref={ref} {...button_props}>
      {effect ? <RippleEffect>{contents} </RippleEffect> : contents}
    </animated.button>
  );
};
export const qa = c => addAlpha(c, 0.8),
  flatGrad = c => `linear-gradient(${c},${c})`,
  movingCircleGrad = (c, gradientSize = 50, varX = "x", varY = "y") => `radial-gradient(circle ${gradientSize}px at var(--${varX}) var(--${varY}), ${c}, transparent)`,
  FlatBG = ({ primary, secondary, tertiary, text, text_hover, button_hover, button_bg, ...colors }, using) => {
    const bg_color = qa(button_bg),
      hover_bg_color = qa(brighter(tertiary)),
      using_hover_bg = qa(get(colors, `${using}_hover`, button_hover)),
      hover_active_bg_color = qa(mix(darker(button_bg, 3), primary, 0.5)),
      active_bg_color = qa(mix(button_hover, primary, 0.5)),
      bg = flatGrad(bg_color),
      active_bg = flatGrad(active_bg_color),
      hover_active_bg = flatGrad(hover_active_bg_color),
      hover_bg = `${bg}, ${movingCircleGrad(hover_bg_color)}`;

    return {
      bg,
      fg: text,
      hover_bg,
      hover_fg: text_hover,
      active_bg,
      active_fg: text_hover,
      hover_active_bg
    };
  },
  FluentEffectMixin = ({
    text,
    text_hover,
    top,
    left,
    width = "100%",
    height = "100%",
    borderWidth = 1,
    radiuses = [5],
    padding = 3,
    gradientSize = 150,
    lightColor = "#fff",
    ...props
  }) => {
    const radius = radiuses.reduce((a, c) => `${a} ${c}px`, ""),
      inner_radius = radiuses.reduce((a, c) => `${a} ${clamp(c - borderWidth)}px`, ""),
      borderWidthTimes2 = borderWidth * 2,
      bg = {
        main_over: movingCircleGrad(addAlpha(lightColor, 0.4), gradientSize),
        main: movingCircleGrad(addAlpha(lightColor, 0.4), gradientSize, "x", "y"),
        before: flatGrad(addAlpha("#111", 0.6))
      };
    return css`
      border-radius: ${radius};
      border: 0;
      background-image: ${bg.main};
      padding: ${borderWidth + padding}px;
      color: ${text || "#dedede"};
      width: ${width};
      height: ${height};
      position: relative;
      box-sizing: border-box;

      min-height: fit-content;
      z-index: 0;
      &::before {
        border-radius: ${radius};
        background-image: ${bg.before};
        box-sizing: content-box;
        display: block;
        transition: opacity 0.4s;
        color: ${text || "#dedede"};
        opacity: var(--before-opacity);
        width: calc(${width} - ${borderWidthTimes2}px);
        height: calc(${height} - ${borderWidthTimes2}px);
        top: ${borderWidth}px;
        left: ${borderWidth}px;
        content: "";
        position: absolute;
        z-index: -1;
      }
    `;
  },
  FlatMixin = ({ theme, using, radius, gradientSize = 50, ...props }) => {
    const p = FlatBG(theme.colors, using);
    return css`
      background-color: transparent;
      transition: filter 0.8s, box-shadow 0.8s;
      border-radius: ${radius}px;
      box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0), 0px 0px 0px rgba(0, 0, 0, 0) inset;
      border: 1px solid transparent;

      background-image: ${p.bg};
      color: ${p.fg};
      &.hover,
      &:hover {
        background-image: ${p.hover_bg};
        /* filter: brightness(220%) saturate(200%); */
        color: ${p.hover_fg};
      }
      &.active,
      &:active {
        background-image: ${p.active_bg};
        color: ${p.active_fg};
        box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
        &.hover,
        &:hover {
          background-image: ${p.hover_active_bg};
          color: ${p.hover_fg};
        }
      }
    `;
  };
export const StyledButton = styled(ButtonComponent).attrs(({ theme, using, icon, text, cstate, enabled, active, primary: isPrimary, rounded, children, ...props }) => {
  const radius = rounded ? theme.global.round : theme.global.button_radius;
  // if (props.debug) {
  //   console.log(props);
  // }
  return {
    effectMixin: FlatMixin({
      radius,
      theme,
      using,

      ...props
    }),
    radius,
    theme,
    using,
    ...props
  };
})`
  position: relative;
  font-weight: bold;
  overflow: hidden;
  background-blend-mode: hard-light;
  /* background-clip: padding-box; */
  & > div.effect {
    text-align: center;
    vertical-align: middle;
  }
  padding: 3px 4px;

  cursor: pointer;
  will-change: transform, opacity, background-image, filter, box-shadow;
  /* transition: all 0.4s cubic-bezier(0.6, -0.6, 0.75, 0.75); */

  display: flex;
  flex-direction: ${props => placement[props.icon_placement] || placement.left};
  justify-content: center;
  align-items: center;
  ${Icon} {
    margin: 0;
  }
  ${Text} {
    margin: 0 4px;
    padding-top: 2px;
    line-height: 1.2rem;
  }
  &:focus {
    outline: none;
  }
  &.blocks {
    display: inline-block;
    min-width: 50px;
  }
  background-color: transparent;
  ${props => props.effectMixin}
  &.disabled {
    pointer-events: none;
    cursor: none;
    box-shadow: none;
    color: rgba(0, 0, 0, 0.015);
    filter: grayscale(95%) contrast(15%);
    &.hover,
    &.active,
    &:hover {
      color: rgba(0, 0, 0, 0.015);
    }
  }
  ${props => Badge(props)}
`;
StyledButton.defaultProps = {
  using: "button",
  icon_placement: "left",
  colors: ["basic", "tertiary", "primary", "secondary", "xray"],
  primary: false,
  rounded: false,
  active: false,
  enabled: true,
  icon: false,
  badge: "",
  text: false
};

/* <Transition
  items={items} keys={item => item.key}
  from={{ transform: 'translate3d(0,-40px,0)' }}
  enter={{ transform: 'translate3d(0,0px,0)' }}

   from: { transform: "translate3d(0,-40px,0)", opacity: 0 },
    enter: { transform: "translate3d(0,0px,0)", opacity: 1 },
    leave: { transform: "translate3d(0,-40px,0)", opacity: 0 },
  leave={{ transform: 'translate3d(0,-40px,0)' }}>
  0px 5px 10px 5px rgba(0,0,0,0.2), 0px 0px 0px rgba(0,0,0,0) inset
  {item => props => <div style={props}>{item.text}</div>}
</Transition> */
export const GroupCss = (GroupComponent = StyledButton) => css`
  display: flex;
  width: fit-content;
  & ${GroupComponent} {
    &:active,
    &:focus,
    &:hover {
      z-index: 2;
    }
    & + ${GroupComponent}:not(:last-child) {
      border-radius: 0px;
    }
  }
  &.horizontal {
    flex-direction: row;
    & ${GroupComponent} {
      & + ${GroupComponent} {
        border-left-color: rgba(255, 255, 255, 0);
      }
      &:first-child:not(:last-child) {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }

      &:last-child:not(:first-child) {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
      }
    }
  }
  &.vertical {
    flex-direction: column;
    & ${GroupComponent} {
      position: relative;
      width: 100%;
      max-width: 100%;
      & + ${GroupComponent} {
        border-top: 4px solid rgba(255, 255, 255, 0);
      }
      &:first-child:not(:last-child) {
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
      }
      &:last-child:not(:first-child) {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
      }
    }
  }
`;
const useBGPos = (props, style, when = false) => {
  const ref = useRef();
  const [{ x, y, bopacity }, setPos] = useState({ x: -5000, y: -500, bopacity: 0, pageX: 0, pageY: 0 });

  const bounds = useBounds(ref);
  const group_props = {
    ...props,
    style: { "--group-x": `${x}px`, "--group-y": `${y}px`, "--before-opacity": bopacity, ...style },
    onMouseMove: ({ pageX, pageY }) => setPos(state => ({ ...state, pageX, pageY, ...getXY({ pageX, pageY }, bounds) })),
    onMouseEnter: e => setPos(state => ({ ...state, bopacity: 1 })),
    onMouseLeave: e => setPos(state => ({ ...state, x: -5000, y: -500, bopacity: 0 }))
  };
  if (!when) {
    return [{ ...props, style }, {}];
  }
  return [{ ref, ...group_props }, bounds];
};
const useSlideIn = (buttons, vertical) => {
  const transitions = useTransition(buttons, item => item.key, {
    from: { transform: `translate(${vertical ? -50 : 0}px,${vertical ? 0 : -50}px)`, opacity: 0 },
    enter: { transform: "translate(0,0) ", opacity: 1 },
    leave: { transform: `translate(${vertical ? 50 : 0}px,${vertical ? 0 : 50}px)`, opacity: 0 },
    trail: 100
  });
  return transitions.map(({ item, props, ...rest }) => ({ style: props, props: item, ...rest }));
};
const useItemsChildren = ({ children, before, items }) => {
  const f = React.Children.map(children, ({ props }) => props);
  const [buttons, set] = useState([]);
  useEffect(() => set(state => state.concat(...(before ? [items, f] : [f, items])).map((b, i) => ({ ...b, key: `item.${i}` }))), []);
  return buttons;
};
export const ButtonGroup = styled(({ children, before, select, multi, items, vertical, shouldAnim = false, style = {}, className = "", ...props }) => {
  const g_props = {
    ...props,
    className: `${className} ${vertical ? "vertical" : "horizontal"}`
  };
  const [group_props] = useBGPos(g_props, style);
  const buttons = useItemsChildren({ children, before, items });

  const uitems = shouldAnim ? useSlideIn(buttons, vertical) : buttons;
  return (
    <div {...group_props}>
      {uitems.map(({ key, ...props }, i) => (
        <StyledButton key={key} {...props} />
      ))}
    </div>
  );
})`
  background: transparent;
  padding: 1px;
  border-radius: 5px;
  ${GroupCss()}
  &.small {
    & > ${StyledButton} {
      padding: 5px 10px;
      font-size: 12px;
      line-height: 1.5;
      border-radius: 3px;
    }
  }
`;
StyledButton.Group = ButtonGroup;
export const Button = StyledButton;

const Toggle = props => WrappedComponent => {
  const [select, setSelect] = useState(false),
    handler = e => {
      setSelect(!select);
      const propHandler = props.onClick || false;
      if (propHandler) {
        propHandler.apply(null, e);
      }
    };
  return <WrappedComponent onClick={handler} />;
};
