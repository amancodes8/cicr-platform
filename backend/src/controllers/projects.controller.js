const { supabase } = require('../services/supabase.service');

/**
 * createProject
 */
async function createProject(req, res, next) {
  try {
    const { title, description, team_id } = req.body;
    const created_by = req.user && req.user.id;
    const payload = { title, description: description || null, team_id: team_id || null, created_by };
    const { data, error } = await supabase.from('projects').insert(payload).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true, project: data });
  } catch (err) {
    next(err);
  }
}

async function listProjects(req, res, next) {
  try {
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true, projects: data });
  } catch (err) {
    next(err);
  }
}

async function getProject(req, res, next) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).maybeSingle();
    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Project not found' });
    return res.json({ ok: true, project: data });
  } catch (err) {
    next(err);
  }
}

async function updateProject(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase.from('projects').update(updates).eq('id', id).select().maybeSingle();
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true, project: data });
  } catch (err) {
    next(err);
  }
}

async function deleteProject(req, res, next) {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true, deleted: true });
  } catch (err) {
    next(err);
  }
}

async function addSuggestion(req, res, next) {
  try {
    const { id: project_id } = req.params;
    const { message } = req.body;
    const from_user = req.user && req.user.id;
    const payload = { project_id, from_user, message };
    const { data, error } = await supabase.from('suggestions').insert(payload).select().single();
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true, suggestion: data });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject,
  addSuggestion
};
