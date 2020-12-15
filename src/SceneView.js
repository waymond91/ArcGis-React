import React, { useEffect, useRef, useState } from "react";
import geolocate from "mock-geolocation";
import { loadModules } from "esri-loader";

export const SceneView = () => {
  const mapRef = useRef();
  const dt = 2000;
  const [heading, setHead] = useState(0);
  const [lat, setLat] = useState(-4.62409);
  const [lng, setLng] = useState(55.38619);
  const [alt, setAlt] = useState(500);
  const position = [lng, lat, alt];

  useEffect(() => {
    // lazy load the required ArcGIS API for JavaScript modules and CSS
    loadModules(
      [
        "esri/Map",
        "esri/views/SceneView",
        "esri/widgets/Track",
        "esri/widgets/Fullscreen",
        "esri/Graphic",
        "esri/layers/GraphicsLayer"
      ],
      {
        css: true
      }
    ).then(
      ([ArcGISMap, SceneView, Track, Fullscreen, Graphic, GraphicsLayer]) => {
        const map = new ArcGISMap({
          basemap: "topo-vector",
          ground: "world-elevation" // show elevation
        });

        // load the map view at the ref's DOM node
        let view = new SceneView({
          container: mapRef.current,
          map: map,
          ui: {
            components: ["attribution"] // replace default set of UI components
          },
          camera: {
            position: position,
            tilt: 0, // perspective in degrees
            heading: 0
          }
        });

        let fullscreen = new Fullscreen({
          view: view
        });
        view.ui.add(fullscreen, "top-right");

        var point = {
          type: "point",
          longitude: lng + 0.0002,
          latitude: lat
        };

        var simpleMarkerSymbol = {
          type: "simple-marker",
          color: [226, 119, 40], // orange
          outline: {
            color: [255, 255, 255], // white
            width: 1
          }
        };

        var pointGraphic = new Graphic({
          geometry: point,
          symbol: simpleMarkerSymbol
        });

        var graphicsLayer = new GraphicsLayer();
        graphicsLayer.add(pointGraphic);
        map.add(graphicsLayer);

        var track = new Track({
          view: view,
          goToLocationEnabled: false,
          boat: new Graphic({
            symbol: {
              type: "simple-marker",
              size: "12px",
              color: "green",
              outline: {
                color: "#efefef",
                width: "3.0px"
              }
            }
          }),

          useHeadingEnabled: true // Don't change orientation of the map
        });
        view.ui.add(track, "top-left");

        view.when(function () {
          var prevLocation = view.center;

          track.on("track", function () {
            var location = track.graphic.geometry;

            view
              .goTo({
                center: { lng: lng, lat: lat },
                tilt: 50,
                scale: 2500
              })
              .catch(function (error) {
                if (error.name !== "AbortError") {
                  console.error(error);
                }
              });

            prevLocation = location.clone();
          });

          track.start();
        });
        geolocate.use();

        return () => {
          if (view) {
            // destroy the map view
            view.destroy();
          }
        };
      }
    );
  });

  return <div className="webmap" ref={mapRef} />;
};
