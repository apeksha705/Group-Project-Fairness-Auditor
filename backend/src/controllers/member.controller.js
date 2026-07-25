const { successResponse, errorResponse } = require('../utils/response');
const { assertProjectExists } = require('../utils/validate');
const { createMember, getMembersByProjectId } = require('../services/member.service');

// ---------------------------------------------------------------------------

/**
 * @desc   Add a member to a project
 * @route  POST /api/projects/:projectId/members
 */
const createMemberHandler = async (req, res) => {
  const { projectId } = req.params;

  if (!(await assertProjectExists(projectId, res))) return;

  const name = req.body.name ? String(req.body.name).trim() : '';
  if (!name) {
    return errorResponse(res, 'Missing required field: name', 400);
  }

  const { data, error } = await createMember({ project_id: projectId, name });

  if (error) {
    console.error('[createMember]', error);
    return errorResponse(res, 'Failed to add member', 500);
  }

  return successResponse(res, { data }, 201);
};

/**
 * @desc   Get all members for a project
 * @route  GET /api/projects/:projectId/members
 */
const getMembersHandler = async (req, res) => {
  const { projectId } = req.params;

  if (!(await assertProjectExists(projectId, res))) return;

  const { data, error } = await getMembersByProjectId(projectId);

  if (error) {
    console.error('[getMembersByProjectId]', error);
    return errorResponse(res, 'Failed to fetch members', 500);
  }

  return successResponse(res, { data });
};

module.exports = { createMemberHandler, getMembersHandler };
