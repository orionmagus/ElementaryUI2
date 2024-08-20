import { grid, greyPalette, fontSize, fontFamily, fontWeight, bodyCalc, colorsFg } from "./constants";
export const THEME_DEFAULTS = {
  base: "14px",
  spacing: "1rem",

  typography: {
    font: "'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif",
    text: "1rem",
    title: "2rem"
  }
};
export default function baseTheme(colors, typography) {
  const basicColors = {
      ...{
        white: "#ffffff",
        black: "#000000",
        bg: "#111111",
        fg: "#dedede",
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
        info: "#d9edf7"
      },
      ...colors
    },
    colorsFgCalculated = colorsFg(basicColors),
    body = bodyCalc(basicColors),
    font = {
      font: "'Roboto', 'Helvetica Neue', Helvetica, Arial, sans-serif",
      size: "14px",
      text: "1rem",
      space: "1.2rem",
      title: "2rem",
      ...(typography || {})
    };
  return {
    baseModule: 8,
    contentWidth: 1360,
    totalColumns: grid.totalColumns,
    radius: 5,
    radiusDefault: ".6rem",
    radiusRounded: 1000,

    /**
     * breakpoints contain lower bounds of screen sizes
     * ex. if you want some div to be 100% width for small screen (<60em) and
     * take 50% width on medium up screens
     * @example const boxStyled = styled.div css`
     *  width: 100%;
     *  ${media(medium)`width: 50%;`}
     * `
     */
    breakpoints: {
      xs: 0,
      sm: 30,
      md: 60,
      lg: 80,
      xl: 90,
      xxl: 120
    },

    breakpointsEmBase: 16,

    color: {
      white: basicColors.white,
      black: basicColors.black,
      transparent: basicColors.transparent,

      primary: basicColors.primary,
      primary_fg: colorsFgCalculated.primary,
      secondary: basicColors.secondary,
      secondary_fg: colorsFgCalculated.secondary,

      component: basicColors.component,
      component_fg: colorsFgCalculated.component,

      alert: basicColors.alert,
      alert_fg: colorsFgCalculated.alert,
      warning: basicColors.warning,
      warning_fg: colorsFgCalculated.warning,
      error: basicColors.alert,
      error_fg: colorsFgCalculated.alert,
      success: basicColors.success,
      success_fg: colorsFgCalculated.success,
      info: basicColors.info,
      info_fg: colorsFgCalculated.info
    },

    colorPaletteGrey: { ...greyPalette },

    colorBorder: greyPalette[300],
    colorAnchor: basicColors.darkblue,

    colorBrand: {
      facebook: "#3b5998",
      vkontakte: "#45668e",
      googlePlus: "#dd4b39"
    },

    fontFamily: { ...fontFamily },

    fontWeight: { ...fontWeight },

    fontSize: { ...fontSize },

    fontColors: {
      light: greyPalette[300],
      medium: greyPalette[500]
    },

    direction: {
      text: "ltr",
      float: "left"
    },

    zIndex: {
      moon: 9999,
      tooltip: 9990,
      alertDesktop: 9000,
      popup: 8700,
      modal: 8500,
      dropdown: 8000,
      overlay: 7000,
      alertMobile: 5000,
      nav: 500,
      base: 1
    },
    elevation: {
      umbra: "rgba(0,0,0,0.9)",
      penumbra: "rgba(0,0,0,0.3)",
      ambient: "rgba(150,150,150,0.1)"
    },
    body: {
      backgroundColor: body.backgroundColor,
      fontColor: body.fontColor,
      fontColorAlt: body.fontColorAlt,
      fontFamily: font.font, // place here a key of fontFamily collection
      fontWeight: fontWeight.normal,
      lineHeight: 1.5,
      fontSize: font.size
    }
  };
}
