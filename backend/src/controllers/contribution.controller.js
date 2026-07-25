const { successResponse, errorResponse } = require('../utils/response');
const { assertProjectExists, assertMemberExists } = require('../utils/validate');
const { createContribution, getContributionsByProjectId } = require('../services/contribution.service');

// ---------------------------------------------------------------------------

/**
 * @desc   Log a contribution for a project member
 * @route  POST /api/projects/:projectId/contributions
 */
const createContributionHandler = async (req, res) => {
  const { projectId } = req.params;

  // 1. Project must exist
  if (!(await assertProjectExists(projectId, res))) return;

  // 2. Validate required body fields
  const { member_id, task_title, description, task_category, hours_spent } = req.body;

  const missing = [];
  if (!member_id   || String(member_id).trim()   === '') missing.push('member_id');
  if (!task_title  || String(task_title).trim()  === '') missing.push('task_title');
  if (hours_spent === undefined || hours_spent === null || String(hours_spent).trim() === '') {
    missing.push('hours_spent');
  }

  if (missing.length > 0) {
    return errorResponse(res, `Missing required fields: ${missing.join(', ')}`, 400);
  }

  // 3. hours_spent must be a non-negative number
  const parsedHours = parseFloat(hours_spent);
  if (isNaN(parsedHours) || parsedHours < 0) {
    return errorResponse(res, 'hours_spent must be a non-negative number', 400);
  }

  // 4. Member must exist and belong to this project
  if (!(await assertMemberExists(String(member_id).trim(), projectId, res))) return;

  // 5. Persist
  const { data, error } = await createContribution({
    project_id:    projectId,
    member_id:     String(member_id).trim(),
    task_title:    String(task_title).trim(),
    description:   description   ? String(description).trim()   : null,
    task_category: task_category ? String(task_category).trim() : null,
    hours_spent:   parsedHours,
  });

  if (error) {
    console.error('[createContribution]', error);
    return errorResponse(res, 'Failed to log contribution', 500);
  }

  return successResponse(res, { data }, 201);
};

/**
 * @desc   Get all contributions for a project
 * @route  GET /api/projects/:projectId/contributions
 */
const getContributionsHandler = async (req, res) => {
  const { projectId } = req.params;

  if (!(await assertProjectExists(projectId, res))) return;

  const { data, error } = await getContributionsByProjectId(projectId);

  if (error) {
    console.error('[getContributionsByProjectId]', error);
    return errorResponse(res, 'Failed to fetch contributions', 500);
  }

  return successResponse(res, { data });
};

module.exports = { createContributionHandler, getContributionsHandler };
