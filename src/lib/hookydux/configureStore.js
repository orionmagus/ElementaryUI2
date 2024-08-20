/**
 * Create the store with dynamic reducers
 */
import applyMiddleware from "./middleware";
import Provider, { connect, Store, createStore } from "./Provider";

import { combineReducers, connectHistory, routerReducer, routerMiddleware, stateTransformer, stateSelector } from "./extended/seamless";
import fromJS from "seamless-immutable";

import history from "./history";

import { compose } from "./utils";
import createBindEpics from "./extended/epic";

import { makeRootReducer, injectReducer } from "./extended/dynamicReducers";

const ENVPRODUCTION = process.env.NODE_ENV !== "production",
  ISWIN = typeof window === "object",
  REDDEV = ISWIN && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__,
  composeEnhancers = () => (ENVPRODUCTION && REDDEV ? REDDEV({ shouldHotReload: false }) : compose),
  createMiddleware = (...middlewares) => composeEnhancers(...[applyMiddleware(...middlewares)]);

const createBindRouter = createRouter => {
  if (!createRouter) {
    return { addMiddleware: v => v, asyncApply: store => store };
  }
  const middleware = routerMiddleware(history);
  return {
    addMiddleware: v => [...v, middleware],
    asyncApply: _store => {
      _store.hist = connectHistory(_store, history);
    }
  };
};
export default (reducer, initialState = {}, createRouter = false, allEpics = null, epicOptions = null) => {
  let store;

  const binders = [createBindEpics(allEpics, epicOptions), createBindRouter(createRouter)];

  function create() {
    let middlewares = [];
    binders.forEach(b => b.addMiddleware(middlewares));
    // alert(typeof rootReducerMain )
    const rootReducer = combineReducers({ ...reducer, ...(createRouter ? { routing: routerReducer } : {}) });
    if (createRouter) {
      middlewares = [...middlewares, routerMiddleware(history)];
    }
    let _store = createStore(rootReducer, fromJS(initialState), createMiddleware(middlewares));
    _store.dispatch({ type: "INIT_APP", payload: {} });
    // Extensions
    _store.asyncReducers = {}; // Reducer registry
    _store.injectReducer = (key, asyncReducer) => injectReducer(_store, key, asyncReducer);

    binders.forEach(b => b.asyncApply(_store));
    return _store;
  }

  return {
    init: () => {
      if (!store) {
        store = create();
      }
      return store;
    }
  };
};
// const state$ = from(store)
