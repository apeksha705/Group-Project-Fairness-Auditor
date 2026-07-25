/**
 * @desc    Health check
 * @route   GET /api/health
 * @access  Public
 */
const getHealth = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend is running',
  });
};

module.exports = { getHealth };
