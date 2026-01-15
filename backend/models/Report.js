import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true },
    email: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, default: "general" },
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);
