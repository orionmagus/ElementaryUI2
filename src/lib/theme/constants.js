import Color from "color";

export const grid = {
  totalColumns: 12
};

export const basicColors = {
  white: "#ffffff",
  black: "#000000",
  bg: "#111111",
  fg: "#dedede",
  red: "#f04124",
  yellow: "#f0b900",
  green: "#43AC6A",
  lightblue: "#d9edf7",
  darkblue: "#208dcc",
  transparent: "hsla(0, 0%, 100%, 0)"
};

export const themeColors = {
  component: "#888888",
  primary: "#2196F3",
  secondary: "#673AB7",
  alert: basicColors.red,
  warning: basicColors.yellow,
  success: basicColors.green,
  info: basicColors.lightblue
};

export const greyPalette = {
  50: "#fafafa",
  75: "#f7f7f7",
  100: "#f5f5f5",
  200: "#eeeeee",
  300: "#e0e0e0",
  400: "#bdbdbd",
  500: "#9e9e9e",
  600: "#757575",
  700: "#616161",
  800: "#424242",
  900: "#212121"
};

export const fontSize = {
  "-2": 10,
  "-1": 12,
  0: 13,
  1: 15,
  2: 18,
  3: 24,
  4: 34,
  5: 45,
  6: 56,
  7: 112
};

export const fontFamily = {
  sansSerif: "Roboto, Open Sans, Helvetica Neue, Helvetica,  Arial, sans-serif",
  serif: "Roboto, Georgia, Cambria, Times New Roman, Times, serif",
  monospace: "Roboto, Consolas, Liberation Mono, Courier, monospace"
};

export const fontWeight = {
  light: "400",
  normal: "400",
  semibold: "600",
  bold: "700"
};

export const bodyCalc = colors => ({
  backgroundColor: colors.bg || basicColors.bg,
  fontColor: colors.fg || basicColors.fg,
  fontColorAlt: colors.alt || greyPalette[900]
});

/**
 * Checks the lightness of `bgColor`, and if it passes the `threshold` of
 * lightness, it returns the `dark` color. Otherwise, it returns
 * the `light` color. Use this function to dynamically output a foreground color
 * based on a given background color.
 *
 * @param {string} bgColor - Color to check the lightness of.
 * @param {string} dark - Color to return if `bgColor` is light.
 * @param {string} light - Color to return if `bgColor` is dark.
 * @param {number} threshold - Threshold of lightness to check against.
 * @return {string} The dark color or light color.
 */
export const foreground = (bgColor, dark = greyPalette[900], light = basicColors.fg, threshold = 0.5) => (Color(bgColor).luminosity() > threshold ? dark : light);

export const colorsFg = basicColors => ({
  component: foreground(basicColors.component),
  primary: foreground(basicColors.primary),
  secondary: foreground(basicColors.secondary),
  alert: foreground(basicColors.alert),
  success: foreground(basicColors.success),
  warning: foreground(basicColors.warning),
  info: foreground(basicColors.info)
});

export const keyboardCodes = {
  ENTER: 13,
  ESC: 27,
  DOWN: 40,
  UP: 38,
  SPACE: 32
};
