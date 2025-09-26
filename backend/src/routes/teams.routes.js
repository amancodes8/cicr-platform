const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const teamsController = require('../controllers/teams.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');
const { runValidation } = require('../middleware/validate.middleware');

router.post(
  '/',
  authenticate,
  allowRoles('admin', 'head'),
  [body('name').notEmpty()],
  runValidation,
  teamsController.createTeam
);

router.get('/', authenticate, teamsController.listTeams);
router.get('/:id', authenticate, teamsController.getTeam);
router.put('/:id', authenticate, allowRoles('admin', 'head'), teamsController.updateTeam);
router.delete('/:id', authenticate, allowRoles('admin'), teamsController.deleteTeam);

module.exports = router;
