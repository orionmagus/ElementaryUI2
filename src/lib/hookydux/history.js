import createBrowserHistory from "history/createBrowserHistory";
// import { browserHistory } from "react-router";
const history = createBrowserHistory();
const cachedPush = history.push;

// override history.push method to allow to exit animations and delayed FLIP
history.push = args => {
  if (typeof args === "string") {
    return cachedPush(args);
  }
  if (args && args.state && args.state.animate) {
    args.state.animate().then(() => {
      delete args.state.animate;
      cachedPush(args);
    });
  } else {
    cachedPush(args);
  }
};
export default history;
