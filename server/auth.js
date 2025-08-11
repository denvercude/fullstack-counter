// server/auth.js
import express from 'express';
import bcrypt from 'bcrypt';
import User from './models/User.js';

const router = express.Router();


router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ error: 'Username already exists' });
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashed, count: 1 });
    res.status(201).json({ message: 'User created', username: user.username });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid username or password' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid username or password' });

    // Regenerate to ensure a fresh session & cookie
    req.session.regenerate(async (err) => {
      if (err) {
        console.error('Session regenerate error:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }
      req.session.userId = user._id;
      req.session.username = user.username;

      // Make sure it's saved before sending the response
      req.session.save((err2) => {
        if (err2) {
          console.error('Session save error:', err2);
          return res.status(500).json({ error: 'Internal server error' });
        }
        res.json({ message: 'Login successful', username: user.username, count: user.count });
      });
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/logout', (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ error: 'Error during logout' });
      }
      res.clearCookie('connect.sid');
      res.json({ message: 'Logout successful' });
    });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Quick way to check if the browser is sending the session cookie
router.get('/me', (req, res) => {
  if (req.session?.userId) {
    return res.json({ authenticated: true, username: req.session.username });
  }
  return res.status(401).json({ authenticated: false });
});

export default router;
