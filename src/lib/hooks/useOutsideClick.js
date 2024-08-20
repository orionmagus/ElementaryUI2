import { useLayoutEffect } from "react";

export const useOutsideClick = (ref, handler, when = true) => {
  if ("ontouchstart" in document.documentElement) {
    document.body.style.cursor = "pointer";
  }
  const handle = e => (ref && ref.current && !ref.current.contains(e.target) ? handler(e) : null);

  useLayoutEffect(
    () => {
      if (when) {
        document.addEventListener("click", handle);
        return () => {
          document.removeEventListener("click", handle);
        };
      }
    },
    [ref, handler, when]
  );
};

export default useOutsideClick;
