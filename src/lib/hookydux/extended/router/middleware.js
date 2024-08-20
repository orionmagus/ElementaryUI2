export const CALL_HISTORY_METHOD = "@@router/CALL_HISTORY_METHOD",
  LOCATION_CHANGE = "@@router/LOCATION_CHANGE";
function updateLocation(method) {
  return (...args) => ({
    type: CALL_HISTORY_METHOD,
    payload: { method, args }
  });
}

export const push = updateLocation("push");
export const replace = updateLocation("replace");
export const go = updateLocation("go");
export const goBack = updateLocation("goBack");
export const goForward = updateLocation("goForward");

export const routerActions = { push, replace, go, goBack, goForward };
export default history => () => next => action => {
  if (action.type !== CALL_HISTORY_METHOD) {
    return next(action);
  }
  const {
    payload: { method, args }
  } = action;
  history[method](...args);
};
