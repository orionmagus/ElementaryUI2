import React, { useContext, useMemo, useCallback, useEffect, useReducer, useLayoutEffect } from "react";

import useCreateStore from "./createStore";
export const Store = React.createContext(),
  createStore = (reducer, initialState, enhancers) => ({ children, ...props }) => {
    const store = useCreateStore(reducer, initialState, enhancers);
    return <Store.Provider store={store}>{children}</Store.Provider>;
  };
createStore.defaultProps = {
  reducer: (state, action) => state,
  initialState: undefined
};
export const Provider = ({ children, store, ...props }) => <Store.Provider value={store}>{children}</Store.Provider>;
Provider.defaultProps = {
  store: undefined
};
export const connect = (mapStateToProps = () => {}, mapDispatchToProps = () => {}) => WrappedComponent => props => {
  const { state, dispatch } = useContext(Store),
    nprops = {
      ...mapStateToProps(state, props),
      ...mapStateToProps(state, props),
      dispatch
    };
  return <WrappedComponent {...nprops} />;
};
export default Provider;
