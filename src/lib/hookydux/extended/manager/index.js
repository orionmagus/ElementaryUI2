import {
  createStore
} from 'redux';
import {
  combineReducers
} from 'redux-immutable';
const replaceAsyncReducers = (rootReducers, keys, reducer) => {
  let key = keys.shift();
  if (keys.length === 0) {
      rootReducers[key] = reducer;
      return
  }
  if (rootReducers[key] === undefined) {
      rootReducers[key] = {};
  }
  let nextRootReducers = rootReducers[key];
  return replaceAsyncReducers(nextRootReducers, keys, reducer);
}
const combineAsyncReducers = (asyncReducers) => {
  if (typeof asyncReducers !== 'object') return asyncReducers
  let combineReducerObject = {}
  for (let prop in asyncReducers) {
      if (!asyncReducers.hasOwnProperty(prop)) continue
      let value = asyncReducers[prop]
      if (typeof value === 'object') {
          combineReducerObject[prop] = combineAsyncReducers(value)
      } else if (typeof value === 'function') {
          combineReducerObject[prop] = value
      }
  }
  return combineReducers(combineReducerObject)
}
export const createReducerManager = (...initialReducers) => {
  const reducers = {
      ...initialReducers
  };
  let combinedReducer = combineReducers(reducers);
  let keysToRemove = [];

  return {
      getReducerMap: () => reducers,
      reduce: (state, action) => {
          if (keysToRemove.length > 0) {
              state = Object.entries(state).filter(([k, r]) => keysToRemove.indexOf(k) === -1).reduce((acc, [k, r]) => ({
                  ...acc,
                  [k]: r
              }), {});
              keysToRemove = [];
          }
          return combinedReducer(state, action);
      },
      add: (key, reducer) => {
          if (!key || reducers[key]) {
              return;
          }
          reducers[key] = reducer;
          combinedReducer = combineReducers(reducers);
      },
      remove: key => {
          if (!key || !reducers.get(key) {
              return;
          }
          delete reducers[key];
          keysToRemove.push(key);
          combinedReducer = combineReducers(reducers);
      }
  }
}
export default createReducerManager
//   const staticReducers = {
//     users: usersReducer,
//     posts: postsReducer
//   }

//   export function configureStore(initialState) {
//     const reducerManager = createReducerManager(staticReducers)

//     // Create a store with the root reducer function being the one exposed by the manager.
//     const store = createStore(reducerManager.reduce, initialState)

//     // Optional: Put the reducer manager on the store so it is easily accessible
//     store.reducerManager = reducerManager
//   }