# Authority Dashboard - Complete Setup Guide

## System Overview
Real-time SOS alert notification system with role-based access control using Socket.io, MongoDB, and Firebase.

## Features
- ✅ Authority role-based login with Firestore verification
- ✅ Real-time SOS alert notifications via Socket.io
- ✅ MongoDB backend for persistent alert storage
- ✅ Auto-refresh alerts every 2 seconds
- ✅ Notification toast with user location data
- ✅ Account dashboard with role display
- ✅ Reports management system

## Architecture

### Frontend (React + Vite)
- `/src/pages/AuthorityDashboard.jsx` - Main dashboard with real-time notifications
- `/src/pages/AuthorityLogin.jsx` - Role-based login
- `/src/components/SOSButton.jsx` - User SOS trigger button
- `/src/utils/api.js` - Axios API client

### Backend (Node.js + Express)
- `/backend/server.js` - Socket.io server with HTTP
- `/backend/routes/admin.js` - Admin API endpoints
- `/backend/models/SOSAlert.js` - MongoDB SOS alert schema
- `/backend/models/Report.js` - MongoDB report schema

### Database
- MongoDB Atlas with collections:
  - `sosalerts` - Real-time emergency alerts
  - `reports` - User-submitted reports

## Installation

### 1. Frontend Dependencies
```bash
npm install
npm install socket.io-client@latest
```

### 2. Backend Dependencies
```bash
cd backend
npm install
npm install express mongoose cors dotenv socket.io
cd ..
```

## Configuration

### Frontend .env
