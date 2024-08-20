export const forEach = (val, callback) => (Array.isArray(val) ? val.forEach(callback) : Object.entries(val).forEach(([i, v]) => callback(v, i, val))),
  map = (val, callback) => (Array.isArray(val) ? val.map(callback) : Object.entries(val).reduce((acc, [i, v]) => ({ ...acc, [i]: callback(v, i, val) }), {})),
  mapMerg = (val, callback) => Object.entries(val).reduce((acc, [i, v]) => ({ ...acc, ...callback(v, i, val) }), {}),
  filter = (val, callback) =>
    Array.isArray(val)
      ? val.filter(callback)
      : Object.entries(val)
          .filter(([i, v]) => callback(v))
          .reduce((acc, [i, v]) => ({ ...acc, [i]: v }), {}),
  rev_kv = val => Object.entries(val).reduce((acc, [i, v]) => ({ ...acc, [v]: i }), {}),
  includes = (src, value) => (Array.isArray(src) ? src.indexOf(value) : value in src),
  each = forEach,
  forIn = (obj, fn, thisArg) => {
    for (var key in obj) {
      if (fn.call(thisArg, obj[key], key, obj) === false) {
        break;
      }
    }
  },
  bind = (obj, method) => (obj[method] = obj[method].bind(obj)),
  toArray = arr => (!arr && (Array.isArray(arr) ? arr.map((v, i) => v) : Array.from(arr === null || arr === undefined ? [] : arr))) || [],
  transpose = rows => rows[0].map((r, i) => rows.map(c => c[i])),
  find = (obj, callback) => {
    if (Array.isArray(obj)) {
      return obj.find(callback);
    }
    for (let i in obj) {
      if (callback(obj[i], i, obj)) {
        return obj[i];
      }
    }
    return false;
  },
  findIndex = (obj, callback) => {
    if (Array.isArray(obj)) {
      return obj.find(callback);
    }
    for (let i in obj) {
      if (callback(obj[i], i, obj)) {
        return i;
      }
    }
    return false;
  },
  isNullOrUndefined = v => v === null || v === undefined,
  isObject = value => !!value && (typeof value === "object" || typeof value === "function"),
  isArray = Array.isArray,
  isIndexable = a => !isNullOrUndefined(a) && (isArray(a) || isObject(a)),
  // defaultTo = (v, d) => (v === undefined ? d : v),
  get = (o, index, defaultF = null) =>
    index
      .split(/[\.\[\]]+?/gi)
      .filter(v => v.length > 0)
      .reduce((a, c) => (isIndexable(a) && a.hasOwnProperty(c) ? a[c] : undefined), o) || defaultF,
  range = (s, e, st = 1) => Array(Math.ceil((e - s) / st)).fill(s, Math.ceil((e - s) / st));
