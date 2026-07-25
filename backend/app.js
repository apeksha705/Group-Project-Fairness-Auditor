const express    = require('express');
const cors       = require('cors');
const dotenv     = require('dotenv');
const errorHandler = require('./src/middleware/errorHandler');

dotenv.config();

const app = express();

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(cors({
  origin:         process.env.CORS_ORIGIN || '*',
  methods:        ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use('/api/health',   require('./src/routes/health.routes'));
app.use('/api/projects', require('./src/routes/project.routes'));

// ---------------------------------------------------------------------------
// 404 — no route matched
// ---------------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ---------------------------------------------------------------------------
// Global error handler (must be last, needs all 4 args)
// ---------------------------------------------------------------------------
app.use(errorHandler);

module.exports = app;
