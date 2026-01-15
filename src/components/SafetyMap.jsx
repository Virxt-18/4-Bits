import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const SafetyMap = ({ alerts, reports }) => {
  const [mapData, setMapData] = useState([]);

  useEffect(() => {
    const combinedData = [];

    // Add SOS alerts as large red bubbles
    alerts?.forEach((alert) => {
      if (alert.location?.lat && alert.location?.lng) {
        combinedData.push({
          type: "alert",
          lat: alert.location.lat,
          lng: alert.location.lng,
          color: "#dc2626", // Dark red for SOS
          fillColor: "#ef4444", // Bright red fill
          radius: 12,
          weight: 3,
          fillOpacity: 0.7,
          label: `🚨 SOS ALERT`,
          email: alert.email,
          uid: alert.uid,
          time: new Date(alert.createdAt).toLocaleString(),
          status: alert.status,
        });
      }
    });


    // Add reports as orange/red zones (smaller)
    reports?.forEach((report) => {
      if (report.location?.lat && report.location?.lng) {
        const isDanger = report.category === "landslide";
        combinedData.push({
          type: "report",
          lat: report.location.lat,
          lng: report.location.lng,
          color: isDanger ? "#991b1b" : "#b45309",
          fillColor: isDanger ? "#dc2626" : "#f97316",
          radius: 8,
          weight: 2,
          fillOpacity: 0.6,
          label: isDanger ? `⚠️ LANDSLIDE` : `📍 ${report.category}`,
          title: report.title,
          time: new Date(report.createdAt).toLocaleString(),
        });
      }
    });

    setMapData(combinedData);
  }, [alerts, reports]);

  // Get center - prioritize latest alert, otherwise use default
  const getMapCenter = () => {
    if (alerts && alerts.length > 0) {
      const latestAlert = alerts[0];
      if (latestAlert.location?.lat && latestAlert.location?.lng) {
        return [latestAlert.location.lat, latestAlert.location.lng];
      }
    }
    return [28.7041, 77.1025]; // Delhi default
  };

  const mapCenter = getMapCenter();

  return (
    <div className="w-full rounded-2xl overflow-hidden border border-[rgba(18,211,166,0.3)]">
      <div style={{ height: "500px", width: "100%" }}>
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          key={JSON.stringify(mapCenter)}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />

          {mapData.map((data, idx) => (
            <CircleMarker
              key={idx}
              center={[data.lat, data.lng]}
              radius={data.radius}
              fillColor={data.fillColor}
              color={data.color}
              weight={data.weight}
              opacity={1}
              fillOpacity={data.fillOpacity}
            >
              <Popup>
                <div className="text-sm w-48">
                  <p className="font-bold text-red-600 mb-2">{data.label}</p>
                  {data.type === "alert" ? (
                    <div className="space-y-1 text-xs">
                      <p className="font-semibold">
                        <span className="text-gray-700">Email:</span>
                        <span className="text-gray-900"> {data.email}</span>
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">UID:</span> {data.uid}
                      </p>
                      <p className="text-gray-700">
                        <span className="font-semibold">Status:</span>
                        <span
                          className={`ml-2 px-2 py-1 rounded ${
                            data.status === "active"
                              ? "bg-red-100 text-red-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {data.status}
                        </span>
                      </p>
                      <p className="text-gray-600 mt-2">{data.time}</p>
                    </div>
                  ) : (
                    <div className="space-y-1 text-xs">
                      <p className="text-gray-700">
                        <span className="font-semibold">Report:</span> {data.title}
                      </p>
                      <p className="text-gray-600 mt-2">{data.time}</p>
                    </div>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="bg-[rgba(8,12,22,0.95)] p-4 border-t border-[rgba(18,211,166,0.3)]">
        <p className="text-xs text-gray-400 mb-2">Legend:</p>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-500 border border-red-700"></div>
            <span className="text-gray-300">SOS Alert (Active)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-700 border border-red-900"></div>
            <span className="text-gray-300">Landslide Report</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500 border border-orange-700"></div>
            <span className="text-gray-300">Other Report</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SafetyMap;