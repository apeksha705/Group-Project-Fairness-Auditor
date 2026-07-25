const express = require('express');
const router = express.Router();
const {
  createProjectHandler,
  getAllProjectsHandler,
  getProjectByIdHandler,
} = require('../controllers/project.controller');
const memberRouter       = require('./member.routes');
const contributionRouter = require('./contribution.routes');
const reportRouter       = require('./report.routes');

// POST /api/projects
router.post('/', createProjectHandler);

// GET /api/projects
router.get('/', getAllProjectsHandler);

// GET /api/projects/:id
router.get('/:id', getProjectByIdHandler);

// Nested: /api/projects/:projectId/members
router.use('/:projectId/members', memberRouter);

// Nested: /api/projects/:projectId/contributions
router.use('/:projectId/contributions', contributionRouter);

// Nested: /api/projects/:projectId/report
router.use('/:projectId/report', reportRouter);

module.exports = router;
