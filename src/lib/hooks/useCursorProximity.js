import { useEffect, useState, createContext, useContext, useLayoutEffect, useMemo } from "react";
import { getScreenXY, getPageXY, getElRect, intersectRect, mouseEventToRect } from "./utils";
import useMutationObserver from "./useMutationObserver";
import { fromEvent, merge } from "rxjs";
import { map, debounceTime, distinctUntilChanged, switchMap, publishBehavior } from "rxjs/operators";
import { debounce } from "../lodash/timingUtils";
export function useMedia(queries, values, defaultValue) {
  const match = () => values[queries.findIndex(q => matchMedia(q).matches)] || defaultValue;
  const [value, set] = useState(match);
  useEffect(() => {
    const handler = () => set(match);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener(handler);
  }, []);
  return value;
}
const initialMouseState = {
  x: null,
  y: null
};

function getMousePositionFromEvent(e) {
  const { screenX: x, screenY: y, pageX, pageY } = e;
  return { x, y, pageX, pageY };
}

export const useMouse = (coordType = "page") => {
  const [coord, set] = useState(initialMouseState),
    getCB = coordType === "page" ? getPageXY : getScreenXY,
    update = e => {
      set(getCB(e));
    };

  useEffect(() => {
    document.addEventListener("mousemove", update);
    return () => {
      document.removeEventListener("mousemove", update);
    };
  }, []);
  return coord;
};
const createMulticastEventStream = (node, event) =>
  fromEvent(node, event).pipe(
    debounceTime(800),
    distinctUntilChanged(),
    publishBehavior({})
  );

export const globalEvent = (() => {
  var $eventStream = null;
  class GEV {
    constructor() {
      this.events = {
        documentMouseMove: createMulticastEventStream(document, "mousemove"),
        documentMouseEnter: createMulticastEventStream(document, "mouseenter"),
        documentMouseLeave: createMulticastEventStream(document, "mouseeleave"),
        documentClick: createMulticastEventStream(document, "click"),
        documentContextMenu: createMulticastEventStream(document, "contextmenu"),
        windowScroll: createMulticastEventStream(window, "scroll"),
        windowResize: createMulticastEventStream(window, "resize")
      };
    }
    getEvent = k => this.events[k] || false;
    subscribe = (k, subscriber) => (k in this.events ? this.getEvent(k).subscribe(subscriber) : false);
  }
  function create() {
    $eventStream = new GEV();
    return $eventStream;
  }
  const instance = () => ($eventStream ? $eventStream : create());
  return {
    instance,
    subscribe: (k, cb) => instance().subscribe(k, cb),
    get: k => instance().getEvent(k)
  };
})();
const scrollXY = e => {
    const { scrollX, scrollY } = window;
    return { scrollX, scrollY };
  },
  pageXY = e => {
    const { pageX, pageY } = e;
    return { pageX, pageY };
  };
// const eff$ = () => {
//   const mm = globalEvent.subscribe("documentMouseMove", updatePageXY),
//     s = globalEvent.subscribe("windowScroll", updateScrollXY);
//   return () => {
//     s.unsubscribe();
//     mm.unsubscribe();
//   };
// }
// const direc = () => {
//   document.addEventListener("mousemove", updatePageXY);
//   window.addEventListener("scroll", updateScrollXY);
//   return () => {
//     document.removeEventListener("mousemove", updatePageXY);
//     window.removeEventListener("scroll", updateScrollXY);
//   };
// }
// return useMemo(
//   () =>
//     callback(
//       intersects
//         ? {
//             x: null,
//             y: null
//           }
//         : {
//             x: pageX - left - scrollX,
//             y: pageY - top - scrollY
//           }
//     ),
//   [intersects, pageX, pageY, left, top, scrollX, scrollY]
// );
export const useCursorProximity = (ref, callback, radius = 150) => {
  const [rect, setRect] = useState({}),
    { left, top } = rect,
    [intersects, setIntersect] = useState(false),
    [{ pageX, pageY }, setMouse] = useState({ pageX: 0, pageY: 0 }),
    [{ scrollX, scrollY }, setScroll] = useState({ scrollX: 0, scrollY: 0 }),
    updatePageXY = e => {
      const c = getPageXY(e);
      const isInRange = intersectRect(rect, mouseEventToRect(c, radius));
      setIntersect(isInRange);
      if (isInRange) {
        setMouse({ pageX: c.x, pageY: c.y });
      }
    },
    updateScrollXY = e => setScroll(scrollXY(e)),
    updateRect = () => setRect(getElRect(ref.current));

  // useEffect(() => {
  //   const mm = globalEvent.subscribe("documentMouseMove", updatePageXY),
  //     s = globalEvent.subscribe("windowScroll", updateScrollXY);
  //   return () => {
  //     s.unsubscribe();
  //     mm.unsubscribe();
  //   };
  // }, []);
  useEffect(() => {
    document.addEventListener("mousemove", updatePageXY);
    window.addEventListener("scroll", updateScrollXY);
    return () => {
      document.removeEventListener("mousemove", updatePageXY);
      window.removeEventListener("scroll", updateScrollXY);
    };
  }, []);
  useEffect(() => updateRect(), [ref.current]);
  useMutationObserver(ref, updateRect);
  // return callback(intersects && {
  //   x: pageX - left - scrollX,
  //   y: pageY - top - scrollY
  // });
  return useMemo(
    () =>
      callback(
        intersects
          ? {
              x: pageX - left - scrollX,
              y: pageY - top - scrollY
            }
          : {
              x: null,
              y: null
            }
      ),
    [intersects, pageX, pageY, left, top, scrollX, scrollY]
  );
};
// let x = e.pageX - getElRect(element).left - window.scrollX
// 			let y = e.pageY - getElRect(element).top - window.scrollY
export default useCursorProximity;
