import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { LogOut, User, MapPin, Navigation, CreditCard, Copy, Check, AlertTriangle, Flag } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { db } from "../firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { sendSOSAlert } from "../api/sosAlert";
import { submitReport } from "../api/reportAlert";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Component to update map center
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15);
    }
  }, [center, map]);
  return null;
}

// Reusable labeled row with optional copy button and graceful fallbacks
function FieldRow({ label, value, loading, copyable }) {
  const [copied, setCopied] = useState(false);

  const displayValue = loading ? "…" : (value && String(value).trim().length ? value : "Not provided");

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(value ?? ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  return (
    <div className="flex items-center gap-3 bg-[rgba(2,16,42,0.8)] rounded p-3">
      <span className="text-gray-400 shrink-0 min-w-[110px]">{label}</span>
      <span
        className="text-white/90 break-all grow"
        title={loading ? "" : String(value ?? "")}
      >
        {displayValue}
      </span>
      {copyable && !loading && value && (
        <button
          type="button"
          onClick={onCopy}
          className="ml-auto inline-flex items-center gap-1 text-[rgba(18,211,166,1)] hover:text-[rgba(18,211,166,0.8)] transition"
          title="Copy"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>
      )}
    </div>
  );
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");
  const [tracking, setTracking] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [sosOpen, setSosOpen] = useState(false);
  const [sosSending, setSosSending] = useState(false);
  const [sosError, setSosError] = useState("");
  const [sosSuccess, setSosSuccess] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportSending, setReportSending] = useState(false);
  const [reportError, setReportError] = useState("");
  const [reportSuccess, setReportSuccess] = useState(false);
  const [reportForm, setReportForm] = useState({ title: '', description: '', category: 'general' });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
        // Request location on component mount
        requestLocation();
        // Fetch profile
        (async () => {
          try {
            console.log("Fetching profile for user:", currentUser.uid);
            const snap = await getDoc(doc(db, "users", currentUser.uid));
            if (snap.exists()) {
              const profileData = snap.data();
              console.log("Profile data loaded:", profileData);
              setProfile(profileData);
            } else {
              console.log("No profile document found for user, creating a basic profile stub");
              const stub = {
                email: currentUser.email || "",
                name: currentUser.displayName || "",
                createdAt: serverTimestamp(),
                idDocumentUrl: "",
              };
              try {
                await setDoc(doc(db, "users", currentUser.uid), stub, { merge: true });
                setProfile(stub);
              } catch (writeErr) {
                console.error("Failed to create profile stub:", writeErr);
                setProfile(null);
              }
            }
          } catch (e) {
            console.error("Failed to load profile:", e);
          } finally {
            setProfileLoading(false);
          }
        })();
      } else {
        navigate("/register");
      }
    });

    return unsubscribe;
  }, [navigate]);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation([latitude, longitude]);
        setError("");
      },
      (err) => {
        setError("Unable to retrieve your location. Please enable location services.");
        console.error("Geolocation error:", err);
      }
    );
  };

  const startTracking = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported");
      return;
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation([latitude, longitude]);
        setError("");
      },
      (err) => {
        setError("Error tracking location: " + err.message);
        console.error("Tracking error:", err);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    setWatchId(id);
    setTracking(true);
  };

  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setTracking(false);
    }
  };

  const handleLogout = async () => {
    if (tracking) stopTracking();
    try {
      await signOut(auth);
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const sendSOS = async () => {
    if (!user) {
      console.error("No user found");
      setSosError("User not authenticated");
      return;
    }
    
    console.log("Sending SOS alert to MongoDB...");
    setSosSending(true);
    setSosError("");
    setSosSuccess(false);
    
    try {
      const alertData = {
        uid: user.uid,
        email: user.email || null,
        location: location ? { lat: location[0], lng: location[1] } : null,
        status: "active",
      };
      
      console.log("Alert data:", alertData);
      const result = await sendSOSAlert(alertData);
      
      if (result.success) {
        console.log("SOS alert sent successfully:", result.data);
        setSosSuccess(true);
        setSosOpen(false);
        
        // Clear success message after 5 seconds
        setTimeout(() => setSosSuccess(false), 5000);
      } else {
        throw new Error(result.error || "Failed to send alert");
      }
    } catch (e) {
      console.error("Failed to send SOS:", e);
      setSosError(`Failed to send SOS: ${e.message}`);
      setSosOpen(false);
    } finally {
      setSosSending(false);
    }
  };

  const sendReport = async () => {
    if (!user) {
      setReportError("User not authenticated");
      return;
    }
    
    if (!reportForm.title.trim()) {
      setReportError("Report title is required");
      return;
    }
    
    console.log("Submitting report to MongoDB...");
    setReportSending(true);
    setReportError("");
    setReportSuccess(false);
    
    try {
      const reportData = {
        uid: user.uid,
        email: user.email || null,
        title: reportForm.title,
        description: reportForm.description,
        category: reportForm.category,
        location: location ? { lat: location[0], lng: location[1] } : null,
      };
      
      console.log("Report data:", reportData);
      const result = await submitReport(reportData);
      
      if (result.success) {
        console.log("Report submitted successfully:", result.data);
        setReportSuccess(true);
        setReportOpen(false);
        setReportForm({ title: '', description: '', category: 'general' });
        
        // Clear success message after 5 seconds
        setTimeout(() => setReportSuccess(false), 5000);
      } else {
        throw new Error(result.error || "Failed to submit report");
      }
    } catch (e) {
      console.error("Failed to submit report:", e);
      setReportError(`Failed to submit report: ${e.message}`);
    } finally {
      setReportSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[rgba(2,16,42,1)] flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgba(2,16,42,1)] text-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-3 z-9999">
            <button
              type="button"
              onClick={() => { setReportOpen(true); setReportError(""); setReportSuccess(false); }}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-lg transition font-semibold"
              title="Submit Report"
            >
              <Flag className="w-5 h-5" /> Report
            </button>
            <button
              type="button"
              onClick={() => { setSosOpen(true); setSosError(""); setSosSuccess(false); }}
              className="flex items-center gap-2 bg-red-700 hover:bg-red-800 px-6 py-3 rounded-lg transition shadow-[0_0_20px_rgba(239,68,68,0.4)] font-semibold"
              title="Send SOS Alert"
            >
              <AlertTriangle className="w-5 h-5" /> SOS Alert
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-800 px-6 py-3 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>
        </div>

        {sosSuccess && (
          <div className="bg-green-500/15 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-6">
            SOS alert sent successfully.
          </div>
        )}
        {sosError && (
          <div className="bg-red-500/15 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
            {sosError}
          </div>
        )}
        {reportSuccess && (
          <div className="bg-green-500/15 border border-green-500 text-green-400 px-4 py-3 rounded-lg mb-6">
            Report submitted successfully.
          </div>
        )}
        {reportError && (
          <div className="bg-red-500/15 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
            {reportError}
          </div>
        )}

        <SosModal
          open={sosOpen}
          onClose={() => setSosOpen(false)}
          onConfirm={sendSOS}
          sending={sosSending}
          hasLocation={!!location}
        />

        <ReportModal
          open={reportOpen}
          onClose={() => setReportOpen(false)}
          onConfirm={sendReport}
          sending={reportSending}
          formData={reportForm}
          setFormData={setReportForm}
        />

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="lg:col-span-1 bg-[rgba(8,12,22,0.95)] border border-[rgba(18,211,166,0.3)] rounded-2xl p-8 shadow-[0_0_30px_rgba(18,211,166,0.2)]">
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-[rgba(18,211,166,0.2)] p-4 rounded-full">
                <User className="w-12 h-12 text-[rgba(18,211,166,1)]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Welcome!</h2>
                <p className="text-gray-400 text-sm mt-2">{user?.email}</p>
              </div>
            </div>

            <div className="border-t border-[rgba(18,211,166,0.2)] pt-6">
              <h3 className="text-lg font-semibold mb-4">Digital Tourist ID</h3>
              <div className="bg-[rgba(18,211,166,0.1)] border border-[rgba(18,211,166,0.3)] rounded-lg p-4">
                <p className="text-gray-400 text-xs mb-2">User ID</p>
                <div className="flex items-center gap-2">
                  <p className="text-white font-mono text-sm break-all" title={user?.uid}>{user?.uid}</p>
                  {user?.uid && (
                    <button
                      type="button"
                      onClick={async () => { try { await navigator.clipboard.writeText(user.uid); } catch {} }}
                      className="inline-flex items-center gap-1 text-[rgba(18,211,166,1)] hover:text-[rgba(18,211,166,0.8)] transition"
                      title="Copy User ID"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="border-t border-[rgba(18,211,166,0.2)] pt-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              {profileLoading ? (
                <div className="text-gray-400 text-sm">Loading profile...</div>
              ) : (
                <div className="space-y-3 text-sm">
                  {!profile && (
                    <div className="bg-yellow-500/15 border border-yellow-500 text-yellow-400 px-4 py-3 rounded-lg text-sm">
                      <p className="font-semibold mb-1">Profile Not Found in Firestore</p>
                      <p className="text-xs text-yellow-200">Showing account fallbacks. Please re-register to save full details.</p>
                    </div>
                  )}
                  <FieldRow label="Name" value={profile?.name || user?.displayName} loading={profileLoading} copyable />
                  <FieldRow label="Email" value={user?.email} loading={false} copyable />
                  <FieldRow label="Phone" value={profile?.phone || user?.phoneNumber} loading={profileLoading} copyable />
                  <FieldRow label="Nationality" value={profile?.nationality} loading={profileLoading} />
                  <FieldRow label="Destination" value={profile?.destination} loading={profileLoading} />
                </div>
              )}
            </div>

            {/* ID Information */}
            <div className="border-t border-[rgba(18,211,166,0.2)] pt-6 mt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[rgba(18,211,166,1)]" />
                ID Information
              </h3>
              {profileLoading ? (
                <div className="text-gray-400 text-sm">Loading ID info...</div>
              ) : !profile ? (
                <div className="text-gray-400 text-sm">No profile data available</div>
              ) : (
                <div className="space-y-3 text-sm">
                  <FieldRow label="ID Type" value={profile?.idType} loading={profileLoading} />
                  <FieldRow label="ID Number" value={profile?.idNumber} loading={profileLoading} copyable />
                  {profile?.idDocumentUrl ? (
                    <a
                      href={profile.idDocumentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-center bg-[rgba(18,211,166,0.2)] hover:bg-[rgba(18,211,166,0.3)] text-[rgba(18,211,166,1)] font-semibold py-2 px-4 rounded-lg transition"
                    >
                      View Uploaded ID Document
                    </a>
                  ) : (
                    <div className="text-xs text-gray-400">No ID document uploaded</div>
                  )}
                </div>
              )}
            </div>

            {/* GPS Tracking Controls */}
            <div className="border-t border-[rgba(18,211,166,0.2)] pt-6 mt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Navigation className="w-5 h-5 text-[rgba(18,211,166,1)]" />
                GPS Tracking
              </h3>
              <div className="space-y-3">
                <button
                  onClick={requestLocation}
                  className="w-full bg-[rgba(18,211,166,0.2)] hover:bg-[rgba(18,211,166,0.3)] text-[rgba(18,211,166,1)] font-semibold py-2 px-4 rounded-lg transition"
                >
                  Get Current Location
                </button>
                <button
                  onClick={tracking ? stopTracking : startTracking}
                  className={`w-full font-semibold py-2 px-4 rounded-lg transition ${
                    tracking
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {tracking ? "Stop Tracking" : "Start Tracking"}
                </button>
              </div>

              {location && (
                <div className="mt-4 bg-[rgba(18,211,166,0.1)] border border-[rgba(18,211,166,0.3)] rounded-lg p-3 text-sm">
                  <p className="text-gray-400 mb-2">Current Location:</p>
                  <p className="text-white font-mono">
                    {location[0].toFixed(6)}, {location[1].toFixed(6)}
                  </p>
                  {tracking && (
                    <p className="text-green-400 text-xs mt-2 animate-pulse">● Live Tracking</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Map Card */}
          <div className="lg:col-span-2 bg-[rgba(8,12,22,0.95)] border border-[rgba(18,211,166,0.3)] rounded-2xl p-6 shadow-[0_0_30px_rgba(18,211,166,0.2)]">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[rgba(18,211,166,1)]" />
              Live Map
            </h3>
            {location ? (
              <div className="h-96 rounded-lg overflow-hidden border border-[rgba(18,211,166,0.2)]">
                <MapContainer
                  center={location}
                  zoom={15}
                  scrollWheelZoom={false}
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={location}>
                    <Popup>
                      <div className="text-sm">
                        <p className="font-semibold">Your Location</p>
                        <p className="text-xs text-gray-600">
                          {location[0].toFixed(6)}, {location[1].toFixed(6)}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                  <MapUpdater center={location} />
                </MapContainer>
              </div>
            ) : (
              <div className="h-96 rounded-lg bg-[rgba(2,16,42,0.8)] border border-[rgba(18,211,166,0.2)] flex items-center justify-center">
                <p className="text-gray-400">Enable location to view map</p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 bg-[rgba(8,12,22,0.95)] border border-[rgba(18,211,166,0.3)] rounded-2xl p-8 shadow-[0_0_30px_rgba(18,211,166,0.2)]">
          <h3 className="text-xl font-semibold mb-4">About Your Digital Tourist ID</h3>
          <p className="text-gray-300 mb-4">
            Your Digital Tourist ID provides secure access to tourism features and location tracking. Use the GPS tracking feature to share your location with authorities if needed.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[rgba(18,211,166,0.1)] border border-[rgba(18,211,166,0.3)] rounded-lg p-4">
              <h4 className="font-semibold text-[rgba(18,211,166,1)] mb-2">Status</h4>
              <p className="text-gray-300">Active & Verified</p>
            </div>
            <div className="bg-[rgba(18,211,166,0.1)] border border-[rgba(18,211,166,0.3)] rounded-lg p-4">
              <h4 className="font-semibold text-[rgba(18,211,166,1)] mb-2">Registered Email</h4>
              <p className="text-gray-300 break-all">{user?.email}</p>
            </div>
            <div className="bg-[rgba(18,211,166,0.1)] border border-[rgba(18,211,166,0.3)] rounded-lg p-4">
              <h4 className="font-semibold text-[rgba(18,211,166,1)] mb-2">Last Updated</h4>
              <p className="text-gray-300">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Lightweight modal component for SOS confirmation
const SosModal = ({ open, onClose, onConfirm, sending, hasLocation }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-9999 w-[90%] max-w-md bg-[rgba(8,12,22,0.98)] border border-red-500/40 rounded-xl p-6 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
        <div className="flex items-center gap-2 text-red-400 mb-3">
          <AlertTriangle className="w-5 h-5" />
          <h4 className="text-lg font-semibold">Confirm SOS Alert</h4>
        </div>
        <p className="text-gray-300 mb-4">
          This will send an emergency alert with your account details{hasLocation ? " and current location" : ""}. Only use this if you are in danger.
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={sending}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-800 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={sending}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-60 font-semibold"
          >
            {sending ? "Sending..." : "Send SOS"}
          </button>
        </div>
      </div>
    </div>
  );
};

// Report submission modal component
const ReportModal = ({ open, onClose, onConfirm, sending, formData, setFormData }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-9999 w-[90%] max-w-md bg-[rgba(8,12,22,0.98)] border border-orange-500/40 rounded-xl p-6 shadow-[0_0_30px_rgba(234,88,12,0.3)] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-2 text-orange-400 mb-4">
          <Flag className="w-5 h-5" />
          <h4 className="text-lg font-semibold">Submit Report</h4>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Report Title *</label>
            <input
              type="text"
              placeholder="Brief title of your report"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              disabled={sending}
              className="w-full bg-[rgba(2,16,42,0.8)] border border-[rgba(18,211,166,0.3)] rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[rgba(18,211,166,0.6)]"
            />
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              disabled={sending}
              className="w-full bg-[rgba(2,16,42,0.8)] border border-[rgba(18,211,166,0.3)] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[rgba(18,211,166,0.6)]"
            >
              <option value="general">General</option>
              <option value="safety">Safety Issue</option>
              <option value="harassment">Harassment</option>
              <option value="scam">Scam/Fraud</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-gray-300 text-sm mb-2">Description</label>
            <textarea
              placeholder="Describe your report in detail..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={sending}
              rows={4}
              className="w-full bg-[rgba(2,16,42,0.8)] border border-[rgba(18,211,166,0.3)] rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[rgba(18,211,166,0.6)] resize-none"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={sending}
            className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-800 disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={sending || !formData.title.trim()}
            className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 disabled:opacity-60 font-semibold"
          >
            {sending ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;