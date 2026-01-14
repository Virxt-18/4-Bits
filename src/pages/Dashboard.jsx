import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { LogOut, User, MapPin, Navigation, CreditCard, Phone as PhoneIcon } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

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
            const snap = await getDoc(doc(db, "users", currentUser.uid));
            if (snap.exists()) {
              setProfile(snap.data());
            } else {
              setProfile(null);
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
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>

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
                <p className="text-white font-mono text-sm break-all">{user?.uid?.substring(0, 20)}...</p>
              </div>
            </div>

            {/* Personal Information */}
            <div className="border-t border-[rgba(18,211,166,0.2)] pt-6 mt-6">
              <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between bg-[rgba(2,16,42,0.8)] rounded p-3">
                  <span className="text-gray-400">Name</span>
                  <span className="text-white">{profileLoading ? "…" : profile?.name || "Not provided"}</span>
                </div>
                <div className="flex items-center justify-between bg-[rgba(2,16,42,0.8)] rounded p-3">
                  <span className="text-gray-400">Email</span>
                  <span className="text-white break-all">{user?.email}</span>
                </div>
                <div className="flex items-center justify-between bg-[rgba(2,16,42,0.8)] rounded p-3">
                  <span className="text-gray-400">Phone</span>
                  <span className="text-white">{profileLoading ? "…" : profile?.phone || "Not provided"}</span>
                </div>
                <div className="flex items-center justify-between bg-[rgba(2,16,42,0.8)] rounded p-3">
                  <span className="text-gray-400">Nationality</span>
                  <span className="text-white">{profileLoading ? "…" : profile?.nationality || "Not provided"}</span>
                </div>
                <div className="flex items-center justify-between bg-[rgba(2,16,42,0.8)] rounded p-3">
                  <span className="text-gray-400">Destination</span>
                  <span className="text-white">{profileLoading ? "…" : profile?.destination || "Not provided"}</span>
                </div>
              </div>
            </div>

            {/* ID Information */}
            <div className="border-t border-[rgba(18,211,166,0.2)] pt-6 mt-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[rgba(18,211,166,1)]" />
                ID Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between bg-[rgba(2,16,42,0.8)] rounded p-3">
                  <span className="text-gray-400">ID Type</span>
                  <span className="text-white">{profileLoading ? "…" : profile?.idType || "Not provided"}</span>
                </div>
                <div className="flex items-center justify-between bg-[rgba(2,16,42,0.8)] rounded p-3">
                  <span className="text-gray-400">ID Number</span>
                  <span className="text-white">{profileLoading ? "…" : profile?.idNumber || "Not provided"}</span>
                </div>
                {profile?.idDocumentUrl && (
                  <a
                    href={profile.idDocumentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-center bg-[rgba(18,211,166,0.2)] hover:bg-[rgba(18,211,166,0.3)] text-[rgba(18,211,166,1)] font-semibold py-2 px-4 rounded-lg transition"
                  >
                    View Uploaded ID Document
                  </a>
                )}
              </div>
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

export default Dashboard;
