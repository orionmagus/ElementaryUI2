import { combineReducers } from "../seamless";
import Immutable from "seamless-immutable";
export const replaceAsyncReducers = (rootReducers, keys, reducer) => {
    let key = keys.shift();
    if (keys.length === 0) {
      rootReducers[key] = reducer;
      return rootReducers;
    }
    let nextRootReducers = rootReducers[key] || {};
    return replaceAsyncReducers(nextRootReducers, keys, reducer);
  },
  combineReducersSimple = (reducers, getDefaultState = {}) => (inputState = getDefaultState, action = {}) =>
    Object.entries(reducers).reduce((acc, [name, reducer]) => ({ ...acc, [name]: reducer(inputState[name] || {}, action) }), { ...inputState }),
  combineAsyncReducers = asyncReducers => {
    if (typeof asyncReducers !== "object") return asyncReducers;
    let combineReducerObject = {};
    for (let prop in asyncReducers) {
      if (!asyncReducers.hasOwnProperty(prop)) continue;
      let value = asyncReducers[prop];
      if (typeof value === "object") {
        combineReducerObject[prop] = combineAsyncReducers(value);
      } else if (typeof value === "function") {
        combineReducerObject[prop] = value;
      }
    }
    return combineReducers(combineReducerObject);
  },
  makeRootReducer = (globalRootReducer, asyncReducers) => {
    let newAsyncReducers = {};
    console.log(asyncReducers);
    for (let key in asyncReducers) {
      if (!asyncReducers.hasOwnProperty(key)) continue;
      newAsyncReducers[key] = combineAsyncReducers(asyncReducers[key]);
    }
    return combineReducers({
      ...globalRootReducer,
      ...asyncReducers
    });
  },
  injectReducer = (store, { key, reducer }) => {
    let keys = key.split(".");
    replaceAsyncReducers(store.asyncReducers, keys, reducer);
    //  store.asyncReducers[key] = reducer
    store.replaceReducer(makeRootReducer(store.globalRootReducer, store.asyncReducers));
  };
