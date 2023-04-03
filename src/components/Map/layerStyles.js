const linePaint = {
  "line-color": "#ffffff",
  "line-width": 3,
  // "line-opacity": 0.5,
};

export const layerStyles = {
  berlin: {
    id: "berlin",
    type: "line",
    paint: {
      "line-color": "#008291",
      "line-width": 2,
      // "line-dasharray": [1, 2],
    },
  },
  berlinInnenstadt: {
    id: "berlinInnenstadt",
    type: "line",
    paint: {
      "line-color": "#bf5900",
      "line-width": 2,
      // "line-dasharray": [1, 2],
    },
  },
  berlinBuffer: {
    id: "berlinBuffer",
    type: "line",
    paint: {
      "line-color": "#59821f",
      "line-width": 2,
      "line-dasharray": [1, 2],
    },
  },
  berlinBufferLg: {
    id: "berlinBufferLg",
    type: "line",
    paint: {
      "line-color": "#59821f",
      "line-width": 2,
      "line-dasharray": [1, 2],
    },
  },
  zoneA: {
    id: "zoneA",
    type: "fill",
    paint: {
      "fill-color": "#bf5900",
      "fill-opacity": 0.5,
    },
  },
  zoneB: {
    id: "zoneB",
    type: "fill",
    paint: {
      "fill-color": "#008291",
      "fill-opacity": 0.5,
    },
  },
  zoneC: {
    id: "zoneC",
    type: "fill",
    paint: {
      "fill-color": "#59821f",
      "fill-opacity": 0.5,
    },
  },
  zoneALine: {
    id: "zoneALine",
    type: "line",
    paint: linePaint,
  },
  zoneBLine: {
    id: "zoneBLine",
    type: "line",
    paint: linePaint,
  },
  zoneCLine: {
    id: "zoneCLine",
    type: "line",
    paint: linePaint,
  },
  stations: {
    id: "stations",
    type: "circle",
    paint: {
      "circle-color": "#fff",
      "circle-stroke-color": "#373632",
      "circle-stroke-width": [
        "interpolate",
        ["exponential", 0.5],
        ["zoom"],
        10,
        0,
        15,
        1,
      ],
      "circle-radius": [
        "interpolate",
        ["exponential", 0.5],
        ["zoom"],
        10,
        1,
        14,
        4,
        15,
        5,
      ],
      "circle-opacity": [
        "interpolate",
        ["exponential", 0.5],
        ["zoom"],
        10,
        0,
        15,
        1,
      ],
    },
  },
};
