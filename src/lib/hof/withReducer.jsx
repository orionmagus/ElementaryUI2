import React from "react";
import { object } from "prop-types";
import hoistNonReactStatics from "hoist-non-react-statics";
import { getComponentDisplay } from "../lodash/componentUtils";

export const withReducer = (key, reducer) => WrappedComponent => {
  const Extended = (props, context) => {
    context.store.injectReducer(key, reducer);
    return <WrappedComponent {...props} />;
  };
  Extended.contextTypes = {
    store: object
  };
  Extended.displayName = `withReducer(${key}(${getComponentDisplay(WrappedComponent)})`;

  return hoistNonReactStatics(Extended, WrappedComponent);
};
export default withReducer;
