import React from "react";
import styled, { ThemeProvider, createGlobalStyle } from "styled-components";
import * as fnf from "./functions";
import baseTheme from "./base";
const { createMediaQueryFunctions, ...fn } = fnf,
  { darken, lighten, desaturate, hsl, addAlpha, mix, complement, invert, isDark, invertValue, scale_color, adjCol } = fn;
export const applyFnToColors = ({ colors, ...base }, fn, newkey = "colors", ...args) => ({
    ...base,
    [newkey]: Object.entries(colors).reduce((a, [k, c]) => ({ ...a, [k]: fn(c, ...args) }), {})
  }),
  invertThemeValue = ({ colors, ...base }) => ({ ...base, colors: Object.entries(colors).reduce((a, [k, c]) => ({ ...a, [k]: invertValue(c) }), {}) }),
  createTheme = theme => {
    theme.colors.sidebar_base = desaturate(adjCol(theme.colors.bg), 0.2);
    let ntheme = { ...theme, ...baseTheme(theme.colors, theme.typography) };
    const themeObj = prepTheme(ntheme, isDark(ntheme.body.backgroundColor));
    const {
      base_font_family,
      base_font_weight,
      base_line_height,
      base_font_size,
      radius,

      base_border_radius,
      button_radius,
      panel_radius,
      outer_panel_radius,
      round,
      colors
    } = themeObj;
    const global = {
      base_font_family,
      base_font_weight,
      base_line_height,
      base_font_size,
      radius,
      base_border_radius,
      button_radius,
      panel_radius,
      outer_panel_radius,
      round,
      ...colors
    };

    return {
      global,
      mq: createMediaQueryFunctions(themeObj.breakpoints, themeObj.breakpointsEmBase),
      ...themeObj,
      fn
    };
  },
  basics = base => {
    let { logo_back } = base.colors;

    let { bg_url, small, large } = { bg_url: null, small: null, large: null, ...base.logo };
    small = small || bg_url;
    large = large || small;
    return {
      ...base,
      ...{
        image_logo_small: `var(--logo-bg, ${logo_back}) url('${small}'} 50% 50% no_repeat`,
        image_logo_large: large,
        base_font_family: base.body.fontFamily,
        base_font_weight: base.body.fontWeight,
        base_line_height: base.body.lineHeight,
        base_font_size: base.body.fontSize,
        radius: base.radius,
        base_border_radius: base.radiusDefault,
        button_radius: base.radius * 1.5,
        panel_radius: base.radius * 2,
        outer_panel_radius: base.radius * 3,
        round: base.radiusRounded
      }
    };
  },
  prepTheme = (base, isDark = true) => {
    let [fgTrans, bgTrans] = isDark ? [lighten, darken] : [darken, lighten];
    let newColor = {
      background: base.body.backgroundColor,
      text: base.body.fontColor,
      textAlt: base.body.fontColorAlt,
      white: "#ffffff",
      black: "#000000",
      bg: "#111111",
      fg: "#dedede",
      panel: "#4d4d4d",
      input: "#dedede",
      button: "#777777",
      component: "#999999",
      border: "#b6b6b6",
      red: "#f04124",
      yellow: "#f0b900",
      green: "#43AC6A",
      lightblue: "#d9edf7",
      darkblue: "#208dcc",
      transparent: "hsla(0, 0%, 100%, 0)",
      primary: "#2196F3",
      secondary: "#673AB7",
      alert: "#f04124",
      warning: "#f0b900",
      success: "#43AC6A",
      info: "#d9edf7",
      error: "#e94b35",
      ...base.colors,
      sidebar_base: adjCol(mix(base.colors.secondary, base.body.backgroundColor, 0.55), -16, 0.025, -0.55)
    };
    const {
      hue,
      primary,
      secondary,
      tertiary,
      logo_back,
      fg,
      bg,
      text,
      background,
      success,
      error,
      panel,
      button,
      component,
      border,
      input,

      sidebar_base
    } = newColor;
    const colors = {
      text,
      text_hover: bgTrans(fg, 0.08),
      text_invert: invertValue(fg),

      back_overlay: addAlpha(fgTrans(bg, 0.2), 0.6),
      bg_light: hsl(hue, 0.23, 0.95),

      background,
      background_invert: invert(background, 1.0),
      background_dark: bgTrans(bg, 0.05),
      background_darker: bgTrans(bg, 0.2),
      background_darkest: bgTrans(bg, 0.5),
      logo_bg: logo_back,
      button,
      button_bg: bgTrans(component, 0.2),
      button_hover: fgTrans(secondary, 0.1),

      input,
      input_bg: addAlpha(input, 0.8),
      input_fg: invertValue(input),

      panel,
      panel_bg: addAlpha(panel, 0.4),
      panel_fg: invertValue(panel),
      border,
      border_color: border,
      border_break: hsl(hue, 0.067, 0.52),
      border_col: hsl(hue, 0.81, 0.89),

      positive: success,
      negative: error,

      component,
      component_bg: addAlpha(component, 0.6),
      component_hover: bgTrans(component, 0.05),

      primary,
      primary_bg: fgTrans(primary, 0.1),
      primary_hover: bgTrans(primary, 0.1),

      secondary,
      secondary_bg: bgTrans(secondary, 0.3),
      secondary_hover: adjCol(tertiary, -26, -8, 13, true),

      tertiary,
      tertiary_bg: fgTrans(tertiary, 0.3),
      tertiary_hover: adjCol(tertiary, -26, -8, 13, true),

      sidebar_base,
      sidebar_link_bg: bgTrans(desaturate(sidebar_base, 0.4), 0.02),

      sidebar_bg: sidebar_base,
      sidebar_fg: scale_color(sidebar_base, 0.5, 0.01),

      sidebar_header_bg: scale_color(sidebar_base, -0.03, 0.01),
      sidebar_header_fg: scale_color(complement(sidebar_base), 0.5, 0.01),
      ...base.colors
    };
    // console.log(Object.entries());
    return { ...basics(base), colors };
  },
  globalize = base => {
    let globs = Object.entries(base.global)
      .reduce((a, [name, value]) => [...a, `--${name.replace("_", "-")}:${value};`], [])
      .join("\n");
    return createGlobalStyle`      
      html,
      body {
        font-size: 100%;
        display: flex;
        align-items: stretch;
        overflow-x: hidden;
      }
      
      body {
        --background:${base.colors.bg};     
       ${globs}
        --padding: 8px;
        --text-size: ${base.body.fontSize};
        --heading: 30px;
        --sub-heading: 26px;
        --title: 24px;
        --sub-title: 18px;
        --slow-trans: all 1s;
        --trans: all 0.4s;
        --delay: 1s;
        --long-delay: 1.8s;
        --bg-rotate: 0deg;
        cursor: default;        
        color: var(--text);
        background: #111111;
        font-family: var(--base-font-family);
        font-weight: var(--base-font-weight);
        line-height: var(--base-line-height);
        position: relative;
      }
      * {
        box-sizing: border-box;
      }
      body,
      #root,
      .App {

        overflow-x: hidden;
        padding: 0;
        margin: 0;
        box-sizing: border-box;

        width: 100%;
        height: 100%;
        min-height: 100vh;
      }
      .App{
        background-color: var(--background);
      }
    `;
  };
