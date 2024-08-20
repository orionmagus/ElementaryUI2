import React, { useState } from "react";
import posed from "react-pose";
import styled, { css } from "styled-components";
import { Icon } from "../Icon";
import { tween } from "popmotion";
import "./style.scss";
const validationMixin = css`
  &:valid + span,
  &:invalid + span {
    position: relative;
  }
  &:valid + span,
  &:invalid + span,
  &.validate {
    :after {
      position: absolute;
      right: 18px;
    }
  }
  &:invalid + span:after,
  &.validate:invalid:after {
    content: "✖";
  }
  &:valid + span:after,
  &.validate:valid:after {
    content: "✓";
  }
`;
export const BaseInput = styled.input.attrs(props => ({
  type: "text",
  padding: "0em 0.25em",
  ...props
}))`
  display: block;
  outline: none;
  border: none;
  width: 100%;
  font-size: 1.2rem;
  background: transparent;
  color: currentColor;
  padding: ${props => props.padding};
  position: relative;
`;
export const Label = styled.div`
  background: var(--input-bg);
  color: var(--input-fg);
  border: 1px solid var(--input-fg);
  box-shadow: 2px 2px 8px 1px #666 inset, 0px 0px 3px hsla(var(--hue), 40%, 90%, 0.3);
  border-radius: 5px;
  display: flex;
  overflow: hidden;
  /* height: 32px; */
  &.iconified {
    display: grid;
    grid-template-columns: 32px 1fr;
    align-items: center;
  }

  & > ${Icon}, & > ${BaseInput}::placeholder {
    user-select: none;
    opacity: 0.5;
    transition: opacity 0.8s ease 0.4s;
  }
  &:hover {
    ${Icon}, ${BaseInput}::placeholder {
      opacity: 0.9;
      transition: opacity 0.8s ease;
    }
  }
  &.focus,
  &:focus {
    box-shadow: 0px 4px 16px #333 inset, 0px 0px 2px #666 inset;
    border: 1px solid hsl(var(--hue), 90%, 40%);
  }
`;
export const Field = styled.div`
  padding: 0.25em 0.5em;
  padding-bottom: ${props => props.pad_bottom || "0"};
`;
const DropDown = posed.ul({
  open: {
    height: 230,
    delayChildren: 50,
    staggerChildren: 50,
    transition: tween,
    flip: true
  },
  closed: {
    height: 0,
    delayChildren: 50,
    staggerChildren: 50,
    transition: tween,
    flip: true
  },
  initialPose: "closed"
});

const Item = posed.li({
  open: {
    x: 0,
    opacity: 1,
    transition: {
      x: ({ velocity, to }) => (velocity < 0 ? { to: -300 } : { to }),
      opacity: { type: "spring" }
    }
  },
  closed: {
    x: 50,
    opacity: 0,
    transition: {
      x: ({ velocity, to }) => (velocity < 0 ? { to: -300 } : { to }),
      opacity: { type: "spring" }
    }
  }
});
const poses = {
  attention: {
    scale: 1.3,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 0
    }
  },
  iconified: {
    open: {
      width: "100%",
      transition: {
        type: "physics",
        velocity: 1000
      }
    },
    close: {
      width: "32px",
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 0
      }
    }
  },
  dropdown: {
    open: {},
    close: {}
  }
};
export const PoseIt = posed(BaseInput);
const PosedLabel = posed(Label);
const IconifiedLabel = posed(Label)({
  open: {
    width: "100%",
    borderRadius: 5,
    transition: {
      borderRadius: {
        duration: ({ duration }) => duration,
        delay: ({ duration, delay }) => delay,
        ease: ({ easing }) => easing
      },
      width: {
        duration: ({ duration }) => duration,
        delay: ({ delay }) => delay,
        ease: ({ easing }) => easing
      }
    },
    flip: true
  },
  close: {
    width: 45,
    borderRadius: 80,
    transition: {
      borderRadius: {
        duration: ({ duration }) => duration,
        delay: ({ duration, delay }) => delay,
        ease: ({ easing }) => easing
      },
      width: {
        duration: ({ duration }) => duration,
        delay: ({ duration, delay }) => delay + delay,
        ease: ({ easing }) => easing
      }
    },
    flip: true
  },
  initialPose: ({ init }) => init,
  props: {
    widthClosed: 32,
    widthOpen: 230,
    duration: 800,
    delay: 400,
    easing: "linear",
    init: "closed"
  }
});
const IconifiedInput = posed(BaseInput)({
  open: {
    width: ({ widthOpen }) => widthOpen,
    transition: {
      width: {
        duration: ({ duration }) => duration,
        delay: ({ delay }) => delay,
        ease: ({ easing }) => easing
      }
    },
    flip: true
  },
  close: {
    width: ({ widthClosed }) => widthClosed,
    transition: {
      width: {
        duration: ({ duration }) => duration,
        delay: ({ delay }) => delay,
        ease: ({ easing }) => easing
      }
    },
    flip: true
  },
  initialPose: ({ init }) => init,
  props: {
    widthClosed: 32,
    widthOpen: 230,
    duration: 800,
    delay: 400,
    easing: "anticipate",
    init: "closed"
  }
});
const labelMap = {
  default: Label,
  iconified: IconifiedLabel,
  drop: Label
};
export const Input = ({ onValueChange, border, pad_bottom, label, icon, initialPose, mode, ...inprops }) => {
  // const { set, ...props } = useField(inprops.value);
  const [focusedf, setFocused] = useState(false);
  const [active, setActive] = useState(false);

  const getHandle = f => () => setFocused(f),
    open = () => setActive(true),
    close = () => setActive(false),
    props = { onFocus: getHandle(true), onBlur: getHandle(false), ...inprops },
    fprops = {},
    lprops = { border, pose: `${active || focusedf ? "open" : "close"}`, className: `${focusedf ? "focus" : ""} ${mode}` };

  const CurrLabel = labelMap[mode] || Label;
  return (
    <Field pad_bottom={pad_bottom} onMouseOver={open} onMouseOut={close}>
      <CurrLabel {...lprops}>
        {icon && <Icon name={icon} />}
        <BaseInput {...props} onChange={onValueChange} />
      </CurrLabel>
    </Field>
  );
};
Input.defaultProps = {
  value: null,
  label: "",
  border: 1,
  padded: true,
  initialPose: "close",
  pad_bottom: "1em",
  icon: "user",
  mode: "default", //'default', 'iconified', 'drop'
  placeholder: "Username",
  type: "text",
  onValueChange: v => v
};
export default {
  Input
};
