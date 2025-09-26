// src/routes/auth.routes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const { supabase } = require('../config/supabase');
const { generateToken } = require('../middleware/auth.middleware');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  // Allow CORS from all origins
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') return res.sendStatus(200);

  const { email, password } = req.body;

  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) return res.status(400).json({ error: 'User not found' });

    const valid = await bcrypt.compare(password, data.password);
    if (!valid) return res.status(400).json({ error: 'Invalid password' });

    const token = generateToken({ id: data.id, role: data.role });

    res.json({ token, user: { id: data.id, name: data.name, role: data.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
