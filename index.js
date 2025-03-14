import express from "express";
import cors from "cors";
import mongoose from "mongoose";
//import MongoStore from 'connect-mongo';
import dotenv from 'dotenv';
//import { authRouter } from './routes/auth.js';
import userRouter from './routes/userRoute.js';

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:8090',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, 
}));


const FRONTEND_URL = process.env.FRONTEND_URL;

dotenv.config();

// CORS middleware
// app.use(cors({
//    origin: ["https://trojan-record-shop.vercel.app"],
//    methods: ["GET", "POST", "PUT", "DELETE"],
//    allowedHeaders: [
//       "Content-Type",
//       "Authorization",
//       "Access-Control-Allow-origin",
//       "Access-Control-Allow-Methods",
//       "Access-Control-Allow-Headers",
//       "Access-Control-Allow-Credentials",
//   ],
//    credentials: true,
//    preflightContinue: false,
//    optionsSuccessStatus: 204,
//    optionsNoContentStatus: 204,
//    exposedHeaders: ["Access-Control-Allow-Origin", "Access-Control-Allow-Credentials"]
// }));

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
//app.use('/api/auth', authRoute);
app.use('/api/user', userRouter);

// Set the server to listen to the port
const PORT = 5050;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});