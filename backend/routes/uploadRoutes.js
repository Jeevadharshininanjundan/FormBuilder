// routes/uploadRoutes.js
const express = require('express');
const upload = require('../middleware/upload');
const streamUpload = require('../utils/streamUpload');

const router = express.Router();

// Route for question images
router.post('/upload/question', upload.single('file'), async (req, res) => {
  try {
    const result = await streamUpload(req.file.buffer);
    res.json({ imageUrl: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: 'Image upload failed' });
  }
});

// Route for header images
router.post('/upload/header', upload.single('file'), async (req, res) => {
  try {
    const result = await streamUpload(req.file.buffer);
    res.json({ imageUrl: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: 'Header image upload failed' });
  }
});

module.exports = router;
