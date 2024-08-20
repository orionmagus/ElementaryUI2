import React, { useState, useRef } from "react";
import { Icons } from "./components/Icon";
import { Button, Ripple, ProgressSlider } from "./components/Interactive";
import GradientBorder from "./components/Base/GradientBorder";
import Datepicker from "./components/Datepicker/Datepicker";
import Form, { Input } from "./components/Form";
import defaultTheme from "./lib/theme";
import Centered from "./components/Layout/Center";
import styled, { css, ThemeProvider, withTheme, keyframes } from "styled-components";
import { ParalDiv } from "./components/Overlay";
import posed from "react-pose";

// [other imports]

// [code]

const SVGFilters = ({ scale = 80, props }) => {
  return (
    <svg style={{ position: "absolute", width: 0, height: 0 }}>
      <filter id="shadowed-goo">
        <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation={scale} />
        <feColorMatrix in="blur" mode="matrix" values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${scale} -7`} result="goo" />
        <feGaussianBlur in="goo" stdDeviation="3" result="shadow" />
        <feColorMatrix in="shadow" mode="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 -0.2" result="shadow" />
        <feOffset in="shadow" dx="1" dy="1" result="shadow" />
        <feComposite in2="shadow" in="goo" result="goo" />
        <feComposite in2="goo" in="SourceGraphic" result="mix" />
      </filter>

      <filter id="goo">
        <feGaussianBlur in="SourceGraphic" result="blur1" stdDeviation={scale} />
        <feColorMatrix in="blur1" values={`1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${scale} -7`} result="goo1" />
        <feComposite in="SourceGraphic" in2="goo1" operator="atop" />
      </filter>
      <filter id="mixgoo">
        <feGaussianBlur in="SourceGraphic" result="blur2" stdDeviation={scale} />
        <feColorMatrix in="blur2" mode="matrix" values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${scale / 1.5} -7`} result="goo2" />
        <feComposite in2="goo2" in="SourceGraphic" operator="atop" result="mix2" />
      </filter>
    </svg>
  );
};
const Fl = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: space-between;
  height: 100%;
`;
const InnerApp = props => {
  const [percent, setPercent] = useState(0.4);
  return (
    <div
      style={{
        position: "relative",
        width: 550,
        height: "fit-content"
      }}>
      <GradientBorder>
        <Fl style={{ flexDirection: "column", justifyContent: "start" }}>
          <Datepicker monthsToDisplay={2} />
          <ProgressSlider style={{ height: 12 }} value={percent} onValueChange={value => setPercent(value)} />
          {/* <Loader style={{position:'absolute',top:0}} loading /> */}
          {/* <Panel onClick={() => set(!over)} pose={`${over ? "fullscreen" : "thumbnail"}`} /> */}
          <Input type="text" name='"username' />
          <Input type="password" name="password" icon="lock" placeholder="Password" />

          <Button.Group
            // style={{ height: 30 }}
            before
            select
            multi
            items={[{ icon: "undo" }, { icon: "caret-left" }, { icon: "play" }, { icon: "caret-right" }, { icon: "repeat" }]}>
            <Button icon_placement="right" icon="sign in" text="Login" />
          </Button.Group>
          <Fl>
            <Button.Group vertical before select multi items={[{ icon: "undo" }, { icon: "caret-left" }, { icon: "play" }, { icon: "caret-right" }, { icon: "repeat", badge: 3 }]}>
              <Button icon_placement="right" icon="sign in" text="Login" />
            </Button.Group>

            <Button effect icon_placement="right" icon="sign in" text="Login" />
          </Fl>
        </Fl>
      </GradientBorder>
    </div>
  );
};
const App = () => {
  const [loading, setLoading] = useState(true);
  setTimeout(() => setLoading(false), 1000);
  const [over, set] = useState(false);

  const { GlobalStyle, ...themeProps } = defaultTheme;
  // console.log(themeProps.theme.global);
  // const cometProps = { s1: -0.4, s2: -0.4, s3: -0.4, s4: -0.4, s5: -0.4, size: 150, pose: "visible" };
  return (
    <ThemeProvider {...themeProps}>
      <Centered className="App">
        <SVGFilters />
        {/* <InnerApp /> */}
        <Icons />
        <GlobalStyle />
      </Centered>
    </ThemeProvider>
  );
};
export default App;
