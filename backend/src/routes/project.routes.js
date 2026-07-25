const express = require('express');
const router = express.Router();
const {
  createProjectHandler,
  getAllProjectsHandler,
  getProjectByIdHandler,
} = require('../controllers/project.controller');
const memberRouter = require('./member.routes');

// POST /api/projects
router.post('/', createProjectHandler);

// GET /api/projects
router.get('/', getAllProjectsHandler);

// GET /api/projects/:id
router.get('/:id', getProjectByIdHandler);

// Nested: /api/projects/:projectId/members
router.use('/:projectId/members', memberRouter);

module.exports = router;
