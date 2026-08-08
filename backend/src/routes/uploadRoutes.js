const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const { protect, admin } = require('../middlewares/authMiddleware');

// Store uploads directly on Cloudinary instead of the local disk —
// local disk storage does not persist on Azure App Service (ephemeral filesystem).
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'rm-store',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1600, height: 1600, crop: 'limit' }],
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// @route   POST /api/upload
// @desc    Upload a single image to Cloudinary
// @access  Private/Admin
router.post('/', protect, admin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  res.json({
    imageUrl: req.file.path, // secure Cloudinary URL — store this in the DB
    publicId: req.file.filename, // Cloudinary public_id — needed to delete later
  });
});

// @route   POST /api/upload/multiple
// @desc    Upload up to 5 images to Cloudinary
// @access  Private/Admin
router.post('/multiple', protect, admin, upload.array('images', 5), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded' });
  }

  const images = req.files.map((file) => ({
    imageUrl: file.path,
    publicId: file.filename,
  }));

  res.json({ images });
});

// @route   DELETE /api/upload/:publicId
// @desc    Delete an image from Cloudinary
// @access  Private/Admin
router.delete('/:publicId', protect, admin, async (req, res) => {
  try {
    // publicId may contain a folder path (e.g. rm-store/abc123), so it is
    // passed as a query/body value rather than a raw path segment.
    const publicId = decodeURIComponent(req.params.publicId);

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok' || result.result === 'not found') {
      res.json({ message: 'Image deleted' });
    } else {
      res.status(400).json({ message: 'Could not delete image', result });
    }
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Delete failed' });
  }
});

module.exports = router;
