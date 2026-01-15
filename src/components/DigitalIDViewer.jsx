import { useState } from "react";
import { MapPin, Mail, User, Phone, Calendar, Shield } from "lucide-react";

const DigitalIDViewer = ({ alerts }) => {
  const [selectedUser, setSelectedUser] = useState(null);

  const uniqueUsers = [
    ...new Map(
      alerts.map((alert) => [
        alert.uid,
        {
          uid: alert.uid,
          email: alert.email,
          alertCount: alerts.filter((a) => a.uid === alert.uid).length,
          lastAlert: alert.createdAt,
          locations: alerts
            .filter((a) => a.uid === alert.uid)
            .map((a) => a.location),
        },
      ])
    ).values(),
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Users List */}
      <div className="bg-[rgba(8,12,22,0.95)] border border-[rgba(18,211,166,0.3)] rounded-2xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-[rgba(18,211,166,1)]" />
          Tourist Database
        </h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {uniqueUsers.map((user) => (
            <button
              key={user.uid}
              onClick={() => setSelectedUser(user)}
              className={`w-full p-3 rounded-lg text-left transition ${
                selectedUser?.uid === user.uid
                  ? "bg-[rgba(18,211,166,0.2)] border border-[rgba(18,211,166,0.5)]"
                  : "bg-white/5 border border-white/10 hover:bg-white/10"
              }`}
            >
              <p className="font-semibold text-white">{user.email}</p>
              <p className="text-xs text-gray-400">
                {user.alertCount} alert{user.alertCount > 1 ? "s" : ""} •{" "}
                {new Date(user.lastAlert).toLocaleString()}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Digital ID Details */}
      {selectedUser && (
        <div className="bg-[rgba(8,12,22,0.95)] border border-[rgba(18,211,166,0.3)] rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-yellow-400" />
            Digital ID
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <User className="w-4 h-4 text-[rgba(18,211,166,1)] mt-1" />
              <div>
                <p className="text-gray-400">UID</p>
                <p className="text-white font-mono text-xs">{selectedUser.uid}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Mail className="w-4 h-4 text-[rgba(18,211,166,1)] mt-1" />
              <div>
                <p className="text-gray-400">Email</p>
                <p className="text-white">{selectedUser.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="w-4 h-4 text-[rgba(18,211,166,1)] mt-1" />
              <div>
                <p className="text-gray-400">Last Alert</p>
                <p className="text-white">
                  {new Date(selectedUser.lastAlert).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[rgba(18,211,166,1)] mt-1" />
              <div>
                <p className="text-gray-400">Alert Count</p>
                <p className="text-white font-bold text-lg">
                  {selectedUser.alertCount}
                </p>
              </div>
            </div>

            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3 mt-4">
              <p className="text-green-300 text-xs">
                ✓ Tourist verified and tracked
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalIDViewer;
