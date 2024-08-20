import React from "react";
import "./style.scss";
export default function(props) {
  const baseprops = {
    style: {
      "--iconified-width": "15px",
      "--opened-width": "430px",
      "--default-width": "55px"
    },
    ...props
  };
  return <input type="search" placeholder="Search" {...baseprops} />;
}
