export const debounce = (func, wait, immediate) => {
  var timeout;
  return (...args) => {
    const context = this,
      later = () => {
        timeout = null;
        return !immediate && func.apply(context, args);
      },
      callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};
