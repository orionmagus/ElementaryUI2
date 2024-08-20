export const MAPBOX_TOKEN =
    "pk.eyJ1Ijoib3Jpb25tYWd1cyIsImEiOiJjajNvZXB3dmUwMDF0MzNrY2xzaTd3MjE0In0.70ipk6UPd_YnfNaQUiScsA",
  categories = ["labels", "roads", "buildings", "parks", "water", "background"],
  // Layer id patterns by category
  layerSelector = {
    background: /background/,
    water: /water/,
    parks: /park/,
    buildings: /building/,
    roads: /bridge|road|tunnel/,
    labels: /label|place|poi/
  },
  // Layer color class by type
  colorClass = {
    line: "line-color",
    fill: "fill-color",
    background: "background-color",
    symbol: "text-color"
  },
  state = {
    visibility: {
      water: true,
      parks: true,
      buildings: true,
      roads: true,
      labels: true,
      background: true
    },
    color: {
      water: "#000067",
      parks: "#67ff6",
      buildings: "#c0c0c8",
      roads: "#2797FF",
      labels: "#DEDEDE",
      background: "#111111"
    }
  };
