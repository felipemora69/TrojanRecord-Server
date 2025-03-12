import express from 'express';
import jwt from "jsonwebtoken";
import User from '../models/userModel.js';
import protect from '../authMiddleware.js';

const router = express.Router();

// Protected Route to Get User Profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;