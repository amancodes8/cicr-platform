const { supabase } = require('../services/supabase.service');
const { generateToken } = require('../middleware/auth.middleware');
const { generateInviteCode } = require('../utils/helpers');
const { sendEmail, sendWhatsApp } = require('../services/notification.service');

/**
 * createInvitation - admin creates invitation code
 */
async function createInvitation(req, res, next) {
  try {
    const creatorId = req.user && req.user.id ? req.user.id : null;
    const { role = 'member', expires_at } = req.body;
    // create a short code
    const code = generateInviteCode(10);
    const payload = {
      code,
      role,
      created_by: creatorId,
      expires_at: expires_at || null
    };

    const { data, error } = await supabase.from('invitations').insert(payload).select().single();

    if (error) return res.status(500).json({ error: error.message });
    // Optionally send email here if you provide email param
    res.json({ ok: true, invitation: data });
  } catch (err) {
    next(err);
  }
}

/**
 * joinByCode - user joins using code
 */
async function joinByCode(req, res, next) {
  try {
    const { code, name, email, phone, year, branch, batch } = req.body;
    // lookup invitation
    const { data: inv, error: invErr } = await supabase
      .from('invitations')
      .select('*')
      .eq('code', code)
      .maybeSingle();

    if (invErr) return res.status(500).json({ error: invErr.message });
    if (!inv) return res.status(400).json({ error: 'Invalid invitation code' });
    if (inv.used) return res.status(400).json({ error: 'Invitation already used' });
    if (inv.expires_at && new Date(inv.expires_at) < new Date()) return res.status(400).json({ error: 'Invitation expired' });

    // create user row
    const newUser = {
      name,
      email,
      phone,
      year,
      branch,
      batch,
      role: inv.role || 'member',
      invited_by: inv.created_by,
      join_code: code
    };

    const { data: userData, error: userErr } = await supabase.from('users').insert(newUser).select().single();
    if (userErr) {
      // if email duplicate
      return res.status(500).json({ error: userErr.message });
    }

    // mark invitation used
    await supabase.from('invitations').update({ used: true }).eq('id', inv.id);

    // generate JWT token for user (simple payload)
    const token = generateToken({ id: userData.id, email: userData.email, role: userData.role });

    // send welcome notification (try email)
    try {
      await sendEmail({ to: email, subject: 'Welcome to CICR', text: `Hi ${name}, welcome to CICR!` });
    } catch (e) {
      // ignore
      // eslint-disable-next-line no-console
      console.warn('Email sending failed', e.message);
    }

    res.json({ ok: true, user: userData, token });
  } catch (err) {
    next(err);
  }
}

/**
 * login - simple email-based login (no password) for MVP
 * For production, integrate with Supabase auth or use password flows.
 */
async function login(req, res, next) {
  try {
    const { email } = req.body;
    const { data: user } = await supabase.from('users').select('*').eq('email', email).maybeSingle();

    if (!user) return res.status(404).json({ error: 'User not found' });

    const token = generateToken({ id: user.id, email: user.email, role: user.role });

    return res.json({ ok: true, user, token });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createInvitation,
  joinByCode,
  login
};
