import mongoose from "mongoose";

const sosAlertSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true },
    email: { type: String, required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    status: { type: String, enum: ["active", "resolved"], default: "active" },
    description: String,
  },
  { timestamps: true }
);

export default mongoose.model("SOSAlert", sosAlertSchema);
