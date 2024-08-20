import React, {
  Component,
  useMemo,
  useCallback,
  useState,
  useReducer
} from "react";
import posed, { PoseGroup } from "react-pose";
import { Seq, Record, List, Map, fromJS } from "immutable";
import MapGL, { StaticMap } from "react-map-gl";
// import HeatmapOverlay from "react-map-gl-heatmap-overlay";
import DeckGL, {
  MapController,
  OrbitView,
  HexagonLayer,
  ScatterplotLayer,
  GeoJsonLayer,
  LineLayer,
  TextLayer,
  ScreenGridLayer,
  GridLayer
} from "deck.gl";
import mapStyle from "./MapStyle";
import { MAPBOX_TOKEN } from "./constants";
import { Slider, useField } from "../MapLayer/Control";
import { useEventCallback } from "rxjs-hooks";
import { map } from "rxjs/operators";
import ld from "../../lib/lodash";
import withErrorBoundary from "../../lib/hof/withErrorBoundary";
// import console = require("console");

export const INITIAL_VIEW_STATE = {
  longitude: 24.937506,
  latitude: -28.559482,
  zoom: 5.5,
  minZoom: 2,
  maxZoom: 20,
  pitch: 15.5,
  bearing: 0
};

const LIGHT_SETTINGSa = {
    lightsPosition: [-0.144528, 49.739968, 8000, -3.807751, 54.104682, 8000],
    ambientRatio: 0.4,
    diffuseRatio: 0.6,
    specularRatio: 0.2,
    lightsStrength: [0.8, 0.0, 0.8, 0.0],
    numberOfLights: 2
  },
  LIGHT_SETTINGS = {
    lightsPosition: [-30.144528, 28.739968, 8000, -31.807751, 35.104682, 8000],
    ambientRatio: 0.4,
    diffuseRatio: 0.6,
    specularRatio: 0.2,
    lightsStrength: [0.8, 0.0, 0.8, 0.0],
    numberOfLights: 2
  };
const colorRange = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78]
];
const DEFAULT_COLOR = [255, 0, 0],
  DEFAULT_LNG_LAT_ACC = ({ lnglat }) => lnglat;
const CLAIM_TYPE_COLOR = {
  "1": [0, 68, 255],
  "2": [100, 150, 250],
  "3": [230, 112, 46],
  "4": [230, 134, 46],
  "5": [230, 156, 46],
  "6": [0, 250, 46],
  "7": [250, 180, 46],
  "8": [86, 0, 0],
  "9": [86, 0, 46],
  "10": [193, 230, 46],
  "11": [171, 230, 255],
  "12": [149, 230, 46],
  "13": [255, 255, 46],
  "14": [128, 0, 255],
  "15": [83, 230, 46],
  "16": [61, 230, 46],
  "17": [75, 46, 0],
  "18": [46, 230, 75],
  "19": [46, 230, 97],
  "20": [150, 120, 80],
  "21": [46, 230, 141]
};

