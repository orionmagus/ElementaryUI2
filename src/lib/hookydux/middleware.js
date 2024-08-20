import { compose, dontUseError } from "./utils";

export const baseMiddleware = store => next => action => {},
  applyMiddleware = (...middlewares) => createStoreCallback => (...args) => {
    const store = createStoreCallback(...args);
    let dispatch = dontUseError(
      `Dispatching while constructing your middleware is not allowed. ` +
        `Other middleware would not be applied to this dispatch.`
    );
    let chain = [];

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    };
    chain = middlewares.map(middleware => middleware(middlewareAPI));
    dispatch = compose(...chain)(store.dispatch);

    return {
      ...store,
      dispatch
    };
  };
export default applyMiddleware;
