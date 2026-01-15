import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const TouristMovement = ({ alerts }) => {
  const [paths, setPaths] = useState([]);

  useEffect(() => {
    // Group alerts by user to show movement patterns
    const userPaths = {};

    alerts?.forEach((alert) => {
      if (alert.location?.lat && alert.location?.lng) {
        if (!userPaths[alert.uid]) {
          userPaths[alert.uid] = [];
        }
        userPaths[alert.uid].push({
          lat: alert.location.lat,
          lng: alert.location.lng,
          time: new Date(alert.createdAt).toLocaleTimeString(),
          email: alert.email,
        });
      }
    });

    // Sort by time to show movement order
    Object.keys(userPaths).forEach((uid) => {
      userPaths[uid].sort((a, b) => new Date(a.time) - new Date(b.time));
    });

    setPaths(userPaths);
  }, [alerts]);

  const defaultCenter = [28.7041, 77.1025];
  const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6"];

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

        {Object.entries(paths).map(([uid, points], pathIdx) => (
          <div key={uid}>
            {/* Draw path line */}
            {points.length > 1 && (
              <Polyline
                positions={points.map((p) => [p.lat, p.lng])}
                color={colors[pathIdx % colors.length]}
                weight={3}
                opacity={0.7}
              />
            )}

            {/* Draw movement points */}
            {points.map((point, idx) => (
              <CircleMarker
                key={`${uid}-${idx}`}
                center={[point.lat, point.lng]}
                radius={idx === points.length - 1 ? 8 : 5}
                fillColor={colors[pathIdx % colors.length]}
                color={colors[pathIdx % colors.length]}
                weight={2}
                opacity={0.8}
                fillOpacity={0.7}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-bold">📍 Movement Point {idx + 1}</p>
                    <p className="text-gray-700">User: {point.email}</p>
                    <p className="text-gray-600 text-xs">{point.time}</p>
                    {idx === points.length - 1 && (
                      <p className="text-red-600 font-semibold">⚠️ Last Known Location</p>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            ))}
          </div>
        ))}
      </MapContainer>
    </div>
  );
};

export default TouristMovement;