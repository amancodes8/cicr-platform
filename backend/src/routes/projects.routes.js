const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const projectsController = require('../controllers/projects.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');
const { runValidation } = require('../middleware/validate.middleware');

router.post(
  '/',
  authenticate,
  allowRoles('admin', 'head'),
  [body('title').notEmpty()],
  runValidation,
  projectsController.createProject
);

router.get('/', authenticate, projectsController.listProjects);
router.get('/:id', authenticate, projectsController.getProject);
router.put('/:id', authenticate, allowRoles('admin', 'head'), projectsController.updateProject);
router.delete('/:id', authenticate, allowRoles('admin'), projectsController.deleteProject);

router.post('/:id/suggestions', authenticate, projectsController.addSuggestion);

module.exports = router;
