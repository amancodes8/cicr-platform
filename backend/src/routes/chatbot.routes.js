const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const chatbotController = require('../controllers/chatbot.controller');
const { authenticate } = require('../middleware/auth.middleware');
const { runValidation } = require('../middleware/validate.middleware');

router.post(
  '/summarize',
  authenticate,
  [body('type').isIn(['project', 'meeting', 'page']).optional(), body('content').optional().isString()],
  runValidation,
  chatbotController.summarize
);

module.exports = router;
