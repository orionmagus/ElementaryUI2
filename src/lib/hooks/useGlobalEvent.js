import { useState, useEffect, useReducer, useLayoutEffect } from "react";
export const normalizeRect = ({ left, right, top, bottom, width = false, height = false }) => ({
    left,
    right,
    top,
    bottom,
    width: width || right - left,
    height: height || bottom - top
  }),
  getIsOnline = () => navigator.onLine,
  useOnline = () => {
    const [online, changeOnline] = useState(null),
      setOffline = () => changeOnline(false),
      setOnline = () => changeOnline(true);
    useEffect(() => {
      window.addEventListener("online", setOnline);
      window.addEventListener("offline", setOffline);
      return () => {
        window.removeEventListener("online", setOnline);
        window.removeEventListener("offline", setOffline);
      };
    }, []);
    useEffect(() => getIsOnline(), []);
    return online;
  },
  useRaf = (callback, isActive = true) => {
    const [rafId, setRafId] = useState(null);
    useLayoutEffect(() => {
      if (isActive) {
        let _rafId = requestAnimationFrame(() => {
          callback();
          setRafId(_rafId);
        });
        return () => {
          requestAnimationFrame.cancel(rafId);
        };
      }
    }, [callback, isActive, rafId]);
    return rafId;
  },
  useVisbilitySensor = (ref, opts) => {
    const [localState, dispatch] = useReducer(
      (state, { type, payload }) => {
        switch (type) {
          case "set":
            if (state.isVisible === payload.isVisible) {
              return state;
            }
            return payload;
          default:
            return state;
        }
      },
      { isVisible: null, visibilityRect: {} }
    );
    const {
        containment,
        intervalCheck,
        scrollCheck,
        shouldCheckOnMount,
        scrollDebounce,
        scrollThrottle,
        resizeCheck,
        resizeDebounce,
        resizeThrottle,
        partialVisibility,
        minTopValue
      } = {
        intervalCheck: false,
        partialVisibility: false,
        containment: null,
        scrollCheck: true,
        scrollDebounce: 250,
        scrollThrottle: -1,
        resizeCheck: false,
        resizeDebounce: 250,
        resizeThrottle: -1,
        shouldCheckOnMount: true,
        minTopValue: 0,
        ...opts
      },
      getContainer = () => containment || window,
      checkVisibility = () => {
        let containmentRect;
        if (containment) {
          const containmentDOMRect = containment.getBoundingClientRect();
          containmentRect = {
            top: containmentDOMRect.top,
            left: containmentDOMRect.left,
            bottom: containmentDOMRect.bottom,
            right: containmentDOMRect.right
          };
        } else {
          containmentRect = {
            top: 0,
            left: 0,
            bottom: window.innerHeight || document.documentElement.clientHeight,
            right: window.innerWidth || document.documentElement.clientWidth
          };
        }

        const rect = normalizeRect(ref.current.getBoundingClientRect());
        const hasSize = rect.height > 0 && rect.width > 0;

        const visibilityRect = {
          top: rect.top >= containmentRect.top,
          left: rect.left >= containmentRect.left,
          bottom: rect.bottom <= containmentRect.bottom,
          right: rect.right <= containmentRect.right
        };
        let isVisible = hasSize && visibilityRect.top && visibilityRect.left && visibilityRect.bottom && visibilityRect.right;
        if (hasSize && partialVisibility) {
          let partialVisible = rect.top <= containmentRect.bottom && rect.bottom >= containmentRect.top && rect.left <= containmentRect.right && rect.right >= containmentRect.left;
          if (typeof partialVisibility === "string") {
            partialVisible = visibilityRect[partialVisibility];
          }
          isVisible = minTopValue ? partialVisible && rect.top <= containmentRect.bottom - minTopValue : partialVisible;
        }
        return { isVisible, visibilityRect };
      },
      updateIsVisible = ({ isVisible, visibilityRect } = checkVisibility()) =>
        dispatch({
          type: "set",
          payload: { isVisible, visibilityRect }
        });

    useEffect(() => shouldCheckOnMount && updateIsVisible(), []);
    useEffect(() => {
      if (intervalCheck && intervalCheck > 0) {
        const intervalTimer = setInterval(() => {
          updateIsVisible();
        }, intervalCheck);
        return () => {
          clearInterval(intervalTimer);
        };
      }
    }, [intervalCheck]);

    const createListener = (event, debounce, throttle) => {
      const container = getContainer();
      let timeout;
      let listener;
      const later = () => {
        timeout = null;
        updateIsVisible();
      };
      if (throttle > -1) {
        listener = () => {
          if (!timeout) {
            timeout = setTimeout(later, throttle || 0);
          }
        };
      } else {
        listener = () => {
          clearTimeout(timeout);
          timeout = setTimeout(later, debounce || 0);
        };
      }
      container.addEventListener(event, listener);
      return () => {
        clearTimeout(timeout);
        container.removeEventListener(event, listener);
      };
    };
    useLayoutEffect(() => scrollCheck && createListener("scroll", scrollDebounce, scrollThrottle), []);
    useLayoutEffect(() => resizeCheck && createListener("resize", resizeDebounce, resizeThrottle), []);
    return localState;
  };
