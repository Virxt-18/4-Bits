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
    console.log("📥 Received SOS Alert request:", { uid, email, location, description });
    console.log("📍 Location coordinates - Lat:", location?.lat, "Lng:", location?.lng);
    console.log("🔍 req.io exists?", !!req.io);
    
    const alert = new SOSAlert({ uid, email, location, description });
    const savedAlert = await alert.save();
    
    console.log("✅ SOS Alert saved to DB:", savedAlert._id);
    console.log("📍 Alert location stored:", savedAlert.location);

    // Emit real-time notification to all connected authorities
    if (req.io) {
      const alertData = {
        _id: savedAlert._id,
        uid: savedAlert.uid,
        email: savedAlert.email,
        location: savedAlert.location,
        status: savedAlert.status,
        createdAt: savedAlert.createdAt,
        message: `🚨 Emergency SOS from ${savedAlert.email}`,
      };
      
      console.log("📢 Broadcasting to", req.io.engine.clientsCount, "connected authorities");
      console.log("📍 Broadcasting location:", alertData.location);
    }
    
    res.status(201).json({ alert: savedAlert, message: "SOS alert created successfully" });
  } catch (error) {
    console.error("❌ Error creating SOS alert:", error);
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

// Create E-FIR
router.post("/efir", verifyAdminKey, async (req, res) => {
  try {
    const { firNumber, date, status, category, reportedBy, userId, location, description, timestamp } = req.body;
    
    // Save E-FIR to database (optional - can be saved to file or email)
    const efir = {
      firNumber,
      date,
      status,
      category,
      reportedBy,
      userId,
      location,
      description,
      timestamp,
      createdAt: new Date(),
    };

    console.log("✅ E-FIR Generated:", firNumber);
    
    res.json({ 
      efir, 
      message: "E-FIR generated successfully" 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;