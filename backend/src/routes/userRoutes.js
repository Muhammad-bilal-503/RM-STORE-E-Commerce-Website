const express = require('express');
const router = express.Router();
const {
  registerUser,
  verifyEmail,
  authUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
  forgotPassword,
  resetPassword,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  requestPasswordReset,
} = require('../controllers/userController');
const { protect, authorize, superAdminOnly } = require('../middlewares/authMiddleware');

// Public routes
router.post('/', registerUser);
router.post('/login', authUser);
router.get('/verify/:token', verifyEmail);
router.post('/reset-password', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Wishlist routes
router.route('/wishlist')
  .get(protect, getWishlist)
  .post(protect, addToWishlist);

router.delete('/wishlist/:productId', protect, removeFromWishlist);

// Admin routes - customer account management
router.route('/')
  .get(protect, authorize('users.read'), getUsers);

router.route('/:id')
  .get(protect, authorize('users.read'), getUserById)
  .put(protect, authorize('users.update'), updateUser)
  .delete(protect, superAdminOnly, deleteUser);

module.exports = router; 