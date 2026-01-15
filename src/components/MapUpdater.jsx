import { useEffect } from "react";
import { useMap } from "react-leaflet";

const MapUpdater = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom(), {
        animate: true,
      });
    }
  }, [center, map]);

  return null;
};

export default MapUpdater;