const MAP_DEFAULTS = {
  LIGHT: {
    SETTING1: {
      lightsPosition: [-0.144528, 49.739968, 8000, -3.807751, 54.104682, 8000],
      ambientRatio: 0.4,
      diffuseRatio: 0.6,
      specularRatio: 0.2,
      lightsStrength: [0.8, 0.0, 0.8, 0.0],
      numberOfLights: 2
    },
    SETTING2: {
      lightsPosition: [
        -30.144528,
        28.739968,
        8000,
        -31.807751,
        35.104682,
        8000
      ],
      ambientRatio: 0.4,
      diffuseRatio: 0.6,
      specularRatio: 0.2,
      lightsStrength: [0.8, 0.0, 0.8, 0.0],
      numberOfLights: 2
    }
  },
  COLOR_RANGES: {
    GREEN_TO_RED: [
      [1, 152, 189],
      [73, 227, 206],
      [216, 254, 181],
      [254, 237, 177],
      [254, 173, 84],
      [209, 55, 78]
    ]
  },
  ELEVATION_SCALE: {
    min: 1,
    max: 50
  },
  VIEWPORT: {
    //center coordinates
    longitude: 24.732942301656927,
    latitude: -30.215847138450684,
    zoom: 5.55,
    minZoom: 5,
    maxZoom: 16,
    pitch: 40.5,
    bearing: 0,
    maxBounds: [
      // Southwest coordinates
      [12.2816999, -35.1313489],
      // Northeast coordinates
      [38.2216904, -22.1254241]
    ]
  }
};
const getRandLngLat = (
  sample = [[24.732942301656927, -30.215847138450684]]
) => {
  const coord = sample[Math.floor(sample.length * Math.random())];
  return [
    Math.sin(Math.random() * 1.5) + coord[0],
    Math.cos(Math.random() * 1.5) + coord[1]
  ];
};
const LAYER = {
  Hex: HexagonLayer,
  // 'Line': LineLayer,
  Scatter: ScatterplotLayer,
  // 'GeoJson': GeoJsonLayer,
  Grid: GridLayer
};
const elevationScale = { min: 1, max: 50 },
  toArray = item => (Array.isArray(item) ? item : [item]),
  toSet = item => Set(toArray(item)),
  isEmpty = a =>
    Array.isArray(a) ? a.length === 0 : ld.isObj(a) ? false : Set(a).size,
  ops = {
    // isin: (a, b) => b.length > 0 ? Set(a).intersect(Set(b)).size > 0: true,
    isin: (a, b) => (b.length > 0 ? Set(a).intersect(toSet(b)).size > 0 : true)
  };
const toImm = data => fromJS(data, immutRevive),
  immutRevive = (key, value) =>
    !!value && !ld.isObj(value)
      ? value
      : Array.isArray(value)
      ? Seq(value)
          .map(immutRevive)
          .toList()
      : "lnglat" in value
      ? "sp_id" in value
        ? new SP({
            ...value,
            lnglat: new LatLng({
              id: `sp-${value.sp_id}`,
              lng: value.lnglat[0],
              lat: value.lnglat[1]
            }),
            id: `sp-${value.sp_id}`
          })
        : new Policy({ ...value, id: `pol-${value.id}` })
      : key === "lnglat" || ("lng" in value && "lat" in value)
      ? new LatLng(value)
      : Map(value);
class LatLng extends Record({
  id: "sp-1",
  ref: "service_provider",
  lng: 28.180556,
  lat: -26.229444
}) {
  valueOf = () => [this.lng, this.lat];
  get latlng() {
    return [this.lng, this.lat];
  }
}
class SP extends Record({
  name: "A M Builders",
  sp_id: 1,
  _lnglat: { lnglat: [] },
  id: "sp-1",
  coords: [27.908744, -26.239525],
  sp_areas: 1,
  sp_skills: [2, 4, 6, 7, 10, 11, 18, 33]
}) {
  hasSkills(skills) {
    return isEmpty(skills)
      ? true
      : Set(this.sp_skills).intersect(toSet(skills)).size > 0;
  }
  get lnglat() {
    return this._lnglat.lnglat;
  }
}
class Policy extends Record({
  id: "pol-0",
  policy_key: "111",
  account_no: "10",
  policy_start: 1537855150279,
  premium: 0.0,
  plan_code: 1847,
  status_code: 1,
  policy_address: "",
  postal_code: ""
}) {}
/* eslint-disable react/no-deprecated */
class LayerProps extends Record({
  opacity: 1,
  id: "",
  minSizePixels: 25,
  colorRange: [
    [1, 152, 189],
    [73, 227, 206],
    [216, 254, 181],
    [254, 237, 177],
    [254, 173, 84],
    [209, 55, 78]
  ],
  coverage: 1.0,
  radius: 3000,
  upperPercentile: 100,
  elevationRange: [0, 3000],
  elevationScale: 5,
  _filter: [{ accessor: "sp_skills", oper: "isin", compare: [] }],
  _raw_data: [],
  pickable: true,
  visible: true,
  extruded: true
}) {
  get data() {
    return Seq(this._raw_data)
      .filter(c => true)
      .toList();
    // return Seq(this._raw_data).filter(rec =>
    //   "skills" in rec ? Set(rec[f]).intersect() : true
    // );
  }
  getPosition = d => d.lnglat;
  getColorValue = points => points.length;
}
const createLayer = ({
    LayerType,
    id,
    data,
    radius = 1000,
    upperPercentile = 100,
    coverage = 1,
    // eventCallback,
    ...props
  }) => {
    const lay_props = {
      id,
      data,
      colorRange,
      coverage,
      radius,
      upperPercentile,
      radiusScale: 10,

      elevationRange: [200, 3000],
      elevationScale: 100,
      extruded: true,
      getPosition: d => d.lnglat,
      lightSettings: LIGHT_SETTINGS,
      ...props
      // onHover: { eventCallback }
    };
    // console.log(lay_props);
    return new LayerType(lay_props);
  },
  initState = key => initState => initState,
  globDefLayer = {
    Hex: {
      LayerType: HexagonLayer,
      radius: 1000
    },
    Scatter: {
      LayerType: ScatterplotLayer,
      radiusMinPixels: 0.25,
      fill: [150, 150, 150],
      // getFillColor: x => x.color || [150, 150, 150],
      // getRadius: x => x.radius || 8000,
      radiusScale: 10
    },
    Grid: {
      LayerType: GridLayer,
      cellSize: 1000
    }
  },
  BASE = {
    upperPercentile: 100,
    coverage: 1,
    elevationRange: [0, 3000],
    elevationScale: 50,
    extruded: true
  };
