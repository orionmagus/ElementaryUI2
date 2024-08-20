import React, { useState, useMemo } from "react";
import posed from "react-pose";
import styled from "styled-components";
import elevateCss from "./elevation";
export const Paper = styled.div.attrs(props => ({
  elevation: props.elevation || 0,
  opaque: 0.8
}))`
  background: rgba(150, 150, 150, ${props => props.opaque});
  ${({ elevation }) => elevateCss(elevation)};
`;
