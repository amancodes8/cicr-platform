const { supabase } = require('../services/supabase.service');
const { sendEmail, sendWhatsApp } = require('../services/notification.service');

/**
 * createMeeting
 */
async function createMeeting(req, res, next) {
  try {
    const {
      title,
      meeting_type,
      start_time,
      end_time,
      venue,
      link,
      agenda,
      participants // array of user ids, optional
    } = req.body;

    const created_by = req.user && req.user.id;
    const payload = { title, meeting_type, start_time, end_time: end_time || null, venue: venue || null, link: link || null, agenda: agenda || null, created_by };

    const { data: meeting, error } = await supabase.from('meetings').insert(payload).select().single();
    if (error) return res.status(500).json({ error: error.message });

    // add participants rows if provided
    if (Array.isArray(participants) && participants.length > 0) {
      const rows = participants.map((uid) => ({ meeting_id: meeting.id, user_id: uid, required: true }));
      await supabase.from('meeting_participants').insert(rows);
    }

    // For each participant we can send notification (email/whatsapp) - minimal attempt
    if (Array.isArray(participants) && participants.length > 0) {
      const { data: users } = await supabase.from('users').select('*').in('id', participants);
      // send simple messages (async)
      users.forEach(async (u) => {
        try {
          if (u.email) await sendEmail({ to: u.email, subject: `Meeting: ${title}`, text: `You are invited to meeting: ${agenda || title}` });
          if (u.phone) await sendWhatsApp({ toNumber: u.phone, body: `Meeting: ${title} at ${start_time}. Agenda: ${agenda || 'N/A'}` });
        } catch (e) {
          // ignore send errors
          // eslint-disable-next-line no-console
          console.warn('notify failed', e.message);
        }
      });
    }

    return res.json({ ok: true, meeting });
  } catch (err) {
    next(err);
  }
}

async function listMeetings(req, res, next) {
  try {
    const { data, error } = await supabase.from('meetings').select('*').order('start_time', { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true, meetings: data });
  } catch (err) {
    next(err);
  }
}

async function getMeeting(req, res, next) {
  try {
    const { id } = req.params;
    const { data, error } = await supabase.from('meetings').select('*').eq('id', id).maybeSingle();
    if (error) return res.status(500).json({ error: error.message });
    if (!data) return res.status(404).json({ error: 'Meeting not found' });
    return res.json({ ok: true, meeting: data });
  } catch (err) {
    next(err);
  }
}

async function updateMeeting(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const { data, error } = await supabase.from('meetings').update(updates).eq('id', id).select().maybeSingle();
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true, meeting: data });
  } catch (err) {
    next(err);
  }
}

async function deleteMeeting(req, res, next) {
  try {
    const { id } = req.params;
    const { error } = await supabase.from('meetings').delete().eq('id', id);
    if (error) return res.status(500).json({ error: error.message });
    return res.json({ ok: true, deleted: true });
  } catch (err) {
    next(err);
  }
}

/**
 * notifyParticipants - manually trigger notifications for a meeting
 */
async function notifyParticipants(req, res, next) {
  try {
    const { id } = req.params;
    const { data: participants } = await supabase.from('meeting_participants').select('user_id').eq('meeting_id', id);
    if (!participants || participants.length === 0) return res.status(400).json({ error: 'No participants to notify' });

    const userIds = participants.map((p) => p.user_id);
    const { data: users, error } = await supabase.from('users').select('*').in('id', userIds);
    if (error) return res.status(500).json({ error: error.message });

    // fetch meeting details
    const { data: meeting } = await supabase.from('meetings').select('*').eq('id', id).maybeSingle();

    users.forEach(async (u) => {
      try {
        if (u.email) await sendEmail({ to: u.email, subject: `Reminder: ${meeting.title}`, text: `Meeting at ${meeting.start_time}. Agenda: ${meeting.agenda}` });
        if (u.phone) await sendWhatsApp({ toNumber: u.phone, body: `Reminder: ${meeting.title} at ${meeting.start_time}. ${meeting.link || meeting.venue || ''}` });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('Notify failed', e.message);
      }
    });

    return res.json({ ok: true, notified: users.length });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createMeeting,
  listMeetings,
  getMeeting,
  updateMeeting,
  deleteMeeting,
  notifyParticipants
};
