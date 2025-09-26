const { supabase } = require('../services/supabase.service');

/**
 * createTeam
 */
async function createTeam(req, res, next) {
  try {
    const { name, description, head_id } = req.body;
    const created_by = req.user && req.user.id;
    const payload = { name, description: description || null, head_id: head_id || created_by };
    const { data, error } = await supabase.from('teams').insert(payload).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true, team: data });
  } catch (err) {
    next(err);
  }
}

async function listTeams(req, res, next) {
  try {
    const { data, error } = await supabase.from('teams').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true, teams: data });
  } catch (err) {
    next(err);
  }
}

async function getTeam(req, res, next) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('teams').select('*').eq('id', id).maybeSingle();
    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Team not found' });
    return res.json({ ok: true, team: data });
  } catch (err) {
    next(err);
  }
}

async function updateTeam(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase.from('teams').update(updates).eq('id', id).select().maybeSingle();
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true, team: data });
  } catch (err) {
    next(err);
  }
}

async function deleteTeam(req, res, next) {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('teams').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true, deleted: true });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createTeam,
  listTeams,
  getTeam,
  updateTeam,
  deleteTeam
};
