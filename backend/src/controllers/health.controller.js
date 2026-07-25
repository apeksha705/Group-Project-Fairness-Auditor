const { successResponse } = require('../utils/response');

/**
 * @desc   Health check
 * @route  GET /api/health
 */
const getHealth = (req, res) => {
  return successResponse(res, { message: 'Backend is running' });
};

module.exports = { getHealth };
