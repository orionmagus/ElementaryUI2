import { createEpicMiddleware, combineEpics } from "redux-observable";
import { BehaviorSubject } from "rxjs";
export const EPIC_END = "@@redux-observable/EPIC_END";
export default (allEpics = null, epicOptions = {}) => {
  if (allEpics === null) {
    return { addMiddleware: v => v, asyncApply: store => store };
  }
  const middleware = createEpicMiddleware(epicOptions);
  return {
    addMiddleware: v => [...v, middleware],
    asyncApply: _store => {
      const epic$ = new BehaviorSubject(combineEpics(...allEpics));
      const hotReloadingEpic$ = (action$, ...rest) => epic$.mergeMap(epic => epic(action$, ...rest).takeUntil(action$.ofType(EPIC_END)));

      middleware.replaceEpic = asyncEpic => {
        _store.dispatch({ type: EPIC_END, payload: {} });
        epic$.next(asyncEpic);
      };

      _store.asyncEpics = [...allEpics]; // Epic registry
      _store.injectEpic = epic => {
        _store.asyncEpics.push(epic);
        const newRootEpic = combineEpics(..._store.asyncEpics);
        middleware.replaceEpic(newRootEpic);
      };
      middleware.run(hotReloadingEpic$);
    }
  };
};
