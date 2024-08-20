import Immutable from "seamless-immutable";

import { LOCATION_CHANGE, syncHistoryWithStore, routerMiddleware } from "../router";
import { createReducer } from "../../../lodash/reduxUtils";

// Initial routing state
export const initialState = Immutable({
    // location: null,
    // previousLocation: null,
    locationBeforeTransitions: null
  }),
  fnMap = {
    [LOCATION_CHANGE]: (state, payload) => state.set("locationBeforeTransitions", payload)
  };
export { LOCATION_CHANGE, routerMiddleware };

export const connectHistory = (store, history, routing_key = "routing") =>
  syncHistoryWithStore(history, store, {
    selectLocationState: state => state.get(routing_key)
  });

export default createReducer(initialState, fnMap);
