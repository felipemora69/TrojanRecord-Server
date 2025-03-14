import express from "express";

const router = express.Router();

const jwtSecret = process.env.JWT_SECRET;

// Logout user
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.clearCookie('connect.sid');
    res.json({ message: "Logged out successfully" });
  });
});

export const authRouter = router;