/* 
  
    }*/
export { createMediaQueryFunctions };

export const buildTheme = (themeProps, inject = true) => {
  const theme = createTheme(themeProps);
  // if (inject) {
  const GlobalStyle = globalize(theme);

  return { GlobalStyle, theme };
};
const defaultThemeBase = {
  client: "hollard",
  company: "Hollard Insurance",
  company_logo_name: "Hollard",
  format: { date: "YYYY-MM-DD" },
  logo: {
    small:
      "data:image/jpeg;base64,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",
    large:
      "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE1NC4yNzNweCIgaGVpZ2h0PSI0MC45NDhweCIgdmlld0JveD0iMCAwIDE1NC4yNzMgNDAuOTQ4IiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAxNTQuMjczIDQwLjk0OCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNMTQyLjY2OSwzMy42N2MtMC40NS0wLjE0My0wLjg4LDAuMTQyLTAuOTQ3LDAuNDA1Yy0wLjU4MiwyLjE2Mi0xLjMyMiwzLjM3LTMuMDU5LDMuMjMzICBjLTMuMjA5LTAuNDE1LTMuMDM4LTcuMTg1LTMuMDM4LTEwLjE4MWMwLTExLjI4NCwwLjM0NC0yNC45NjUsMC4zNDQtMjUuNWMwLTAuNDU0LTAuNTAxLTAuNzg1LTIuNDE1LTEuMjU4ICBjLTEuMTM1LTAuMjc5LTEuNzUyLTAuMzgtMi4wNTMtMC4zOGMtMC42NDksMC0xLjI1MSwwLjUzMS0xLjI1MSwxLjE5N3YxNC44NThjLTEuNDMtMS41NzItMy4zMTMtMi41NTQtNS42NTUtMi41ODMgIGMtMTEuNTQ3LTAuMTQ1LTEzLjM3MywyNS41NTEtMS43MzYsMjcuMTVjMy45NTgsMC41NDMsNi44NDUtMS41Myw4LjYzNC00LjczOWMxLjM1NiwzLjUxOCwzLjUxMSw0LjU0MSw0Ljk4Niw0Ljg0MSAgYzEuMDUxLDAuMjEsNC41NzctMC4xMzksNi4yNzUtMy42OTlDMTQzLjM2MywzNS43NDgsMTQzLjY4OCwzMy45OTksMTQyLjY2OSwzMy42NyBNMTI1Ljc0MSwzNy4zMyAgYy03LjY5MiwwLTUuOTQ3LTE5LjYzNSwwLjE4NC0xOS41NTVjMi41OTksMC4wMzQsNC4xNzgsMy4zMjksNC4zMjYsNy42NDFDMTMwLjQ4NSwzMi40MDgsMTI5LjQzOCwzNy4zMywxMjUuNzQxLDM3LjMzICAgTTExMS42MywxMy40ODdjLTQuNjU5LDAuNzQ1LTYuNjU4LDcuMi02LjY1OCw4LjA2M3YtNS42MjRjMC0wLjQ1Mi0wLjUwMi0wLjc4Mi0yLjQxMS0xLjI1NWMtMS4xNC0wLjI3OS0xLjc1OS0wLjM4My0yLjA1Ni0wLjM4MyAgYy0wLjY0NiwwLTEuMjU1LDAuNTM0LTEuMjU1LDEuMTk4djEzLjM5OGMtMC4wMTgsMC4yMi0wLjAzOCwwLjQzOC0wLjA1OCwwLjY2M2MtMC4zNDksMy44NC0wLjY5NSw3LjY4My0zLjIxMSw3LjY4MyAgYy0zLjMzMywwLTIuMzMyLTYuOTg0LTIuMjg5LTkuOTgxYzAuMTM4LTkuMjc3LDAuMzQyLTExLjM0MywwLjM0Mi0xMS4zNjNjMC0wLjQ1My0wLjUtMC43ODQtMi40MTMtMS4yNTYgIGMtMS4xMzYtMC4yODEtMS43NTUtMC4zODQtMi4wNTUtMC4zODRjLTAuNjQ2LDAtMS4yNTEsMC41MzQtMS4yNTEsMS4xOTh2MC44OTZjLTEuNDcyLTEuNzQ2LTMuNDQ5LTIuODQ5LTUuOTM3LTIuODggIGMtNy45OC0wLjEtMTEuMzIsMTIuMTY2LTguNzcxLDIwLjI2OGMtMC4zOCwyLjE0Ni0xLjE1NywzLjczOC0zLjE5NywzLjU4Yy0zLjIwOC0wLjQxNS0zLjAzNy03LjE4NS0zLjAzNy0xMC4xODEgIGMwLTExLjI4NCwwLjM0My0yNS40NzgsMC4zNDMtMjUuNWMwLTAuNDU0LTAuNTAyLTAuNzg1LTIuNDE1LTEuMjU4Yy0xLjEzNS0wLjI3OS0xLjc1Ni0wLjM4LTIuMDUzLTAuMzggIGMtMC42NDksMC0xLjI1NCwwLjUzMS0xLjI1NCwxLjE5N3YyNC42NDFjLTAuMDc4LDIuNDU1LDAuMDM2LDQuNTE2LDAuMjg0LDYuMjQ1Yy0wLjUyMSwyLjk1Ni0xLjYwNCw1LjM5NC0zLjc2Nyw1LjIzNSAgYy0zLjIwOC0wLjQxNS0zLjAzNi03LjE4NS0zLjAzNi0xMC4xODFjMC0xMS4yODQsMC4zNDItMjUuNDc4LDAuMzQyLTI1LjVjMC0wLjQ1NC0wLjUwMS0wLjc4NS0yLjQxNC0xLjI1OCAgYy0xLjEzNy0wLjI3OS0xLjc1Ny0wLjM4LTIuMDU2LTAuMzhjLTAuNjQ2LDAtMS4yNTMsMC41MzEtMS4yNTMsMS4xOTd2MjQuOTgzYy0wLjM3NCwxMS45OTUsMy43NzksMTQuMjIsNi4yMTYsMTQuNTI4ICBjMS4yMjQsMC4xNTMsNS40NTYtMC4yMTksNi44MTMtNS4wNDhjMS4zMzYsMy44MDgsMy41NTksNC45MTcsNS4xMDIsNS4wNjNjMC45OTEsMC4wOTMsNC45NTItMC4yMDgsNi41MzktNC4zMDYgIGMxLjMsMi4yNTMsMy4yNDIsMy44NSw1Ljg4Miw0LjIwNGMzLjg0NywwLjUxNCw2LjY4My0xLjM2NSw4LjQ5NS00LjM0MWMwLjkzOCwzLjE4LDIuNTMsNC4wODcsNC4yMjIsNC40MjcgIGMxLjI2NCwwLjI1Miw0LjE2MSwwLjAxOSw1Ljg4Ni0yLjc4OXYxLjM3N2MwLDAuNDU1LDAuMTc4LDAuNzg1LDIuMDg5LDEuMjU5YzEuMTM1LDAuMjc5LDIuMDk3LDAuMzgxLDIuMzkzLDAuMzgxICBjMC42NTIsMCwxLjI0LTAuNTMyLDEuMjQtMS4xOTZ2LTYuODU3YzAtMi45MjIsMS44NTMtMTMuNjM2LDYuNDIxLTEzLjk2OWMwLjI5MS0wLjAyLDAuOTM1LDAuMDMxLDEuMzg4LDAuMTg3ICBDMTE2LjM5MywyMC4zMzQsMTE2LjMyLDEyLjczNywxMTEuNjMsMTMuNDg3IE04My41MjcsMzcuMzNjLTcuNjg4LTAuMTM2LTUuOTQ5LTE5LjYzNSwwLjE4My0xOS41NTUgIGMyLjk0NiwwLjAzOCw0LjM1NCw0LjI3NSw0LjM5OSw5LjQwNEM4OC4xNSwzMi4yMiw4Ny4xNzIsMzcuMzkyLDgzLjUyNywzNy4zMyBNMzguMTA5LDEzLjQ1OCAgYy0xMS41NDQtMC4xNDUtMTMuMzc1LDI1LjI3OC0xLjczMywyNy4xNUM1MC44ODMsNDIuOTM1LDUyLjAwNywxMy42MywzOC4xMDksMTMuNDU4IE0zOS4yNTQsMzcuMzIyICBjLTcuNjg3LTAuMTQ3LTUuNTktMTguOTA1LDAuMTg3LTE5LjU1NkM0NS45LDE3LjA0MSw0Ni43OTcsMzcuNDYzLDM5LjI1NCwzNy4zMjIgTTIzLjU0OCwwLjM3MWMtMS4xMzUtMC4yNzktMS43NTMtMC4zOC0yLjA1MS0wLjM4ICBjLTAuNjQ4LDAtMS4yNTMsMC41MzEtMS4yNTMsMS4xOTd2MTYuMjA3Yy0zLjU2My0wLjA5OC02LjczNCwwLjAzNS0xMC4yODcsMC41NGMwLDAtMC4wMTctMTYuMTQzLTAuMDE3LTE2LjMwNyAgYzAtMC40NTQtMC41MDMtMC43ODUtMi40MTYtMS4yNThjLTEuMTM4LTAuMjc5LTEuNzU3LTAuMzgtMi4wNTMtMC4zOGMtMC42NDksMC0xLjI1MywwLjUzMS0xLjI1MywxLjE5N3YxNy44NTcgIGMtMC4zODgsMC4wOTEtMi4yMTEsMC40ODQtMy4yMzIsMC44MTRjLTEuMDE5LDAuMzMyLTEuMTYyLDEuMDgzLTAuODIsMi4xMTVjMC41NDgsMS42NzIsMi4zODksMy42NjMsMy40ODUsMy4yMDUgIGMwLjI3MS0wLjEwOCwwLjU3MS0wLjE5MywwLjU3MS0wLjE5M2MwLjAxMSw0LjM1NCwwLjAyMSw3LjQzOCwwLjAyMSw3LjQzOGwwLjAwNSw2Ljg2OGMwLDAuNDU2LDAuMTYyLDAuNzg3LDIuMDc1LDEuMjU3ICBjMS4xMzcsMC4yODEsMi4wOTYsMC4zODMsMi4zOTQsMC4zODNjMC42NDcsMCwxLjI0LTAuNTMyLDEuMjQtMS4xOThWMjMuMjkyYzQuMjgzLTAuOTg5LDcuNTktMS4yNTUsMTAuMjg3LTEuNDUzdjE3LjQ1NCAgYzAsMC40NTYsMC4xNzcsMC43OSwyLjA5LDEuMjYyYzEuMTMzLDAuMjc5LDIuMDk2LDAuMzg0LDIuMzk1LDAuMzg0YzAuNjQ2LDAsMS4yMzYtMC41MzUsMS4yMzYtMS4yVjEuNjI4ICBDMjUuOTY1LDEuMTc0LDI1LjQ2NCwwLjg0MywyMy41NDgsMC4zNzEiPjwvcGF0aD4NCjxwYXRoIGZpbGw9IiNGMDVCMjQiIGQ9Ik0xNTAuOTUyLDMxLjczOWMtMi4yMjItMC4zODUtNC4zNjcsMS40OC00Ljc4NiwzLjg5NmMtMC40MjEsMi40MTgsMS4wMzgsNC42ODgsMy4yNjIsNS4wNzUgIGMyLjIxNCwwLjM4LDQuMzU0LTEuMjY4LDQuNzc0LTMuNjg2QzE1NC42MTksMzQuNjEyLDE1My4xNjcsMzIuMTI2LDE1MC45NTIsMzEuNzM5Ij48L3BhdGg+DQo8L3N2Zz4NCg==",
    bg_url: ""
  },
  colors: {
    white: "#ffffff",
    black: "#000000",
    // bg: "#111111",
    fg: "#dedede",
    red: "#f04124",
    yellow: "#f0b900",
    green: "#43AC6A",
    lightblue: "#d9edf7",
    darkblue: "#208dcc",
    transparent: "hsla(0, 0%, 100%, 0)",
    logo_back: "#442157",
    bg: "#161124",
    panel: "#444444",
    input: "#dedede",
    component: "#999999",
    primary: "#2d0244",
    secondary: "#8c00d4",
    tertiary: "#722c96",
    alert: "#f04124",
    warning: "#f2c500",
    success: "#1fce6d",
    info: "#d9edf7",
    hue: 279,
    radius: 5,
    text: "#dedede",
    danger: "#e94b35",
    error: "#e94b35"
  }
};
const MyThemeProvider = tprops => {
  const props = buildTheme(tprops);
  return <ThemeProvider {...props} />;
};

MyThemeProvider.defaultProps = defaultThemeBase;
export default buildTheme(defaultThemeBase);
