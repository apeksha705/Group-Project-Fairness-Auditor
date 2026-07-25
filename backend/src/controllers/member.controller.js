const { successResponse, errorResponse } = require('../utils/response');
const { getProjectById } = require('../services/project.service');
const { createMember, getMembersByProjectId } = require('../services/member.service');

// Reusable UUID regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Validate :projectId param and confirm the project exists in the DB.
 * Returns an early error response if invalid; returns null if all good.
 */
const validateProject = async (projectId, res) => {
  if (!UUID_REGEX.test(projectId)) {
    errorResponse(res, 'Invalid project ID format', 400);
    return false;
  }

  const { data, error } = await getProjectById(projectId);

  if (error) {
    if (error.code === 'PGRST116') {
      errorResponse(res, 'Project not found', 404);
      return false;
    }
    console.error('[validateProject]', error);
    errorResponse(res, 'Failed to verify project', 500);
    return false;
  }

  if (!data) {
    errorResponse(res, 'Project not found', 404);
    return false;
  }

  return true;
};

// ---------------------------------------------------------------------------

/**
 * @desc    Add a member to a project
 * @route   POST /api/projects/:projectId/members
 * @access  Public
 */
const createMemberHandler = async (req, res) => {
  const { projectId } = req.params;

  // Confirm project exists before writing
  const valid = await validateProject(projectId, res);
  if (!valid) return;

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
 * @desc    Get all members for a project
 * @route   GET /api/projects/:projectId/members
 * @access  Public
 */
const getMembersHandler = async (req, res) => {
  const { projectId } = req.params;

  // Confirm project exists before querying members
  const valid = await validateProject(projectId, res);
  if (!valid) return;

  const { data, error } = await getMembersByProjectId(projectId);

  if (error) {
    console.error('[getMembersByProjectId]', error);
    return errorResponse(res, 'Failed to fetch members', 500);
  }

  return successResponse(res, { data });
};

module.exports = { createMemberHandler, getMembersHandler };
