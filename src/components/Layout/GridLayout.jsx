import React, { Children, useRef } from "react";
import { useTransition, useChain, config, animated } from "react-spring";
// import posed, { PoseGroup } from "react-pose";
import styled from "styled-components";
// import { createStyleBuilder } from "stylefire/lib/css/build-styles";

const LayoutBase = props => {},
  GridDiv = styled(props => {
    return <div>{props.children}</div>;
  })``;
const GridLayout = styled.section.attrs(({ children, ...props }) => {
  const items = Children.map(props.children, c => c);
  const order = useRef(items.map((_, id) => id));
  return { ...props, children: items.map((Component, id) => <Component key={id} order={order.current[id]} />) };
})`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(3, 1fr);
  grid-gap: 8px;
  gap: 8px;
  height: inherit;
  height: 100%;
  & > div {
    width: 100%;
    min-height: 60px;
    box-shadow: 0 0 10px rgba(65, 65, 65, 0.514) inset;
    border-radius: $radius_med;
    background: $component_bg;
    overflow: hidden;
  }
`;
