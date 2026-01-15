import { useState } from "react";
import { FileText, Download, AlertTriangle } from "lucide-react";
import apiClient from "../utils/api";

const EFIRGenerator = ({ alerts, selectedAlert }) => {
  const [loading, setLoading] = useState(false);
  const [firData, setFirData] = useState(null);

  const generateEFIR = async () => {
    if (!selectedAlert) {
      alert("Please select an alert");
      return;
    }

    setLoading(true);
    try {
      const efir = {
        firNumber: `FIR-${Date.now()}`,
        date: new Date().toISOString(),
        status: "registered",
        category: "Emergency SOS",
        reportedBy: selectedAlert.email,
        userId: selectedAlert.uid,
        location: {
          lat: selectedAlert.location?.lat || 0,
          lng: selectedAlert.location?.lng || 0,
        },
        description: selectedAlert.description || "Emergency SOS Alert triggered",
        timestamp: selectedAlert.createdAt,
      };

      // Save to backend
      const res = await apiClient.post("/api/admin/efir", efir, {
        headers: { "x-admin-key": import.meta.env.VITE_ADMIN_API_KEY },
      });

      setFirData(res.data.efir);
    } catch (err) {
      console.error("Error generating E-FIR:", err);
      alert("Error generating E-FIR");
    } finally {
      setLoading(false);
    }
  };

  const downloadEFIR = () => {
    if (!firData) return;

    const content = `
================== ELECTRONIC FIR ==================
FIR Number: ${firData.firNumber}
Date: ${new Date(firData.date).toLocaleString()}
Status: ${firData.status}
====================================================

COMPLAINANT DETAILS:
Email: ${firData.reportedBy}
User ID: ${firData.userId}

INCIDENT DETAILS:
Category: ${firData.category}
Description: ${firData.description}
Time: ${new Date(firData.timestamp).toLocaleString()}

LOCATION:
Latitude: ${firData.location.lat}
Longitude: ${firData.location.lng}

====================================================
This is an auto-generated E-FIR from Authority Dashboard
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${firData.firNumber}.txt`;
    link.click();
  };

  return (
    <div className="bg-[rgba(8,12,22,0.95)] border border-[rgba(18,211,166,0.3)] rounded-2xl p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-blue-400" />
        Automated E-FIR Generation
      </h3>

      <div className="space-y-4">
        <button
          onClick={generateEFIR}
          disabled={loading || !selectedAlert}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-semibold px-4 py-3 rounded-lg transition"
        >
          {loading ? "Generating..." : "Generate E-FIR"}
        </button>

        {firData && (
          <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
            <div className="space-y-2 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-300">FIR Number:</span>
                <span className="text-white font-mono">{firData.firNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Status:</span>
                <span className="text-green-300 font-semibold">{firData.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Generated:</span>
                <span className="text-white">
                  {new Date(firData.date).toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={downloadEFIR}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <Download className="w-4 h-4" />
              Download E-FIR
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EFIRGenerator;
