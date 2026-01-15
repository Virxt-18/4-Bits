import express from "express";
import SOSAlert from "../models/SOSAlert.js";
import Report from "../models/Report.js";

const router = express.Router();

// Middleware to verify admin key
const verifyAdminKey = (req, res, next) => {
  const adminKey = req.headers["x-admin-key"];
  if (adminKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
};

// Get all SOS alerts
router.get("/sos-alerts", verifyAdminKey, async (req, res) => {
  try {
    const alerts = await SOSAlert.find().sort({ createdAt: -1 }).limit(50);
    res.json({ alerts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all reports
router.get("/reports", verifyAdminKey, async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 }).limit(50);
    res.json({ reports });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create SOS alert
router.post("/sos-alerts", async (req, res) => {
  try {
    const { uid, email, location, description } = req.body;
    const alert = new SOSAlert({ uid, email, location, description });
    await alert.save();
    
    console.log("✅ SOS Alert created:", alert._id);
    
    // Emit real-time notification to all connected authorities
    if (req.io) {
      req.io.emit("new-sos-alert", {
        _id: alert._id,
        uid: alert.uid,
        email: alert.email,
        location: alert.location,
        status: alert.status,
        createdAt: alert.createdAt,
        message: `🚨 Emergency SOS from ${alert.email}`,
      });
      console.log("📢 Emitted new-sos-alert event");
    }
    
    res.status(201).json({ alert, message: "SOS alert created" });
  } catch (error) {
    console.error("Error creating SOS alert:", error);
    res.status(500).json({ error: error.message });
  }
});

// Resolve alert
router.patch("/sos-alerts/:id", verifyAdminKey, async (req, res) => {
  try {
    const alert = await SOSAlert.findByIdAndUpdate(
      req.params.id,
      { status: "resolved" },
      { new: true }
    );
    req.io.emit("alert-resolved", { alertId: alert._id });
    res.json({ alert, message: "Alert resolved" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
