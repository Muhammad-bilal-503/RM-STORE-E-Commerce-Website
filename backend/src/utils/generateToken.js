const jwt = require('jsonwebtoken');

/**
 * Generates a signed JWT for a user id.
 * This is the single source of truth for token creation on the backend.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
