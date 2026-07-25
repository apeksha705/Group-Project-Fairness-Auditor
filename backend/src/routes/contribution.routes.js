const express = require('express');
// mergeParams exposes :projectId from the parent project router
const router = express.Router({ mergeParams: true });
const {
  createContributionHandler,
  getContributionsHandler,
} = require('../controllers/contribution.controller');

// POST /api/projects/:projectId/contributions
router.post('/', createContributionHandler);

// GET /api/projects/:projectId/contributions
router.get('/', getContributionsHandler);

module.exports = router;
