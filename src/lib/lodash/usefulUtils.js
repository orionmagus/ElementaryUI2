export const noop = v => v,
  compose = (...funcs) =>
    funcs.length > 1
      ? funcs.reduce((a, b) => (...args) => a(b(...args)))
      : funcs.length === 1
      ? funcs[0]
      : noop,
  to_point = ([x, y]) => ({ x, y }),
  bounds_to_rect = ([[x0, y0], [x1, y1]]) =>
    [[x0, y0], [x1, y0], [x1, y1], [x0, y1]].map(v => to_point(v)),
  isPointInPoly = (poly, { x, y }) => {
    for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
      ((poly[i].y <= y && y < poly[j].y) ||
        (poly[j].y <= y && y <= poly[i].y)) &&
        x <=
          ((poly[j].x - poly[i].x) * (y - poly[i].y)) /
            (poly[j].y - poly[i].y) +
            poly[i].x &&
        (c = !c);
    return c;
  },
  within_bounds = ([[xn, yn], [xx, yx]], [x, y]) =>
    xn <= x && x <= xx && yn <= y && y <= yx,
  getMsgID = (prefix = "MSG", base = 36, sub = 3, cnj = "_") =>
    [
      prefix,
      Math.random()
        .toString(base)
        .substring(sub)
    ].join(cnj);
