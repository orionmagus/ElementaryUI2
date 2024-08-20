import React from "react";
import styled from "styled-components";
import posed from "react-pose";

export const Cir = posed(styled.div`
  width: 100px;
  height: 100px;
  background-image: radial-gradient(circle 50px at center, transparent 25%, transparent 30%, rgba(255, 255, 255, 0.1) 75%, transparent 76%);
`)({
  init: {
    scale: 0,
    opacity: 1
  },
  visible: {
    scale: 2,
    opacity: 0,
    onPoseComplete: v => console.log(v)
  }
});
const WHDome = styled.div`
  width: 1em;
  height: 1em;
  font-size: ${({ size }) => size}px;
`;
const DomeContainer = styled.div.attrs(({ children, ...props }) => ({
  size: props.size || 30,
  children: (
    <WHDome {...props}>
      <children {...props} />
    </WHDome>
  )
}))`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-blend-mode: color-dodge;
  background: radial-gradient(circle closest-side at center center, rgba(40, 50, 45, 0.08), rgba(40, 50, 45, 0.3) 100%) no-repeat,
    radial-gradient(circle closest-side at center center, rgba(200, 255, 220, 0) 45%, rgba(200, 255, 220, 0.02) 85%, rgba(140, 160, 150, 0.15) 95%, rgba(40, 50, 45, 0.3) 100%)
      no-repeat,
    radial-gradient(circle ${({ size }) => (size / 80) * 9}px at 70% 55%, rgba(200, 255, 220, 0.3) 0%, transparent 80%) no-repeat,
    radial-gradient(circle ${({ size }) => (size / 80) * 5}px at 55% 75%, rgba(200, 255, 220, 0.2) 0%, transparent 100%) no-repeat,
    radial-gradient(circle ${({ size }) => (size / 80) * 15}px at 30% 25%, rgba(220, 245, 230, 0.4) 50%, transparent 100%) no-repeat;
`;
export const Dome = posed(styled.div.attrs(props => ({ size: props.size || 30, children: <DomeContainer {...props} /> }))`
width: fit-content;
height: fit-content;
display: block;
overflow: hidden;
padding: 15px;
/* border: ${({ size }) => (size / 80) * 10}px solid rgba(150, 150, 150, 1); */
background: rgb(50, 50, 50);
/* box-shadow: inset 0 0 10px 8px #000; */
border-radius: 50%;

`)({ draggable: true });
