import { createTypesFromActionMap, createActionsFromActionMap } from "../../../lib/lodash/reduxUtils";
import { fnMap } from "./reducer";
export default {
  ...createTypesFromActionMap(fnMap),
  ...createActionsFromActionMap(fnMap)
};
