import { fromJS } from "immutable";

import MapStyleDark from "../../style/map/style_roboto.json";

export const defaultMapStyle = fromJS(MapStyleDark);

// const layers = _defaultLayers
// .filter(layer => {
//   const id = layer.get('id');
//   return categories.every(name => visibility[name] || !layerSelector[name].test(id));
// })
// .map(layer => {
//   const id = layer.get('id');
//   const type = layer.get('type');
//   const category = categories.find(name => layerSelector[name].test(id));
//   if (category && colorClass[type]) {
//     return layer.setIn(['paint', colorClass[type]], color[category]);
//   }
//   return layer;
// });

//  defaultMapStyle.set('layers', layers);

export default defaultMapStyle;
