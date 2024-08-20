import React, { useState, useEffect } from "react";
import posed from "react-pose";
import styled from "styled-components";
import Loader from "../Loader";

import { useSpring, animated } from "react-spring";

const AnimFittedDiv = styled(animated.div)`
    width: fit-content;
    height: fit-content;
    position: absolute;
    cursor: pointer;
    backface-visibility: hidden;
    will-change: transform, opacity;
  `,
  FlipCard = props => {
    const [flipped, set] = useState(false);
    const { transform, opacity } = useSpring({
      opacity: flipped ? 1 : 0,
      transform: `perspective(600px) rotateX(${flipped ? 180 : 0}deg)`,
      config: { mass: 5, tension: 500, friction: 80 }
    });
    return (
      <div onClick={() => set(state => !state)}>
        <AnimFittedDiv key="front" style={{ opacity: opacity.interpolate(o => 1 - o), transform }}>
          {props.children}
        </AnimFittedDiv>
        <AnimFittedDiv key="back" style={{ opacity, transform: transform.interpolate(t => `${t} rotateX(180deg)`) }} />
      </div>
    );
  };

const calc = (x, y, fac) => [-(y - window.innerHeight / 2) / fac, (x - window.innerWidth / 2) / fac, 0.9];
const trans = (x, y, s) => `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`;

export const ParalDiv = props => {
  const [spr, set] = useSpring(() => ({ xys: [0, 0, 1], config: { mass: 5, tension: 500, friction: 80 } }));
  const fac = 30;
  useEffect(() => {
    const listener = ({ pageX: x, pageY: y }) => set({ xys: calc(x, y, fac) });
    window.addEventListener("mousemove", listener);
    return () => window.removeEventListener("mousemove", listener);
  }, []);
  return (
    <AnimFittedDiv
      onMouseMove={({ pageX: x, pageY: y }) => set({ xys: calc(x, y, fac) })}
      onMouseLeave={() => set({ xys: [0, 0, 1] })}
      style={{ transform: spr.xys.interpolate(trans) }}>
      {props.children}
    </AnimFittedDiv>
  );
};
const transPose = {
    beforeChildren: true,
    transition: {
      width: { duration: 80 },
      height: { delay: 80, duration: 300 },
      default: { duration: 80 }
    }
  },
  enterPose = {
    width: "100%",
    height: "100%",
    position: "absolute",
    background: "rgba(0,0,0,0.6)",
    top: 0,
    left: 0,
    opacity: 1,
    flip: true,
    ...transPose
  };
const Overlay = posed.div({
    overlay: enterPose,
    show: {
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      background: "rgba(50,50,150,0.0)",
      opacity: 0,
      position: "relative",
      ...transPose,
      afterChildren: true,
      beforeChildren: false,
      flip: true
    }
  }),
  OverlayContainer = styled.div`
    width: fit-content;
    height: fit-content;
    position: relative;
  `,
  OverlayContent = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
  `,
  OverlayedContent = posed.div({
    show: {
      filter: "blur(0)",
      transition: {
        filter: {
          type: "keyframes",
          values: ["blur(5px)", "blur(4px)", "blur(3px)", "blur(2px)", "blur(1px)", "blur(0px)"],
          times: [0, 0.1, 0.28, 0.46, 0.58, 0.74, 0.82, 1],
          duration: 300
        }
      }
    },
    overlay: {
      filter: "blur(5px)",
      transition: {
        filter: {
          type: "keyframes",
          values: ["blur(0px)", "blur(1px)", "blur(2px)", "blur(3px)", "blur(4px)", "blur(5px)"],
          times: [0, 0.1, 0.28, 0.46, 0.58, 0.74, 0.82, 1],
          duration: 500
        }
      }
    }
  });

const ove = styled.div`
  #overlay {
    position: fixed;
    display: none;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 2;
    cursor: pointer;
  }

  #text {
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 50px;
    color: white;
    transform: translate(-50%, -50%);
    -ms-transform: translate(-50%, -50%);
  }
`;
const withOverlay = WrappedComponent => {
  const OverlayComponent = ({ dimmed, loading, LoaderContent, RevealContent, ...props }) => {
    return (
      <OverlayContainer>
        <OverlayedContent>
          <WrappedComponent {...props} />
        </OverlayedContent>
        <Overlay>
          <OverlayContent>
            <Loader>
              <LoaderContent />
            </Loader>
            : <RevealContent />
          </OverlayContent>
        </Overlay>
      </OverlayContainer>
    );
  };
  OverlayComponent.defaultProps = {
    dimmed: false,
    loading: false,
    LoaderContent: styled.span,
    RevealContent: v => null
  };
};
