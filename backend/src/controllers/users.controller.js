const { supabase } = require('../services/supabase.service');

/**
 * listUsers - admin only
 */
async function listUsers(req, res, next) {
  try {
    const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true, users: data });
  } catch (err) {
    next(err);
  }
}

/**
 * getUser - return user if allowed
 */
async function getUser(req, res, next) {
  try {
    const { id } = req.params;
    const requester = req.user;
    if (requester.role !== 'admin' && requester.id !== id) {
      // members can view only own profile
      return res.status(403).json({ error: 'Forbidden' });
    }
    const { data, error } = await supabase.from('users').select('*').eq('id', id).maybeSingle();
    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'User not found' });
    return res.json({ ok: true, user: data });
  } catch (err) {
    next(err);
  }
}

/**
 * updateUser - self or admin
 */
async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const requester = req.user;

    if (requester.role !== 'admin' && requester.id !== id) return res.status(403).json({ error: 'Forbidden' });

    const updates = req.body;
    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabase.from('users').update(updates).eq('id', id).select().maybeSingle();
    if (error) return res.status(500).json({ error: error.message });

    return res.json({ ok: true, user: data });
  } catch (err) {
    next(err);
  }
}

/**
 * deleteUser - admin
 */
async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('users').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true, deleted: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listUsers,
  getUser,
  updateUser,
  deleteUser
};
