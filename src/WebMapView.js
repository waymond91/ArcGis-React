import React, { useRef, useEffect, useState } from "react";
import { loadModules } from "esri-loader";

export const WebMapView = () => {
  const mapRef = useRef();
  const view = useRef();
  const dt = 2000;
  const scalar = 0.0000125;
  const [rotation, setRot] = useState(0);
  const [lat, setLat] = useState(-4.62409);
  const [lng, setLng] = useState(55.38619);
  const [zoom, setZoom] = useState(13);
  const [yaw, setYaw] = useState(0);
  const [count, setCount] = useState(0);

  const position = [lng, lat];

  useEffect(() => {
    const interval = setInterval(() => {
      setRot((prevRot) => prevRot + 5);
    }, dt);
    return () => clearInterval(interval);
  }, [rotation]);

  useEffect(() => {
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules(["esri/Map", "esri/views/MapView"], { css: true }).then(
      ([ArcGISMap, MapView]) => {
        const map = new ArcGISMap({
          basemap: "topo-vector"
        });

        view.current = new MapView({
          container: mapRef.current,
          map: map,
          center: position,
          zoom: 15,
          rotation: rotation
        });
      }
    );

    return () => {
      if (view.current) {
        // destroy the map view
        view.current.destroy();
      }
    };
  });

  return <div className="webmap" ref={mapRef} />;
};
