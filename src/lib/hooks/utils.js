export const getElRect = el => {
    let { left, right, top, bottom } = el !== null ? el.getBoundingClientRect() : {};
    return { left, right, top, bottom };
  },
  normalizeRect = ({ left, right, top, bottom, x, y, width = false, height = false }) => ({
    left,
    right,
    top,
    bottom,
    x: x || left + (right - left) / 2.0,
    y: y || (bottom - top) / 2.0,
    width: width || right - left,
    height: height || bottom - top
  }),
  mouseEventToRect = ({ x, y }, proximityRadius) => ({
    left: x - proximityRadius,
    right: x + proximityRadius,
    top: y - proximityRadius,
    bottom: y + proximityRadius,
    x,
    y
  }),
  getScreenXY = e => {
    const { screenX: x, screenY: y, pageX, pageY } = e;
    return { x, y, pageX, pageY };
  },
  getPageXY = e => {
    const { pageX: x, pageY: y } = e;
    return { x, y };
  },
  intersectRect = (r1, r2) => !(r2.left > r1.right || r2.right < r1.left || r2.top > r1.bottom || r2.bottom < r1.top),
  isIntersected = (el, e, proximityRadius, event = false) => intersectRect(mouseEventToRect(event ? getPageXY(e) : e, proximityRadius), el);