const defaultProps = {
  key: "map_view.service_providers",
  initialState: {
    // _filter:{skills:{selected: [], items:[]}},
    radius: 3000,
    type: "Hex",
    data: [],
    LayerType: HexagonLayer,
    visible: true,
    extruded: true
  },
  init: initState("map_view.service_providers"),
  fnMap: {
    SET_RADIUS: (state, { radius }) => ({ ...state, radius }),
    TOGGLE_VISIBLE: ({ visible, ...state }, payload) => ({
      ...state,
      visible: !visible
    }),
    SET_DATA: (state, { data }) => ({ ...state, data }),
    // FILTER: (state, payload) => state.set("radius", payload),
    SET_LAYER_TYPE: ({ radius, extruded, visible, ...state }, { type }) => ({
      ...state,
      ...globDefLayer[type],
      cellSize: radius,
      radius,
      getRadius: () => radius,
      extruded,
      visible
    }),
    TOGGLE_EXTRUDED: ({ extruded, ...state }, payload) => ({
      ...state,
      extruded: !extruded
    })
  },
  selectors: {}
};
const ErrorSlider = withErrorBoundary(Slider);
const useConnect = props => {
    const { initialState, fnMap, init, selectors, key } = {
        ...defaultProps,
        ...props
      },
      [state, dispatch] = useReducer(
        ld.createMutableReducer(initialState, fnMap),
        initialState,
        init
      ),
      actions = ld.bindTypes(Object.keys(fnMap))(dispatch);
    return (
      mstp = v => v,
      mdtp = v => v,
      addLayer = v => v
    ) => WrappedComponent => {
      const connected_props = { ...mstp(state) },
        actionProps = { ...mdtp(actions), dispatch },
        caLayer = addLayer(createLayer({ ...connected_props, id: key }));
      return <WrappedComponent {...{ ...connected_props, ...actionProps }} />;
    };
  },
  prox = {
    defineProperty: (target, name, value, sett) =>
      Object.defineProperty(target, name, {
        enumerable: true,
        get: () => value,
        set: v => sett(v)
      })
  };

