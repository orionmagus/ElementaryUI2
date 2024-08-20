export const isFunction = v => !!v && typeof v === "function",
  isUndef = v => typeof v === "undefined" || v === null,
  isObj = value => !!value && typeof value === "object",
  isObject = value => !!value && (isObj(value) || isFunction(value)),
  isPlainObject = obj => {
    if (!isObj(obj)) {
      return false;
    }

    let proto = obj;
    while (Object.getPrototypeOf(proto) !== null) {
      proto = Object.getPrototypeOf(proto);
    }

    return Object.getPrototypeOf(obj) === proto;
  };
