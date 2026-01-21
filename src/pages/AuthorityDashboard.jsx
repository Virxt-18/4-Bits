// To become an authority, your user document in Firestore must have { role: "authority" } set by an admin.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { signOut } from "firebase/auth";
import { doc, getDocs, getDoc, setDoc, collection } from "firebase/firestore";
import { Shield, LogOut, AlertTriangle, Flag, User, Mail, Bell, MapPin, TrendingUp, Users, Clock, CheckCircle } from "lucide-react";
import { io } from "socket.io-client";
import SafetyMap from "../components/SafetyMap";

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

  const sosRef = collection(db, "location");

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
        console.log("🔄 Auto-refreshing alerts...");
        fetchData();
      }, 15000);
      
      let newSocket;
      
      try {
        const socketUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
        console.log("Connecting to Socket.io at:", socketUrl);
        console.log("🔌 Initializing Socket.io connection...");
        
        newSocket = io(socketUrl, {
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
          transports: ["websocket", "polling"],
        });

        newSocket.on("connect", () => {
          console.log("✅ Socket.io connected:", newSocket.id);
        });

        newSocket.on("new-sos-alert", (data) => {
          console.log("🚨 NEW SOS ALERT RECEIVED:", data);
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

        newSocket.on("disconnect", () => {
          console.log("❌ Socket disconnected");
        });

        setSocket(newSocket);
      } catch (err) {
        console.error("❌ Socket.io initialization error:", err);
      }

      return () => {
        clearInterval(interval);
        if (newSocket) {
          newSocket.disconnect();
        }
      };
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
    console.log("📡 Fetching alerts and reports...");
    setDataLoading(true);
    try {
      const data = await getDocs(sosRef);
      const filterdData = data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAlerts(filterdData);
      // const adminKey = import.meta.env.VITE_ADMIN_API_KEY;
      // const headers = adminKey ? { "x-admin-key": adminKey } : {};
      
      // console.log("📡 Admin Key:", adminKey ? "✅ Set" : "❌ Missing");
      
      // const [alertsRes, reportsRes] = await Promise.all([
      //   apiClient.get("/api/admin/sos-alerts", { headers }).catch(e => {
      //     console.error("❌ SOS Alerts Error:", e.response?.status, e.response?.data || e.message);
      //     return { data: { alerts: [] } };
      //   }),
      //   apiClient.get("/api/admin/reports", { headers }).catch(e => {
      //     console.error("❌ Reports Error:", e.response?.status, e.response?.data || e.message);
      //     return { data: { reports: [] } };
      //   }),
      // ]);
      
      // console.log("✅ Alerts fetched:", alertsRes.data.alerts?.length || 0);
      // console.log("✅ Reports fetched:", reportsRes.data.reports?.length || 0);
      
      // setAlerts(alertsRes.data.alerts || []);
      // setReports(reportsRes.data.reports || []);
      setError("");
    } catch (e) {
      console.error("❌ Failed to load admin data", e);
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

  const createTestAlert = async () => {
    try {
      const res = await apiClient.post("/api/admin/test-alert");
      console.log("✅ Test alert created:", res.data);
      alert("Test alert created! Check dashboard for notification.");
    } catch (err) {
      console.error("Error creating test alert:", err);
      alert("Error: " + (err.response?.data?.error || err.message));
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
    <div className="min-h-screen bg-linear-to-br from-[rgba(2,16,42,1)] via-[rgba(4,25,60,1)] to-[rgba(2,16,42,1)] text-white py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header with Notifications */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-linear-to-br from-[rgba(18,211,166,0.2)] to-[rgba(18,211,166,0.05)] p-3 rounded-xl">
              <Shield className="w-8 h-8 text-[rgba(18,211,166,1)]" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Authority Dashboard</h1>
              <p className="text-gray-400">Real-time Emergency Management System</p>
            </div>
          </div>
          <div className="flex gap-3">
            {notification && (
              <div className="animate-pulse">
                <Bell className="w-6 h-6 text-red-500" />
              </div>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </div>

        {/* Notification Toast - Enhanced */}
        {notification && (
          <div className="fixed top-4 right-4 bg-linear-to-r from-red-600 to-red-700 border border-red-400 rounded-lg p-6 shadow-2xl max-w-sm animate-pulse z-50">
            <div className="flex items-start gap-4">
              <div className="bg-red-500/30 p-3 rounded-full">
                <Bell className="w-6 h-6 text-red-200" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg">{notification.message}</p>
                <p className="text-red-100 text-sm mt-1">📧 {notification.email}</p>
                {notification.location.lat !== 0 && (
                  <p className="text-red-100 text-xs mt-1">📍 {notification.location.lat.toFixed(4)}, {notification.location.lng.toFixed(4)}</p>
                )}
                <p className="text-red-200 text-xs mt-2">{new Date().toLocaleTimeString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-[rgba(8,12,22,0.95)] border border-red-500/20 rounded-xl p-4 hover:border-red-500/40 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Alerts</p>
                <p className="text-3xl font-bold text-red-400">{alerts?.filter(a => a?.status === 'active')?.length || 0}</p>
              </div>
              <AlertTriangle className="w-10 h-10 text-red-500/50" />
            </div>
          </div>

          <div className="bg-[rgba(8,12,22,0.95)] border border-orange-500/20 rounded-xl p-4 hover:border-orange-500/40 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Reports</p>
                <p className="text-3xl font-bold text-orange-400">{reports?.length || 0}</p>
              </div>
              <Flag className="w-10 h-10 text-orange-500/50" />
            </div>
          </div>

          <div className="bg-[rgba(8,12,22,0.95)] border border-green-500/20 rounded-xl p-4 hover:border-green-500/40 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Resolved</p>
                <p className="text-3xl font-bold text-green-400">{alerts?.filter(a => a?.status === 'resolved')?.length || 0}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500/50" />
            </div>
          </div>

          <div className="bg-[rgba(8,12,22,0.95)] border border-blue-500/20 rounded-xl p-4 hover:border-blue-500/40 transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Unique Users</p>
                <p className="text-3xl font-bold text-blue-400">{new Set(alerts?.map(a => a?.uid) || []).size}</p>
              </div>
              <Users className="w-10 h-10 text-blue-500/50" />
            </div>
          </div>
        </div>

        {/* Main Map Section */}
        <div className="mb-8 bg-[rgba(8,12,22,0.95)] border border-[rgba(18,211,166,0.3)] rounded-2xl p-6 shadow-[0_0_30px_rgba(18,211,166,0.2)]">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
            <MapPin className="w-7 h-7 text-red-500" />
            Safety Zone Map - Real-time Visualization
          </h3>
          <SafetyMap alerts={alerts} reports={reports} />
        </div>

        {/* Alerts and Reports Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Active Alerts Card */}
          <div className="bg-[rgba(8,12,22,0.95)] border border-[rgba(18,211,166,0.3)] rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              Active SOS Alerts ({alerts?.filter(a => a?.status === 'active')?.length || 0})
            </h3>
            <div data-lenis-prevent className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {!alerts || alerts.filter(a => a?.status === 'active').length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">✓ No active alerts</p>
              ) : (
                alerts.filter(a => a?.status === 'active').map((alert) => (
                  <div key={alert._id} className="bg-red-900/20 border border-red-500/30 rounded-lg p-3 hover:bg-red-900/30 transition">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-semibold text-red-300">{alert.email || 'Unknown'}</span>
                      <span className="text-xs bg-red-600/50 px-2 py-1 rounded">ACTIVE</span>
                    </div>
                    {alert.location?.lat && (
                      <p className="text-xs text-gray-300">📍 {alert.location.lat.toFixed(4)}, {alert.location.lng.toFixed(4)}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">{alert.time?.toDate?.().toLocaleString() || "—"}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Reports Card */}
          <div className="bg-[rgba(8,12,22,0.95)] border border-[rgba(18,211,166,0.3)] rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Flag className="w-6 h-6 text-orange-500" />
              Recent Reports ({reports?.length || 0})
            </h3>
            <div data-lenis-prevent className="space-y-2 max-h-96 overflow-y-auto pr-2">
              {!reports || reports.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">No reports yet</p>
              ) : (
                reports.map((report) => (
                  <div key={report._id} className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-3 hover:bg-orange-900/30 transition">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-semibold text-orange-300">{report.title || 'Untitled'}</span>
                      <span className="text-xs bg-orange-600/50 px-2 py-1 rounded">{report.category || 'general'}</span>
                    </div>
                    <p className="text-xs text-gray-300">{report.description || 'No description'}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(report.createdAt).toLocaleTimeString()}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-linear-to-br from-[rgba(18,211,166,0.1)] to-transparent border border-[rgba(18,211,166,0.3)] rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <User className="w-6 h-6 text-[rgba(18,211,166,1)]" />
              Authority Account
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-gray-400 text-sm">Email</p>
                <p className="text-white font-mono">{user.email}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Role</p>
                <p className="text-[rgba(18,211,166,1)] font-semibold">🛡️ {role}</p>
              </div>
              {authorityEmail && (
                <div>
                  <p className="text-gray-400 text-sm">Authority Email</p>
                  <p className="text-white">{authorityEmail}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-linear-to-br from-blue-900/10 to-transparent border border-blue-500/30 rounded-2xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-400" />
              System Status
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-gray-400">Socket Connection</p>
                <span className="text-xs bg-green-600/50 px-3 py-1 rounded-full text-green-200">🟢 Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-400">Database</p>
                <span className="text-xs bg-green-600/50 px-3 py-1 rounded-full text-green-200">🟢 Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-400">Last Update</p>
                <span className="text-xs text-gray-300">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorityDashboard;