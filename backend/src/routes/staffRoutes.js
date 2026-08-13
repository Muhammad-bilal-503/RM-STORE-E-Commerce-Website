const express = require('express');
const router = express.Router();
const { getStaff, createStaff, updateStaff, deactivateStaff } = require('../controllers/staffController');
const { protect, superAdminOnly } = require('../middlewares/authMiddleware');

// Staff/role management is Super Admin only, full stop — not just a
// permission check like other resources, since this controls who has
// access to everything else.
router.use(protect, superAdminOnly);

router.route('/')
  .get(getStaff)
  .post(createStaff);

router.route('/:id')
  .put(updateStaff)
  .delete(deactivateStaff);

module.exports = router;
