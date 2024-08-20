import React, { useState } from "react";
export const useField = initial => {
  const [value, set] = useState(initial);
  return {
    value,
    set,
    reset: () => set(initial),
    props: {
      value,
      onChange: e => set(e.target.value)
    }
  };
};
