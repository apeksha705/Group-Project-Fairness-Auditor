const express = require('express');
const router = express.Router({ mergeParams: true });
const { getReportHandler } = require('../controllers/report.controller');

// GET /api/projects/:projectId/report
router.get('/', getReportHandler);

module.exports = router;
