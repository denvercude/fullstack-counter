// server/server.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import authRoutes from './auth.js';
import { requireAuth } from './middleware.js';
import User from './models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('MongoDB connection error:', error));

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));


app.use('/auth', authRoutes);


app.get('/count', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ count: user.count });
  } catch (err) {
    console.error('Get count error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/increment', requireAuth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.session.userId,
      { $inc: { count: 1 } },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ count: user.count });
  } catch (err) {
    console.error('Increment error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Counter API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
