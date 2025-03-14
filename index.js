import express from "express";
import session from 'express-session';
import cors from "cors";
import mongoose from "mongoose";
import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
import { authRoute } from './routes/auth.js';
import userRoute from './routes/userRoute.js';

const app = express();
app.use(express.json());

dotenv.config();

// CORS middleware
app.use(cors({
   origin: "https://trojan-record-shop.vercel.app", //"http://localhost:8090",
  //  credentials: true,
  //  methods: ["GET", "POST", "PUT", "DELETE"],
  //  allowedHeaders: ["Content-Type", "Authorization"],
  //  credentials: true,
  //  preflightContinue: true,
  //  optionsSuccessStatus: 204,
  //  optionsNoContentStatus: 204,
  //  exposedHeaders: ["X-Custom-Header-1", "X-Custom-Header-2"],
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({
    mongoUrl: process.env.MONGO_URI, // MongoDB URI
    ttl: 14 * 24 * 60 * 60, // Sessions will expire after 14 days
  }),
  cookie: {
    maxAge: 6000000, // 600,000 milliseconds = 1 hour
    secure: false,
    sameSite: "none", // Allow cross-site requests
  }
}));

// Test route to verify connection
app.get('/', (req, res) => {
  res.send("Server is up and running!");
});

// Connect to the database
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected!');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
});

// Routes
app.use('/auth', authRoute);
app.use('/user', userRoute);

// Set the server to listen to the port
const PORT = 5050;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});