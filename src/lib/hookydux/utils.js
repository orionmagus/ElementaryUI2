export { compose, noop } from "../lodash/usefulUtils";
export { isUndef, isFunction, isObj } from "../lodash/checkUtils";
export const composeR = (...funcs) => x => funcs.reduceRight((composed, f) => f(composed), x),
  dontUseError = (msg = `This is not allowed.`) => () => {
    throw new Error();
  };
