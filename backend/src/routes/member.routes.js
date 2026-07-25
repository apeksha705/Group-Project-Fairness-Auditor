const express = require('express');
// mergeParams lets us access :projectId from the parent project router
const router = express.Router({ mergeParams: true });
const { createMemberHandler, getMembersHandler } = require('../controllers/member.controller');

// POST /api/projects/:projectId/members
router.post('/', createMemberHandler);

// GET /api/projects/:projectId/members
router.get('/', getMembersHandler);

module.exports = router;
