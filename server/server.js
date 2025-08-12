// server/server.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import session from 'express-session';
import authRoutes from './auth.js';
import { requireAuth } from './middleware.js';
import User from './models/User.js';
import OpenAI from 'openai';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('MongoDB connection error:', error));

const app = express();
const PORT = process.env.PORT || 5000;
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


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

app.post('/ai-assistance', requireAuth, async (req, res) => {
  try {
    const { currentNumber } = req.body;
    
    const prompt = `You are responding as part of a humorous "AI-powered" counting app. The app's only function is a button that increments the displayed number by 1.
    Your response must follow exactly this statement:

    Provide one short, sincere, and overly buzzword-filled sentence giving professional advice on how to increment the counter from its current value to the next, using impressive-sounding but easily understandable tech jargon despite the app’s extreme simplicity.

    Format:
    AI TIP: [Professional usage advice]

    The format is not to include this sentence or any subsequent sentences. Current number: ${currentNumber}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 200,
    });

    const aiResponse = completion.choices[0].message.content;
    res.json({ aiResponse });
  } catch (err) {
    console.error('AI assistance error:', err);
    res.status(500).json({ error: 'Failed to get AI assistance' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Counter API is running!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
