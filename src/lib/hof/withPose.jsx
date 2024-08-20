import React from "react";
import posed from "react-pose";

export const withPose = poseConfig => WrappedComponent => posed(WrappedComponent)(poseConfig),
  pressSmall = withPose({
    pressable: true,
    init: { scale: 1 },
    press: { scale: 0.8 }
  });

const withPoseRef = poseConfig => WrappedComponent => {
  const InnerRef = React.forwardRef(({ style, ...props }, ref) => <WrappedComponent {...props} ref={ref} style={style} />);
  return posed(InnerRef)(poseConfig);
};
export default withPoseRef;
