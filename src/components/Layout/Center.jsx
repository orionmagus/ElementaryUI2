import React from "react";
import cn from "classnames";
import "./center.scss";

const CenteredPosition = ({
  children,
  className,
  useWidth,
  useHeight,
  ...props
}) => (
  <div
    className={cn(
      "center-content",
      {
        onboth: useHeight && useWidth,
        onheight: useHeight && !useWidth,
        onwidth: !useHeight && useWidth
      },
      className
    )}
    {...props}
  >
    {children}
  </div>
);

CenteredPosition.defaultProps = {
  useWidth: true,
  useHeight: true
};
CenteredPosition.displayNmae = "Centered";
export default CenteredPosition;
