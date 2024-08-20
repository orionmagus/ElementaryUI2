import { useReducer } from "react";
import { isFunction, isUndef } from "./utils";
import Immutable from "seamless-immutable";
import ActionTypes from "./types";

export const useCreateStore = (reducer, i, e, immutablity = "seamless") => {
    let [initialState, enhancer] = isFunction(i) && isUndef(e) ? [e, i] : [i, e];
    if (isFunction(enhancer)) {
      return enhancer(useCreateStore)(reducer, initialState);
    } else {
      let currentReducer = reducer,
        currentState = initialState,
        [state, dispatcher] = useReducer(reducer, initialState);
      const dispatch = action => {
          const res = dispatcher(action);
          console.log(`Base dispatch(${action.type}) :${res}`);
          return action;
        },
        useReplaceReducer = newReducer => {
          // innerCreate
          let [obstate, newdispatch] = useReducer(newReducer, currentState);
          state = obstate;
          dispatcher = newdispatch;
          dispatch({ type: ActionTypes.REPLACE });
          return;
        };
      // subscribe = useEffect()
      return {
        state,
        dispatch,
        globalReducers: currentReducer,
        asyncReducers: {},
        bindAction: type => payload => dispatch({ type, payload }),
        replaceReducer: useReplaceReducer,
        getState: () => state || currentState
      };
    }
  },
  combineReducers = (reducers, getDefaultState = Immutable.Map) => (inputState = getDefaultState(), action = {}) =>
    inputState.withMutations(temporaryState =>
      Object.keys(reducers).forEach(reducerName => temporaryState.set(reducerName, reducers[reducerName](temporaryState.get(reducerName), action)))
    );
export default useCreateStore;
