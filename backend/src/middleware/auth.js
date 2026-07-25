/**
 * Authentication middleware placeholder.
 * Wire in JWT / Supabase session verification here.
 */
const protect = (req, res, next) => {
  // TODO: validate bearer token from Authorization header
  next();
};

module.exports = { protect };
