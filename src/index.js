import "core-js/es6/map";
import "core-js/es6/set";
import React from "react";
import ReactDOM from "react-dom";
import App from "./MUIApp";

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

// import React from "react";
// import { Provider } from "./lib/hookydux";
// import ReactDOM from "react-dom";
// // import "./styles.scss";

// import App from "./App";
// import store from "./store";
// // import registerServiceWorker from './registerServiceWorker';

// ReactDOM.render(
//   <Provider store={store}>
//     <App />
//   </Provider>,
//   document.getElementById("root")
// );
