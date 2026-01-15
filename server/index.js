import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || "";

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tourist-app';
let db;

async function connectDB() {
  try {
    const client = await MongoClient.connect(MONGODB_URI);
    db = client.db();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// SOS Alert endpoint
app.post('/api/sos-alert', async (req, res) => {
  try {
    const { uid, email, location, status } = req.body;
    
    if (!uid) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const alertData = {
      uid,
      email: email || null,
      location: location || null,
      status: status || 'active',
      createdAt: new Date(),
    };

    const result = await db.collection('sos_alerts').insertOne(alertData);
    
    res.status(201).json({
      success: true,
      alertId: result.insertedId,
      message: 'SOS alert sent successfully',
    });
  } catch (error) {
    console.error('Error saving SOS alert:', error);
    res.status(500).json({ error: 'Failed to send SOS alert' });
  }
});

// Get all alerts for a user
app.get('/api/sos-alerts/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const alerts = await db.collection('sos_alerts')
      .find({ uid })
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json({ success: true, alerts });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Admin: get all alerts (no auth here; protect at gateway/firewall in production)
app.get('/api/admin/sos-alerts', async (_req, res) => {
  if (!ADMIN_API_KEY || _req.headers['x-admin-key'] !== ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const alerts = await db.collection('sos_alerts')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res.json({ success: true, alerts });
  } catch (error) {
    console.error('Error fetching admin alerts:', error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// Report endpoint
app.post('/api/report', async (req, res) => {
  try {
    const { uid, email, title, description, category, location } = req.body;
    
    if (!uid || !title) {
      return res.status(400).json({ error: 'User ID and title are required' });
    }

    const reportData = {
      uid,
      email: email || null,
      title,
      description: description || '',
      category: category || 'general',
      location: location || null,
      status: 'open',
      createdAt: new Date(),
    };

    const result = await db.collection('reports').insertOne(reportData);
    
    res.status(201).json({
      success: true,
      reportId: result.insertedId,
      message: 'Report submitted successfully',
    });
  } catch (error) {
    console.error('Error saving report:', error);
    res.status(500).json({ error: 'Failed to submit report' });
  }
});

// Get all reports for a user
app.get('/api/reports/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const reports = await db.collection('reports')
      .find({ uid })
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json({ success: true, reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Admin: get all reports (no auth here; protect at gateway/firewall in production)
app.get('/api/admin/reports', async (_req, res) => {
  if (!ADMIN_API_KEY || _req.headers['x-admin-key'] !== ADMIN_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const reports = await db.collection('reports')
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    res.json({ success: true, reports });
  } catch (error) {
    console.error('Error fetching admin reports:', error);
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});