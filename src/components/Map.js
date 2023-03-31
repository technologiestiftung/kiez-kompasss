import { FC, useEffect, useRef, useCallback, useMemo } from "react";
import Map, { Source, Layer, Marker } from "react-map-gl";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import mapStyle from "./mapStyle";
import { useState } from "react";
import { layerStyles } from "./layerStyles";
// import { MapNav } from "@components/MapNav";

// import { useHasMobileSize } from "@lib/hooks/useHasMobileSize";

export const MapComponent = ({ markerData, setQueryBounds }) => {
  const [mapZoom, setMapZoom] = useState(10);

  const mapRef = useRef();
  const startMapView = {
    longitude: 13.341760020413858,
    latitude: 52.510831578689704,
    zoom: mapZoom,
  };

  //   const hasMobileSize = useHasMobileSize();

  const onMapLoad = (e) => {
    if (!mapRef || !mapRef.current) {
      return;
    }
    setMapZoom(mapRef.current.getZoom());

    // if (hasMobileSize) {
    //   const map = mapRef.current.getMap();
    //   map.scrollZoom.disable();
    // }
  };
  useEffect(() => {
    if (mapRef.current) {
      // @ts-ignore
      if (mapRef.current.getZoom() !== mapZoom) {
        // @ts-ignore
        mapRef.current.zoomTo(mapZoom, {
          duration: 200,
        });
      }
    }
  }, [mapZoom]);

  const markers = useMemo(
    () =>
      markerData.map((feature) => (
        <Marker
          longitude={feature.geometry.coordinates[0]}
          latitude={feature.geometry.coordinates[1]}
          anchor="center"
          //   onClick={() => onMarkerCLick(feature)}
          key={
            feature.geometry.coordinates[0] + feature.geometry.coordinates[1]
          }
          //   style={{ opacity: feature.inaktiv ? 0.5 : 1, cursor: "pointer" }}
        >
          <div
            // onMouseEnter={() => showPopupNow(true, feature)}
            // onMouseOut={() => showPopupNow(false, false)}
            // src={
            //   feature.inaktiv ? "./stern_inaktiv.png" : "./stern_leuchtend.png"
            // }
            title={JSON.stringify(feature.properties)}
            className={
              "w-10 h-10 bg-white/90 rounded-full text-2xl text-center align-middle self-center inline p-2"
            }
            // width="20px"
          >
            {feature.properties.emoji}
          </div>
        </Marker>
      )),

    [markerData]
  );

  function onMapMove() {
    setQueryBounds(mapRef.current.getBounds().toArray());
    console.log(mapRef.current.getBounds().toArray());
  }

  return (
    <div className="h-full w-full">
      <Map
        mapLib={maplibregl}
        initialViewState={{ ...startMapView }}
        mapStyle={mapStyle()}
        // onClick={onMapCLick}
        // onMouseMove={onMapCLick}
        onMoveEnd={onMapMove}
        // @ts-ignore
        ref={mapRef}
        bounds={[
          //   12.777342808197773, 52.129092675117505, 14.009067613750716,
          //   52.86814653557087,

          13.376691341400146, 52.52804962287233, 13.388965129852295,
          52.53917045060706,
        ]}
        maxBounds={[
          11.82943127508483, 51.74832292717255, 15.046752480983088,
          53.467541934574086,
        ]}
        attributionControl={false}
        interactiveLayerIds={["stations"]}
        onLoad={onMapLoad}
      >
        {markers}
      </Map>
      {/* <MapNav mapZoom={mapZoom} setMapZoom={setMapZoom} /> */}
      <div>
        <div className="fixed bottom-2 right-2 text-gray-500/60 text-xs">
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noreferrer"
          >
            © OpenStreetMap contributors
          </a>
        </div>
      </div>
    </div>
  );
};
