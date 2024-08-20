import { createMuiTheme } from "@material-ui/core/styles";

export default createMuiTheme({
  overrides: {
    MuiButton: {
      root: {
        fontWeight: "bold",
        color: "#dedede",
        backgroundColor: "#777777",
        "&:hover": {
          backgroundColor: "#3366ff"
        }
      }
    }
  }
});
