const TypeSuffix = Math.random()
  .toString(36)
  .substring(7)
  .split("")
  .join(".");

export default {
  INIT: "@@redux/INIT",
  REPLACE: "@@redux/REPLACE",
  EPIC_END: "@@redux-observable/EPIC_END"
};
