import { AlertTriangle, MapPin, Mail, Clock } from "lucide-react";

const AlertLogs = ({ alerts }) => {
  return (
    <div className="bg-[rgba(8,12,22,0.95)] border border-[rgba(18,211,166,0.3)] rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-yellow-400" />
        Complete Alert Logs
      </h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <p className="text-gray-400 text-sm">No alerts recorded</p>
        ) : (
          alerts.map((alert, idx) => (
            <div
              key={alert._id}
              className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-white font-semibold text-sm">
                  #{alerts.length - idx}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    alert.status === "active"
                      ? "bg-red-900/30 text-red-300"
                      : "bg-green-900/30 text-green-300"
                  }`}
                >
                  {alert.status}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex items-center gap-2 text-gray-300">
                  <Mail className="w-3 h-3" />
                  {alert.email}
                </div>
                {alert.location?.lat && alert.location?.lng && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="w-3 h-3" />
                    {alert.location.lat.toFixed(4)}, {alert.location.lng.toFixed(4)}
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock className="w-3 h-3" />
                  {new Date(alert.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AlertLogs;
