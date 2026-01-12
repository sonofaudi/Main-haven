import express from "express";
import authMiddleware from "../Middleware/authMiddleware.js";
import Meeting from "../models/Meeting.js";

const router = express.Router();

/* generate short meeting code */
function generateCode(length = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

/* HOST MEETING */
router.post("/host", authMiddleware, async (req, res) => {
  try {
    const { title, duration } = req.body;

    if (!title || !duration) {
      return res.status(400).json({ msg: "Missing fields" });
    }

    const code = generateCode();

    const expiresAt = new Date(
      Date.now() + duration * 60 * 1000
    );

    const meeting = await Meeting.create({
      code,
      title,
      duration,
      host: req.user._id,
      expiresAt
    });

    res.json({
      code: meeting.code
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Host failed" });
  }
});

export default router;
