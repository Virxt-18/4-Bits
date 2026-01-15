import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
  transports: ["websocket", "polling"],
});

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/4bits")
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB error:", err));

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use("/api/admin", adminRoutes);

// Socket.io connection handler
io.on("connection", (socket) => {
  console.log("✅ Authority connected:", socket.id);
  console.log("📊 Total connected clients:", io.engine.clientsCount);
  
  socket.on("disconnect", () => {
    console.log("❌ Authority disconnected:", socket.id);
    console.log("📊 Total connected clients:", io.engine.clientsCount);
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
