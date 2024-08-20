import { Record } from "immutable";

class Rect extends Record({ left: 0, right: 0, top: 0, bottom: 0 }) {
  get x() {
    return this.left + this.width / 2.0;
  }
  get y() {
    return this.top + this.height / 2.0;
  }
  get width() {
    return this.right - this.left;
  }
  get height() {
    return this.bottom - this.top;
  }
  static fromRadius(x, y, r) {
    return new Rect({ left: x - r, right: x + r, top: y - r, bottom: y + r });
  }
}
export default Rect;
