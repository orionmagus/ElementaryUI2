import { from } from "rxjs/observable/from";
import { of } from "rxjs/observable/of";
import { map, debounceTime, filter, switchMap, takeUntil, catchError, delay } from "rxjs/operators";
import { LOGIN_REQUEST, LOGIN_ERROR, LOGIN_SUCCESS, loginReset, loginError, loginSuccess } from "./actions";
export default {
  LOGIN_REQUEST: (action$, store, { Query }) =>
    action$.ofType(LOGIN_REQUEST).pipe(
      debounceTime(500),
      filter(action => action.payload !== undefined),
      switchMap(({ payload, url }) =>
        from(Query(url, { body: JSON.stringify(payload) }))
          .pipe(
            map(data => (!data.success ? loginError(data) : loginSuccess(data))),
            takeUntil(action$.ofType("CANCEL_REQUEST")),
            catchError(err => of(loginError(err)))
          )
          .catch(err => of(loginError(err)))
      )
    ),
  LOGIN_ERROR: action$ => action$.ofType(LOGIN_ERROR).pipe(switchMap(() => of(loginReset()).pipe(delay(6000))))
};
