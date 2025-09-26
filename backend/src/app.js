const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const teamsRoutes = require('./routes/teams.routes');
const projectsRoutes = require('./routes/projects.routes');
const meetingsRoutes = require('./routes/meetings.routes');
const chatbotRoutes = require('./routes/chatbot.routes');

const app = express();

// middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/meetings', meetingsRoutes);
app.use('/api/chatbot', chatbotRoutes);

// basic health
app.get('/health', (req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// error handler
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

module.exports = app;
