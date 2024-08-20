// export default (option, dayjsClass, dayjsFactory) => {
//   // extend dayjs()
//   // e.g. add dayjs().isSameOrBefore()
//   // dayjsClass.prototype.isSameOrBefore = () => true;

//   // overriding existing API
//   // e.g. extend dayjs().format()
//   const oldFormat = proto.format;
//   dayjsClass.prototype.format = (...args) => {
//     // original format result
//     const result = oldFormat(...args);
//     // return modified result
//     return result;
//   };
// };
export default (o, c, d) => {
  const proto = c.prototype;
  proto.isLeapYear = () =>
    (this.$y % 4 === 0 && this.$y % 100 !== 0) || this.$y % 400 === 0;
  proto.isBetween = function(a, b, u, i) {
    var dA = d(a);
    var dB = d(b);
    i = i || "()";
    var dAi = i[0] === "(";
    var dBi = i[1] === ")";
    return (
      ((dAi ? this.isAfter(dA, u) : !this.isBefore(dA, u)) &&
        (dBi ? this.isBefore(dB, u) : !this.isAfter(dB, u))) ||
      ((dAi ? this.isBefore(dA, u) : !this.isAfter(dA, u)) &&
        (dBi ? this.isAfter(dB, u) : !this.isBefore(dB, u)))
    );
  };
  proto.isSameOrBefore = (that, units) =>
    this.isSame(that, units) || this.isBefore(that, units);
  proto.isSameOrAfter = (that, units) =>
    this.isSame(that, units) || this.isAfter(that, units);
  d.isMoment = input => d.isDayjs(input);
};
