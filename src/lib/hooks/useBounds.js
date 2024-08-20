import { useRef, useState, useEffect } from "react";
import useMutationObserver from "./useMutationObserver";
import ResizeObserver from "resize-observer-polyfill";
import { normalizeRect } from "./utils";
export const useMeasure = cref => {
    const ref = useRef(cref || undefined);
    const [bounds, set] = useState({ left: 0, top: 0, width: 0, height: 0 });
    const [ro] = useState(() => new ResizeObserver(([entry]) => set(entry.contentRect)));
    useEffect(() => (ro.observe(ref.current), ro.disconnect), []);
    return [{ ref }, bounds];
  },
  useBoundingclientRect = (ref, cb = v => v) => {
    const [value, setValue] = useState(null),
      getBoundingClientRect = () => {
        if (ref.current) {
          return ref.current.getBoundingClientRect();
        }
        return null;
      },
      update = () => setValue(getBoundingClientRect());
    useEffect(() => {
      update();
    }, [ref.current]);
    useMutationObserver(ref, update);
    return cb(value && normalizeRect(value));
  };

export default useBoundingclientRect;
