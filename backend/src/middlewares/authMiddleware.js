const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

/**
 * Protects routes by verifying JWT token
 * This middleware validates if a user is logged in
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];

    // Step 1: verify the JWT itself. Only failures here are genuine
    // authentication problems (expired/malformed/invalid signature).
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      res.status(401);
      throw new Error('Not authorized, token failed');
    }

    // Step 2: look the user up. A failure here (e.g. a brief database
    // connectivity hiccup right after a fresh deploy or an idle
    // free-tier instance waking up) is NOT a token problem — it's a
    // server-side issue, and should be reported as one instead of being
    // misreported as an auth failure, which was misleading and made this
    // class of bug impossible to diagnose from the error message alone.
    try {
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      console.error('User lookup failed during auth:', error.message);
      res.status(500);
      throw new Error('Server error while authenticating, please try again');
    }

    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }

    // Staff accounts (any non-customer role) can be deactivated/suspended
    // without deleting them — block access for those explicitly.
    if (req.user.role && req.user.role !== 'customer' && req.user.status !== 'active') {
      res.status(403);
      throw new Error('This account has been deactivated. Contact a Super Admin.');
    }

    next();
    return;
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

/**
 * Middleware to check if user is an admin
 * Must be used after the protect middleware
 */
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

// Verified user middleware
const verified = (req, res, next) => {
  if (req.user && req.user.isVerified) {
    next();
  } else {
    res.status(401);
    throw new Error('Email not verified. Please check your inbox to verify your email.');
  }
};

module.exports = { protect, admin, verified }; 