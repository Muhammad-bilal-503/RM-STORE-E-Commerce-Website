const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const { STAFF_ROLES, ROLES } = require('../config/permissions');

// @desc    List all staff accounts (any non-customer role)
// @route   GET /api/staff
// @access  Private/SuperAdmin
const getStaff = asyncHandler(async (req, res) => {
  const staff = await User.find({
    $or: [{ role: { $in: STAFF_ROLES } }, { role: { $exists: false }, isAdmin: true }],
  })
    .select('-password')
    .sort({ createdAt: -1 });
  res.json(staff);
});

// @desc    Create a new staff account with a specific role
// @route   POST /api/staff
// @access  Private/SuperAdmin
const createStaff = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error('Name, email, password, and role are all required');
  }

  if (!STAFF_ROLES.includes(role)) {
    res.status(400);
    throw new Error('Invalid role');
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error('A user with this email already exists');
  }

  const staff = await User.create({
    name,
    email,
    password,
    role,
    isVerified: true, // staff accounts are created directly by a Super Admin, no email verification needed
  });

  res.status(201).json({
    _id: staff._id,
    name: staff.name,
    email: staff.email,
    role: staff.role,
    status: staff.status,
    isAdmin: staff.isAdmin,
    createdAt: staff.createdAt,
  });
});

// @desc    Update a staff account's role and/or status
// @route   PUT /api/staff/:id
// @access  Private/SuperAdmin
const updateStaff = asyncHandler(async (req, res) => {
  const staff = await User.findById(req.params.id);

  if (!staff) {
    res.status(404);
    throw new Error('Staff member not found');
  }

  if (!STAFF_ROLES.includes(staff.role)) {
    res.status(400);
    throw new Error('This account is not a staff account');
  }

  // A Super Admin can't demote or deactivate themselves through this endpoint
  // — prevents accidentally locking every Super Admin out at once.
  if (staff._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot modify your own staff account here');
  }

  if (req.body.role) {
    if (!STAFF_ROLES.includes(req.body.role)) {
      res.status(400);
      throw new Error('Invalid role');
    }
    staff.role = req.body.role;
  }

  if (req.body.status) {
    if (!['active', 'inactive', 'suspended'].includes(req.body.status)) {
      res.status(400);
      throw new Error('Invalid status');
    }
    staff.status = req.body.status;
  }

  if (req.body.name) staff.name = req.body.name;

  const updated = await staff.save();

  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
    status: updated.status,
    isAdmin: updated.isAdmin,
    createdAt: updated.createdAt,
  });
});

// @desc    Deactivate (not delete) a staff account
// @route   DELETE /api/staff/:id
// @access  Private/SuperAdmin
const deactivateStaff = asyncHandler(async (req, res) => {
  const staff = await User.findById(req.params.id);

  if (!staff) {
    res.status(404);
    throw new Error('Staff member not found');
  }

  if (!STAFF_ROLES.includes(staff.role)) {
    res.status(400);
    throw new Error('This account is not a staff account');
  }

  if (staff._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot deactivate your own account');
  }

  // Prefer deactivation over deletion so historical activity (who created/
  // updated what) is preserved.
  staff.status = 'inactive';
  await staff.save();

  res.json({ message: 'Staff account deactivated' });
});

module.exports = { getStaff, createStaff, updateStaff, deactivateStaff };
