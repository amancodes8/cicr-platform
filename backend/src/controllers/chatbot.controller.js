const { summarizeText } = require('../services/chatbot.service');
const { supabase } = require('../services/supabase.service');

/**
 * summarize - accepts { type, id, content, length } and returns summary
 */
async function summarize(req, res, next) {
  try {
    const { type, id, content, length = 'short' } = req.body;

    let textToSummarize = content || '';

    if (!textToSummarize && type === 'project' && id) {
      const { data: project } = await supabase.from('projects').select('*').eq('id', id).maybeSingle();
      if (!project) return res.status(404).json({ error: 'Project not found' });
      textToSummarize = `${project.title}\n${project.description || ''}`;
    }

    if (!textToSummarize && type === 'meeting' && id) {
      const { data: meeting } = await supabase.from('meetings').select('*').eq('id', id).maybeSingle();
      if (!meeting) return res.status(404).json({ error: 'Meeting not found' });
      textToSummarize = `${meeting.title}\n${meeting.agenda || ''}`;
    }

    if (!textToSummarize) {
      return res.status(400).json({ error: 'No content to summarize' });
    }

    // call Gemini wrapper
    const result = await summarizeText(textToSummarize, { length });

    // adapt return depending on Gemini response
    return res.json({ ok: true, result });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  summarize
};
