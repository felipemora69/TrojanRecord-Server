import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import { authRoute } from './routes/auth.js';
import userRoute from './routes/userRoute.js';

const app = express();
app.use(express.json());

dotenv.config();

// Test route to verify connection
app.get('/', (req, res) => {
  res.send("Server is up and running!");
});

// Middleware
app.use(cors(
    {
        origin: ["https://trojanrecord-server.onrender.com/"],
        methods: ["POST", "GET", "PUT", "DELETE"],
        credentials: true
    }
));

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