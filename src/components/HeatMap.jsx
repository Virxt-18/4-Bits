import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const HeatMap = ({ alerts, reports }) => {
  const [heatData, setHeatData] = useState([]);

  useEffect(() => {
    const points = [];

    // Add SOS alerts with intensity
    alerts?.forEach((alert) => {
      if (alert.location?.lat && alert.location?.lng) {
        points.push({
          lat: alert.location.lat,
          lng: alert.location.lng,
          intensity: 0.8, // High intensity for SOS
          type: "alert",
          email: alert.email,
        });
      }
    });

    // Add reports with lower intensity
    reports?.forEach((report) => {
      if (report.location?.lat && report.location?.lng) {
        points.push({
          lat: report.location.lat,
          lng: report.location.lng,
          intensity: report.category === "landslide" ? 0.9 : 0.6,
          type: "report",
          title: report.title,
        });
      }
    });

    setHeatData(points);
  }, [alerts, reports]);

  const defaultCenter = [28.7041, 77.1025];

  return (
    <div className="w-full h-96 rounded-2xl overflow-hidden border border-[rgba(18,211,166,0.3)]">
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {heatData.map((point, idx) => (
          <CircleMarker
            key={idx}
            center={[point.lat, point.lng]}
            radius={8 * point.intensity}
            fillColor={point.type === "alert" ? "#ef4444" : "#f97316"}
            color={point.type === "alert" ? "#dc2626" : "#ea580c"}
            weight={2}
            opacity={point.intensity}
            fillOpacity={point.intensity * 0.6}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default HeatMap;