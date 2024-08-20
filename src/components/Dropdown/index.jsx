import React, { useState, useEffect, useCallback, useRef } from "react";
import { animated, useSpring } from "react-spring";
import styled from "styled-components";

import { Button, ProgressSlider } from "../Interactive";
const List = styled(Button.Group)`
  width: 100%;
  background: linear-gradient(rgba(150, 150, 150, 0.1), rgba(150, 150, 150, 0.1));
  & ${Button} {
    &:active,
    &:focus,
    &:hover {
      z-index: 2;
    }
    & + ${Button}:not(:last-child) {
      border-radius: 0px;
    }
    position: relative;
    width: 100%;
    max-width: 100%;
    & + ${Button} {
      border-top: 1px solid rgba(255, 255, 255, 0);
    }
    &:first-child:not(:last-child) {
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
      border-radius: 0px;
    }
    &:last-child:not(:first-child) {
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }
`;
const ScrollViewInner = styled(animated.div)`
  height: fit-content;
  min-height: 280px;
  /* background: rgba(50, 100, 150, 0.8); */
`;
const ScrollView = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-image: linear-gradient(rgba(150, 150, 150, 0.1), rgba(150, 150, 150, 0.1));
  border-radius: 5px;
  border: 1px solid rgba(50, 50, 50, 0.6);
  position: relative;
  ${ProgressSlider} {
    position: absolute;
    opacity: 0.1;
  }
  &:hover {
    ${ProgressSlider} {
      opacity: 1;
    }
  }
`;
const Scroller = ({ children, ...props }) => {
  const ref = useRef();
  const [scroll, scrollto] = useState(0);
  const scrollHandler = useCallback(e => {
    console.log(e);
    if (ref.current) {
      console.log(ref.current.getBoundingRect());
      scrollto(e.target.scrollTop / 30);
    }

    e.preventDefault();
    return false;
  }, []);
  return (
    <ScrollView
      onWheel={scrollHandler}
      // onWheelCapture={scrollHandler}
      // onScroll={scrollHandler}
      // onScrollCapture={scrollHandler}
    >
      <ProgressSlider vertical value={scroll} />
      <ScrollViewInner ref={ref}>{children}</ScrollViewInner>
    </ScrollView>
  );
};
const DropdownMenu = styled(animated.div)`
  position: relative;
  top: 100%;
  left: 0;
  right: 0;
  /* height: 300px; */
  min-width: 160px;
  z-index: 0;
  background-image: linear-gradient(rgba(150, 150, 150, 0.1), rgba(150, 150, 150, 0.1));
  border-radius: 0 0 5px 5px;
  border: 1px solid ${({ theme }) => theme.colors.tertiary};
  padding: 5px;
  border-top: 0;
  padding-top: 1px;
  overflow: hidden;
`;
const DropdownMain = styled.div`
  position: relative;
  display: inline-block;
  min-width: 160px;
  z-index: 9999;
  & > ${Button} {
    width: 100%;
    padding-right: 15px;
    justify-content: start;
    > svg {
      border-right: 0.5px solid rgba(150, 150, 150, 0.5);
    }
    z-index: 1;
    transition: all 0.5s ease 0.3s;
    background-image: linear-gradient(rgba(150, 150, 150, 0.1), rgba(150, 150, 150, 0.1));
    border: 1px solid ${({ theme }) => theme.colors.tertiary};
  }
  &:before {
    position: absolute;
    content: "";
    top: 14px;
    right: 10px;
    width: 0;
    height: 0;
    border: 6px solid transparent;
    transition: all 0.1s ease 0.5s;
    border-color: #fff transparent transparent transparent;
  }
  &.open {
    &:before {
      border-color: transparent transparent #fff transparent;
      top: 7px;
    }
    & > ${Button} {
      border-radius: 5px 5px 0 0;
      transition: all 0.1s ease 0s;
      border-bottom-color: transparent;
    }
  }
`;
export const Dropdown = ({ text = "Dropdown", active, dropdown, ...props }) => {
  const [open, toggle] = useState(active);

  const style = useSpring({
    from: { height: "0px", opacity: 0.0, display: "none", position: dropdown ? "absolute" : "relative" },
    to: async (next, cancel) => {
      // await next({ opacity: 0.2 });
      // await next({ transform: "translate(0,0)" });
      if (open) {
        await next({ display: "block" });
        await next({ opacity: 1 });
        await next({ height: "300px" });
      } else {
        await next({ height: "0px" });
        await next({ opacity: 0 });
        await next({ display: "none" });
      }
    },
    config: { duration: 500 }
  });
  const triggerProps = {
    active: open,
    icon: "filter",
    onClick: useCallback(() => toggle(!open), []),
    onFocus: useCallback(() => toggle(true), []),
    onBlur: useCallback(() => toggle(false), []),
    text
  };
  return (
    <DropdownMain className={open && "open"}>
      <Button {...triggerProps} />
      <DropdownMenu style={style}>
        <Scroller>
          {open && (
            <List
              style={{ width: "100%" }}
              vertical
              items={[
                { text: "hello" },
                { text: "hello" },
                { text: "hello" },
                { text: "hello" },
                { text: "hello" },
                { icon: "undo" },
                { text: "hello" },
                { text: "hello" },
                { text: "hello" },
                { icon: "caret-left" },
                { icon: "play" },
                { icon: "caret-right" },
                { icon: "repeat", badge: 3 }
              ]}
            />
          )}
        </Scroller>
      </DropdownMenu>
    </DropdownMain>
  );
};
Dropdown.defaultProps = {
  active: false,
  dropdown: true,
  items: [],
  setActive: v => v
};
// export const
