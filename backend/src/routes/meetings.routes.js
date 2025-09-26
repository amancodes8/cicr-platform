const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const meetingsController = require('../controllers/meetings.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');
const { runValidation } = require('../middleware/validate.middleware');

router.post(
  '/',
  authenticate,
  allowRoles('admin', 'head'),
  [
    body('title').notEmpty(),
    body('meeting_type').isIn(['online', 'offline']),
    body('start_time').isISO8601()
  ],
  runValidation,
  meetingsController.createMeeting
);

router.get('/', authenticate, meetingsController.listMeetings);
router.get('/:id', authenticate, meetingsController.getMeeting);
router.put('/:id', authenticate, allowRoles('admin', 'head'), meetingsController.updateMeeting);
router.delete('/:id', authenticate, allowRoles('admin'), meetingsController.deleteMeeting);

router.post('/:id/notify', authenticate, allowRoles('admin', 'head'), meetingsController.notifyParticipants);

module.exports = router;
