const { successResponse, errorResponse } = require('../utils/response');
const { isValidUUID } = require('../utils/validate');
const { buildReport } = require('../services/report.service');

// ---------------------------------------------------------------------------

/**
 * @desc   Generate a fairness report for a project
 * @route  GET /api/projects/:projectId/report
 */
const getReportHandler = async (req, res) => {
  const { projectId } = req.params;

  if (!isValidUUID(projectId)) {
    return errorResponse(res, 'Invalid project ID format', 400);
  }

  const { report, error } = await buildReport(projectId);

  if (error) {
    return errorResponse(res, error.message, error.status);
  }

  return successResponse(res, { data: report });
};

module.exports = { getReportHandler };
