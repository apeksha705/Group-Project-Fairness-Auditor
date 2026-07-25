/**
 * Shared validation helpers used across controllers.
 */

const { getProjectById } = require('../services/project.service');
const { getMemberById }  = require('../services/member.service');

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Returns true when the string is a well-formed UUID v4. */
const isValidUUID = (value) => UUID_REGEX.test(value);

/**
 * Confirms a project exists.
 * Writes the appropriate error response and returns false when it doesn't.
 * Returns true when the project is found.
 *
 * @param {string}           projectId
 * @param {import('express').Response} res
 */
const assertProjectExists = async (projectId, res) => {
  const { errorResponse } = require('./response');

  if (!isValidUUID(projectId)) {
    errorResponse(res, 'Invalid project ID format', 400);
    return false;
  }

  const { data, error } = await getProjectById(projectId);

  if (error) {
    if (error.code === 'PGRST116') {
      errorResponse(res, 'Project not found', 404);
      return false;
    }
    console.error('[assertProjectExists]', error);
    errorResponse(res, 'Failed to verify project', 500);
    return false;
  }

  if (!data) {
    errorResponse(res, 'Project not found', 404);
    return false;
  }

  return true;
};

/**
 * Confirms a member exists AND belongs to the given project.
 * Writes the appropriate error response and returns false when it doesn't.
 * Returns true when the member is valid.
 *
 * @param {string}           memberId
 * @param {string}           projectId
 * @param {import('express').Response} res
 */
const assertMemberExists = async (memberId, projectId, res) => {
  const { errorResponse } = require('./response');

  if (!isValidUUID(memberId)) {
    errorResponse(res, 'Invalid member_id format', 400);
    return false;
  }

  const { data, error } = await getMemberById(memberId);

  if (error) {
    if (error.code === 'PGRST116') {
      errorResponse(res, 'Member not found', 404);
      return false;
    }
    console.error('[assertMemberExists]', error);
    errorResponse(res, 'Failed to verify member', 500);
    return false;
  }

  if (!data) {
    errorResponse(res, 'Member not found', 404);
    return false;
  }

  if (data.project_id !== projectId) {
    errorResponse(res, 'Member does not belong to this project', 400);
    return false;
  }

  return true;
};

module.exports = { isValidUUID, assertProjectExists, assertMemberExists };
