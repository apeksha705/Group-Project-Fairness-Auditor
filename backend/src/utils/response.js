/**
 * Utility helpers for consistent API responses.
 */

const successResponse = (res, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({ success: true, ...data });
};

const errorResponse = (res, message = 'Something went wrong', statusCode = 500) => {
  return res.status(statusCode).json({ success: false, message });
};

module.exports = { successResponse, errorResponse };
