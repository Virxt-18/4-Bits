import { useState } from "react";
import SOSButton from "../components/SOSButton";

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-[rgba(2,16,42,1)] text-white py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">User Dashboard</h1>
        
        {/* Emergency SOS Section */}
        <div className="mb-8 p-6 bg-red-900/20 border border-red-400/30 rounded-xl">
          <h2 className="text-xl font-semibold mb-4 text-red-300">Emergency Help</h2>
          <SOSButton />
        </div>

        {/* ...other content... */}
      </div>
    </div>
  );
}