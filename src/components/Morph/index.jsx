import React from "react";
import posed from "react-pose";
import { tween } from "popmotion";
import { interpolate } from "flubber";
import IconPaths512 from "../../style/icons/512";
import { SVGIcon } from "../Icon";
import withPose from '../../lib/hof/withPose'
const submit_d = {
  loading: "M255,0C114.75,0,0,114.75,0,255s114.75,255,255,255s255-114.75,255-255S395.25,0,255,0z"
};
const {icons, viewBox} = IconPaths512
const morphTransition = ({ from, to }) =>
  tween({
    from: 0,
    to: 1
  }).pipe(interpolate(from, to)),

poseConfig = Object.entries(icons).reduce((acc, [name, d]) => ({...acc, 
  [name]:{d, transition: morphTransition}
}), {})
const PoseIcon = posed.path(
  
);

const NextButton = posed.button({
  hoverable: true,
  pressable: true,
  init: { scale: 1 },
  hover: { scale: 1.1 },
  press: { scale: 0.8 }
});

const MorphIcon = () => {

    return (
        <SVGIcon width="400" height="400" viewBox={viewBox}>
          <Icon pose={} />
        </SVGIcon>
    );
  }

