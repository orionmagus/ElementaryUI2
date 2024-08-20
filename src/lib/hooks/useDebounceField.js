import React, { useState } from "react";
import { debounce } from "../lodash/timingUtils";
export const useField = (initial, callback = false, debounceTime = 2500) => {
  const [value, set] = useState(initial);
  const cb = callback ? debounce(callback, debounceTime) : v => v;
  return {
    value,
    set,
    reset: () => set(initial),
    input_props: {
      value,
      onChange: e => {
        set(e.target.value);
        cb(e.target.value);
      }
    }
  };
};
export default useField;
