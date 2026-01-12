import mongoose from "mongoose";

const MeetingSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true
    },
    title: {
      type: String,
      required: true
    },
    duration: {
      type: Number, // minutes
      required: true
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Meeting", MeetingSchema);
