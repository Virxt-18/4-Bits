// To become an authority, your user document in Firestore must have { role: "authority" } set by an admin.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Shield, LogOut, AlertTriangle, Flag, User, Mail, Bell } from "lucide-react";
import apiClient from "../utils/api";
import { io } from "socket.io-client";

const AuthorityDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [authorityEmail, setAuthorityEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [alerts, setAlerts] = useState([]);
  const [reports, setReports] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (current) => {
      if (!current) {
        setUser(null);
        setRole(null);
        setAuthorityEmail(null);
        setLoading(false);
        navigate("/authority-login");
        return;
      }

      setUser(current);
      try {
        const snap = await getDoc(doc(db, "users", current.uid));
        console.log("User document data:", snap.data());
        const userData = snap.data() || {};
        const userRole = userData.Role || null;
        const userEmail = userData.email || null;
        console.log("User Role:", userRole);
        setRole(userRole);
        setAuthorityEmail(userEmail);

        if (userRole !== "Authority") {
          setError("Access denied. This account is not marked as authority.");
        } else {
          setError("");
          fetchData();
        }
      } catch (e) {
        setError("Failed to load role. " + e.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [navigate]);

  useEffect(() => {
    if (role === "Authority") {
      fetchData();
      const interval = setInterval(() => {
        fetchData();
      }, 2000);
      
      try {
        const socketUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
        console.log("Connecting to Socket.io at:", socketUrl);
        
        const newSocket = io(socketUrl, {
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
        });

        newSocket.on("connect", () => {
          console.log("✅ Socket.io connected:", newSocket.id);
        });

        newSocket.on("new-sos-alert", (data) => {
          console.log("🚨 New SOS Alert received:", data);
          setNotification(data);
          fetchData();
          setTimeout(() => setNotification(null), 5000);
        });

        newSocket.on("alert-resolved", (data) => {
          console.log("✅ Alert resolved:", data);
          fetchData();
        });

        newSocket.on("connect_error", (error) => {
          console.error("❌ Socket connection error:", error);
        });

        setSocket(newSocket);

        return () => {
          clearInterval(interval);
          newSocket.disconnect();
        };
      } catch (err) {
        console.error("❌ Socket.io error:", err);
        return () => clearInterval(interval);
      }
    }
  }, [role]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/authority-login");
    } catch (e) {
      console.error("Logout error", e);
    }
  };

  const fetchData = async () => {
    setDataLoading(true);
    try {
      const adminKey = import.meta.env.VITE_ADMIN_API_KEY;
      const headers = adminKey ? { "x-admin-key": adminKey } : {};
      
      console.log("Fetching alerts and reports...");
      
      const [alertsRes, reportsRes] = await Promise.all([
        apiClient.get("/api/admin/sos-alerts", { headers }).catch(e => {
          console.error("SOS Alerts Error:", e.response?.data || e.message);
          return { data: { alerts: [] } };
        }),
        apiClient.get("/api/admin/reports", { headers }).catch(e => {
          console.error("Reports Error:", e.response?.data || e.message);
          return { data: { reports: [] } };
        }),
      ]);
      
      console.log("Alerts Response:", alertsRes.data);
      console.log("Reports Response:", reportsRes.data);
      
      setAlerts(alertsRes.data.alerts || []);
      setReports(reportsRes.data.reports || []);
      setError("");
    } catch (e) {
      console.error("Failed to load admin data", e);
      setError("Failed to load data: " + (e.message || "Unknown error"));
    } finally {
      setDataLoading(false);
    }
  };

  const makeAuthority = async () => {
    try {
      await setDoc(doc(db, "users", user.uid), { Role: "Authority" }, { merge: true });
      setRole("Authority");
      alert("Authority role set successfully!");
      window.location.reload();
    } catch (e) {
      console.error("Error setting authority:", e);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[rgba(2,16,42,1)] flex items-center justify-center">
        <p className="text-white text-xl">Loading authority session...</p>
      </div>
    );
  }

  if (!user || role !== "Authority") {
    return (
      <div className="min-h-screen bg-[rgba(2,16,42,1)] flex items-center justify-center px-4">
        <div className="bg-[rgba(8,12,22,0.95)] border border-red-500/40 rounded-2xl p-8 max-w-lg w-full text-center shadow-[0_0_30px_rgba(239,68,68,0.25)]">
          <p className="text-red-400 font-semibold mb-4">Authority access required.</p>
          {error && <p className="text-gray-300 text-sm mb-4">{error}</p>}
          <button
            onClick={makeAuthority}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 rounded-lg mb-3 w-full"
          >
            Set as Authority (Dev)
          </button>
          <button
            onClick={() => navigate("/authority-login")}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-3 rounded-lg w-full"
          >
            Go to Authority Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgba(2,16,42,1)] text-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Notification Toast */}
        {notification && (
          <div className="fixed top-4 right-4 bg-red-600 border border-red-400 rounded-lg p-4 shadow-lg max-w-sm animate-pulse">
            <div className="flex items-start gap-3">
              <Bell className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <p className="font-bold text-lg">{notification.message}</p>
                <p className="text-sm text-red-200">Email: {notification.email}</p>
                {notification.location.lat !== 0 && (
                  <p className="text-xs text-red-100">Location: {notification.location.lat}, {notification.location.lng}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* How to become authority info */}
        <div className="mb-6 bg-blue-900/60 border border-blue-400/30 rounded-xl p-4 text-blue-200 text-sm">
          <strong>How to become an authority?</strong>
          <div>
            Ask an administrator to set your <code>Role</code> to <code>Authority</code> in your user profile in the database.
          </div>
        </div>

        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <Shield className="w-10 h-10 text-[rgba(18,211,166,1)]" />
            <div>
              <h1 className="text-3xl font-bold">Authority Dashboard</h1>
              <p className="text-gray-300 text-sm">Restricted access for verified authorities.</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 px-5 py-3 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[rgba(8,12,22,0.95)] border border-[rgba(18,211,166,0.3)] rounded-2xl p-6 shadow-[0_0_30px_rgba(18,211,166,0.2)]">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <User className="w-5 h-5 text-[rgba(18,211,166,1)]" />
              Account
            </h3>
            <p className="text-gray-300 break-all">{user.email}</p>
            <p className="text-sm text-gray-400 mt-1">Role: {role || "unknown"}</p>
            {authorityEmail && <p className="text-sm text-teal-300 mt-1">Authority Email: {authorityEmail}</p>}
          </div>

          <div className="bg-[rgba(8,12,22,0.95)] border border-[rgba(18,211,166,0.3)] rounded-2xl p-6 shadow-[0_0_30px_rgba(18,211,166,0.2)]">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              SOS Alerts
            </h3>
            {dataLoading ? (
              <p className="text-gray-400 text-sm">Loading alerts...</p>
            ) : alerts.length === 0 ? (
              <p className="text-gray-400 text-sm">No alerts found.</p>
            ) : (
              <ul className="space-y-2 text-sm max-h-48 overflow-y-auto pr-1">
                {alerts.map((a) => (
                  <li key={a._id} className="bg-white/5 border border-white/10 rounded-lg p-2">
                    <div className="flex justify-between text-gray-200">
                      <span>{a.email || a.uid}</span>
                      <span className="text-xs text-gray-400">{new Date(a.createdAt).toLocaleString()}</span>
                    </div>
                    {a.location && a.location.lat && a.location.lng && (
                      <p className="text-xs text-gray-400">{a.location.lat}, {a.location.lng}</p>
                    )}
                    <p className="text-xs text-yellow-300">Status: {a.status || "active"}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-[rgba(8,12,22,0.95)] border border-[rgba(18,211,166,0.3)] rounded-2xl p-6 shadow-[0_0_30px_rgba(18,211,166,0.2)]">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Flag className="w-5 h-5 text-orange-400" />
              Reports
            </h3>
            {dataLoading ? (
              <p className="text-gray-400 text-sm">Loading reports...</p>
            ) : reports.length === 0 ? (
              <p className="text-gray-400 text-sm">No reports found.</p>
            ) : (
              <ul className="space-y-2 text-sm max-h-48 overflow-y-auto pr-1">
                {reports.map((r) => (
                  <li key={r._id} className="bg-white/5 border border-white/10 rounded-lg p-2">
                    <div className="flex justify-between text-gray-200">
                      <span>{r.title}</span>
                      <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-400">By: {r.email || r.uid}</p>
                    <p className="text-xs text-orange-200">Category: {r.category || "general"}</p>
                    <p className="text-xs text-gray-300">{r.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="bg-[rgba(8,12,22,0.95)] border border-[rgba(18,211,166,0.3)] rounded-2xl p-6 shadow-[0_0_30px_rgba(18,211,166,0.2)]">
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <Mail className="w-5 h-5 text-[rgba(18,211,166,1)]" />
            Contact Details
          </h3>
          <p className="text-gray-300">Email: {user.email}</p>
          {user.phoneNumber && <p className="text-gray-300">Phone: {user.phoneNumber}</p>}
        </div>
      </div>
    </div>
  );
};

export default AuthorityDashboard;
