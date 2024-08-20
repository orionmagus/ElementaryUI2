import ld from "../lodash";
class Datetime extends Date {
  constructor(...args) {
    super(...args);
  }
}

class IDataType {
  static type = "Duration";
  static serial_prefix = "$t__";

  _value = Number(0);
  constructor(v, frmt = ".0f") {
    this._value = v;
    this.__format__ = ld.f;
  }
  get function() {
    return this._value;
  }
  set function(v) {
    this._value = v;
  }
  toJSON() {}
  valueOf() {
    return this._value;
  }
  toString(f = "") {}
}
