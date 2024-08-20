import applyMiddleware from "./middleware";
import Provider, { connect, Store, createStore } from "./Provider";

import { combineReducers, connectHistory, routerReducer, routerMiddleware, stateTransformer, stateSelector, LOCATION_CHANGE } from "./extended/seamless";
import ducks, { bindActionCreators, createReducer, bindFnMapTypes } from "../lodash/reduxUtils";
import history from "./history";
import { compose } from "./utils";
import { useSort, useFetch } from "./enhancements";
import { REPLACE, INIT, EPIC_END } from "./types";

export {
  bindActionCreators,
  history,
  connectHistory,
  createStore,
  combineReducers,
  routerReducer,
  stateTransformer,
  stateSelector,
  createReducer,
  bindFnMapTypes,
  connect,
  Store,
  Provider,
  routerMiddleware,
  applyMiddleware,
  ducks,
  compose,
  useSort,
  useFetch
};
export default {
  TYPES: {
    REDUX_INIT: INIT,
    REDUX_REPLACE: REPLACE,
    LOCATION_CHANGE,
    EPIC_END
  }
};
