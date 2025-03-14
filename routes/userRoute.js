import express from 'express';
import protect from '../authMiddleware.js';
import { registerUser, loginUser } from '../api/userApi.js';

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// Protected Route to Get User Profile
// router.get('/profile', protect, async (req, res) => {
//   try {
//     const user = await User.findById(req.user).select('-password');
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: 'Server Error' });
//   }
// });

export default userRouter;