const MapViewHooked = ({
  controller = { type: MapController, dragPan: true, dragRotate: true },
  info = {},
  map_view,
  ...props
}) => {
  const [viewState, setViewState] = useState(),
    [
      eventCallback,
      [layer, index, object, x, y, coordinate]
    ] = useEventCallback(
      event$ =>
        event$.pipe(
          map(({ layer, index, object, x, y, coordinate }) => [
            layer,
            index,
            object,
            x,
            y,
            coordinate
          ])
        ),
      ["n", 0, {}, 0, 0, [0, 0]]
    );
  const [initvalue, setRadius] = useState(3000);
  const sample_coords = [...map_view.serviceproviders].map(d => d.lnglat);
  const [prevIndex, setIndex] = useState();
  const datasets = [
    {
      id: "polayer",
      name: "Policies",
      radius: 20000,
      radiusScale: 10,
      pickable: true,
      highlightColor: [255, 100, 50, 140],
      autoHighlight: true,
      coverage: 1,
      ...BASE,
      data: [...ld.range(1, 448900)].map((v, id) => ({
        id,
        lnglat: getRandLngLat(sample_coords)
      })),
      onHover: ({ x, y, object, picked, index }, e) => {
        // if (prevIndex !== index) {
        picked && console.log(x, y, object.points.length);
        // }

        setIndex(picked ? index : null);
      },
      LayerType: HexagonLayer
    },
    {
      id: "sp-layer",
      name: "Service Providers",
      data: [...map_view.serviceproviders].map(r => ({
        ...r,
        // radius: initvalue,
        color: [100, 120, 180, 200]
      })),
      radius: initvalue,

      getText: d => d.name,
      // getSize: Math.random() * 10 + 20,
      getAngle: 0,
      fontFamily: "Roboto",
      getTextAnchor: "middle",
      pickable: true,
      highlightColor: [255, 100, 50, 140],
      autoHighlight: true,
      getAlignmentBaseline: "center",
      getFillColor: d =>
        d.color || [
          Math.random() * 255,
          Math.random() * 255,
          Math.random() * 255
          // Math.random() * 105 + 150
        ],
      getStrokeColor: d =>
        d.color || [
          Math.random() * 255,
          Math.random() * 255,
          Math.random() * 255
          // Math.random() * 105 + 150
        ],
      maxColor: [0, 180, 0, 255],
      cellSizePixels: 5,
      opacity: 0.5,
      stroked: false,
      filled: true,
      radiusScale: 10,
      radiusMinPixels: 0.5,
      // radiusMaxPixels: 100,
      lineWidthMinPixels: 0,
      getPosition: d => d.lnglat,
      getRadius: d => initvalue,
      // getFillColor: d => [180, 0, 0],
      onClick: eventCallback,

      transitions: {
        getPositions: 600,
        getRadius: 2500
        // getColors: {
        //   duration: 300,
        //   easing: d3.easeCubicInOut,
        //   enter: value => [value[0], value[1], value[2], 0] // fade in
        // }
      },
      LayerType: ScatterplotLayer
    }
  ].map(props => createLayer(props));

  return (
    <div
      style={{
        width: "100%",
        overflow: "hidden",
        position: "relative",
        height: "100%"
      }}
      className="resizeable flex-layout"
    >
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="30" />
          <feColorMatrix
            in="blur"
            values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 30 -7"
          />
        </filter>
      </svg>
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        layers={datasets}
        // views={[new OrbitView()]}
        viewState={viewState}
        onViewStateChanged={setViewState}
        controller={controller}
        width="100%"
        height="100%"
        // style={{ filter: "url(#goo)" }}
        // onLayerHover={(...args) => console.log(args)}
      >
        <StaticMap
          mapStyle={mapStyle}
          preventStyleDiffing={true}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        >
          {/* <HeatmapOverlay /> */}
        </StaticMap>
        {({ x, y, width, height, viewState, viewport }) => (
          <span>{JSON.stringify(viewState, null, 2)}</span>
        )}
      </DeckGL>
      <div className="flex-right">
        <span>Panel</span>
        <Slider
          range={[600, 50000]}
          initvalue={initvalue}
          onDrag={v => setRadius(v)}
        />
      </div>
      <div className="tooltip">{object.points && object.points.length}</div>
    </div>
  );
};
const FadeMovePose = posed.div({
  enter: { y: 0, opacity: 1 },
  exit: { y: 50, opacity: 0 }
});
const ToolTip = ({ x, y, text, key, ...props }) =>
  text.length > 0 ? (
    <FadeMovePose key={key} className="tooltip">
      {text}
    </FadeMovePose>
  ) : null;
export default MapViewHooked;
