import express from 'express';
import authMiddleware from '../Middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// Update profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { username, tag, profilePic, avatarUrl, character } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (username !== undefined)   user.name = username;
    if (tag !== undefined)        user.tag = tag;
    if (profilePic !== undefined) user.profilePic = profilePic;
    if (avatarUrl !== undefined)  user.avatarUrl = avatarUrl;
    if (character !== undefined)  user.character = character;

    await user.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Profile update failed' });
  }
});

// Get current user profile
router.get('/me', authMiddleware, (req, res) => {
  res.json({
    username: req.user.name,
    tag: req.user.tag,
    profilePic: req.user.profilePic,
    avatarUrl: req.user.avatarUrl,
    character: req.user.character
  });
});


/* UPDATE AVATAR URL */
router.put("/avatar", authMiddleware, async (req, res) => {
  try {
    const { avatarUrl } = req.body;

    if (!avatarUrl) {
      return res.status(400).json({ msg: "avatarUrl is required" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatarUrl },
      { new: true }
    );

    res.json({
      msg: "Avatar updated",
      avatarUrl: user.avatarUrl
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


export default router;