const express = require('express');
const router = express.Router();
const {
  createProjectHandler,
  getAllProjectsHandler,
  getProjectByIdHandler,
} = require('../controllers/project.controller');

// POST /api/projects
router.post('/', createProjectHandler);

// GET /api/projects
router.get('/', getAllProjectsHandler);

// GET /api/projects/:id
router.get('/:id', getProjectByIdHandler);

module.exports = router;
