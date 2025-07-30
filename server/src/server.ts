// server/src/server.ts
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import the auth routes
import authRoutes from './routes/auth';
import noteRoutes from './routes/notes'; // <-- 1. ADD THIS LINE

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Middlewares ---
app.use(cors());
app.use(express.json());

// --- Database Connection ---
const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('FATAL ERROR: MONGO_URI is not defined.');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => console.log('✅ Successfully connected to MongoDB!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// --- Basic Test Route ---
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Notes App API!' });
});

// --- API Routes ---
// Use the auth routes for any request to /api/auth
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes); // <-- 2. AND ADD THIS LINE

// --- Start the Server ---
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});