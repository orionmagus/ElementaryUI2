import React, { useState, useRef } from "react";
import { Icons } from "./components/Icon";
import { ButtonasAB, Ripple, ProgressSlider } from "./components/Interactive";
import GradientBorder from "./components/Base/GradientBorder";
import Datepicker from "./components/Datepicker/Datepicker";
import { Dropdown } from "./components/Dropdown";
import defaultTheme from "./lib/theme";
import Centered from "./components/Layout/Center";
import styled, { css, ThemeProvider, withTheme, keyframes } from "styled-components";
import { ParalDiv } from "./components/Overlay";
import posed from "react-pose";

import { StylesProvider } from "@material-ui/styles";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import Button from "@material-ui/core/Button";
import theme from "./theme";
console.log(JSON.stringify(defaultTheme));
export default props => {
  const [percent, setPercent] = useState(0.4);
  const { GlobalStyle, ...themeProps } = defaultTheme;
  return (
    <StylesProvider injectFirst>
      <React.Fragment>
        <MuiThemeProvider theme={theme}>
          <React.Fragment>
            <ThemeProvider {...themeProps}>
              <GradientBorder style={{ margin: "1vw" }}>
                {/* <Dropdown /> */}
                <Datepicker monthsToDisplay={2} />
                {/* <ProgressSlider indicating value={percent} onValueChange={value => setPercent(value)} /> */}

                {/* <Button variant="outlined">Button styled with MUI theme only</Button> */}
                {/* <Icons /> */}
                <GlobalStyle />
              </GradientBorder>
            </ThemeProvider>
          </React.Fragment>
        </MuiThemeProvider>
      </React.Fragment>
    </StylesProvider>
  );
};
