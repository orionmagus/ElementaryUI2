import icons from "./icons.json";
import charts from "./charts.json";
import poi from "./poi.json";
import directional from "./directional.json";
import actions from "./actions.json";
const x = -60,
  y = 600;
export default {
  viewBox: [x, x, y, y],
  icons: { ...icons, ...directional, ...poi, ...charts, ...actions }
};
