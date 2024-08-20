import React from "react";
import styled, { css } from "styled-components";

const SplitParent = styled.div.attrs(({ split, vertical, ...props }) => {
  return { split, vertical, ...props };
})`
  display: grid;
  grid-template-columns: ${({ split, vertical }) => (vertical ? "auto" : `${split}%, ${100 - split}%`)};
  grid-template-rows: ${({ split, vertical }) => (vertical ? `${split}%, ${100 - split}%` : "auto")};
  grid-template-areas: ${({ vertical }) => (vertical ? css`"leftSide" "rightSide"` : css`"leftSide rightSide"`)};
`;
const SidePane = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  grid-area: ${props => props.side || "left"}Side;
`;
const Handle = styled.div``;
const Splitter = ({ leftSide, rightSide, handle, split, ...props }) => {
  return (
    <SplitParent split={split} {...props}>
      <SidePane side="left">{leftSide}</SidePane>
      <SidePane side="right">{rightSide}</SidePane>
      {handle && <Handle />}
    </SplitParent>
  );
};
