import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import apiClient from "../utils/api";
import { auth } from "../firebase";

const SOSButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSOS = async () => {
    if (!auth.currentUser) {
      setError("Please login first");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            await sendAlert(latitude, longitude);
          },
          () => {
            sendAlert(0, 0);
          }
        );
      } else {
        await sendAlert(0, 0);
      }
    } catch (e) {
      console.error("SOS Error:", e);
      setError(e.response?.data?.error || "Failed to send SOS alert");
      setLoading(false);
    }
  };

  const sendAlert = async (lat, lng) => {
    try {
      const sosData = {
        uid: auth.currentUser.uid,
        email: auth.currentUser.email,
        location: { lat, lng },
        description: "Emergency SOS Alert",
      };

      console.log("📤 Sending SOS Alert with data:", sosData);
      const response = await apiClient.post("/api/admin/sos-alerts", sosData);
      console.log("✅ SOS Alert sent successfully! Response:", response.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      console.error("❌ Failed to send SOS:", e);
      setError(e.response?.data?.error || "Failed to send SOS alert");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleSOS}
        disabled={loading}
        className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition duration-200 hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] active:scale-95"
      >
        <AlertTriangle className="w-5 h-5" />
        {loading ? "Sending SOS..." : "🚨 Emergency SOS"}
      </button>
      
      {error && (
        <p className="text-red-400 text-sm text-center">{error}</p>
      )}
      
      {success && (
        <p className="text-green-400 text-sm text-center">✓ SOS Alert sent to authorities!</p>
      )}
    </div>
  );
};

export default SOSButton;
