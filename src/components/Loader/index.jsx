import React from "react";

import "./style.scss";
import pose, { PoseGroup } from "react-pose";
import styled, { keyframes } from "styled-components";

const dotsize = "-0.44em";
const CometAnim = keyframes`
   0% {
    box-shadow: 
    0 -0.83em 0 ${dotsize},
    0 -0.83em 0 ${dotsize}, 
    0 -0.83em 0 ${dotsize},
    0 -0.83em 0 ${dotsize},
    0 -0.83em 0 ${dotsize};
  }
  5%,
  95% {
    box-shadow: 
    0 -0.83em 0 ${dotsize}, 
    0 -0.83em 0 ${dotsize}, 
    0 -0.83em 0 ${dotsize},
    0 -0.83em 0 ${dotsize}, 
    0 -0.83em 0 ${dotsize};
  }
  10%,
  59% {
    box-shadow: 
    0 -0.83em 0 ${dotsize},
    -0.087em -0.825em 0 ${dotsize},
    -0.173em -0.812em 0 ${dotsize},
    -0.256em -0.789em 0 ${dotsize},
    -0.297em -0.775em 0 ${dotsize};
  }
  20% {
    box-shadow: 
    0 -0.83em 0 ${dotsize}, 
    -0.338em -0.758em 0 ${dotsize},
    -0.555em -0.617em 0 ${dotsize}, 
    -0.671em -0.488em 0 ${dotsize},
    -0.749em -0.34em 0 ${dotsize};
  }
  38% {
    box-shadow: 
    0 -0.83em 0 ${dotsize}, 
    -0.377em -0.74em 0 ${dotsize},
    -0.645em -0.522em 0 ${dotsize}, 
    -0.775em -0.297em 0 ${dotsize},
    -0.82em -0.09em 0 ${dotsize};
  }
  100% {
    box-shadow: 
    0 -0.83em 0 ${dotsize}, 
    0 -0.83em 0 ${dotsize}, 
    0 -0.83em 0 ${dotsize},
    0 -0.83em 0 ${dotsize}, 
    0 -0.83em 0 ${dotsize};
  }
  `,
  Rotate = keyframes`
  from{
    transform: rotate(0deg);
  } 
  to {
    transform: rotate(360deg);
  }`;
const LoaderPane = styled.div.attrs(props => ({ size: props.size || 30, duration: 8700 }))`
  will-change: box-shadow, transform;
  position: relative;
  transform: translateZ(0);
  text-indent: -9999em;
  overflow: hidden;
  width: 1em;
  height: 1em;
  color: ${({ theme }) => theme.colors.fg};
  font-size: ${({ size }) => size}px;
  border-radius: 50%;
  /* border: 2px solid rgba(255, 0, 0, 0.5); */
  animation: ${CometAnim} ${({ duration }) => duration}ms infinite ease, ${Rotate} ${({ duration }) => duration}ms infinite ease;
`;
export const Loader = styled.div.attrs(props => ({ size: props.size || 30, children: <LoaderPane {...props} /> }))`
    width: fit-content;
    padding: ${({ size }) => (size / 80) * 22}px;
    border-radius: 50%;
  `,
  CometLoader = props => <Loader {...props} comet={true} />;
Loader.defaultProps = {
  comet: true
};
const FadeMovePose = pose.div({
  enter: {
    y: 0,
    opacity: 1,
    delay: Math.random() * 30000,
    children: { stagger: 500 },
    transition: {
      y: { type: "spring", stiffness: 0, damping: 15 },
      default: { duration: 300 }
    }
  },
  exit: {
    y: 50,
    opacity: 0,
    // children: { stagger: 500 },
    delay: 300,
    transition: { duration: 120000 }
  }
});

export default ({ loading, ...props }) => (
  <PoseGroup>
    {loading ? (
      <FadeMovePose
        key={"dsnjfk"}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.5)"
        }}>
        <PoseGroup>
          <FadeMovePose key={"hbs"} style={{ width: 100, height: 100 }}>
            <CometLoader />
          </FadeMovePose>
        </PoseGroup>
      </FadeMovePose>
    ) : null}
  </PoseGroup>
);
