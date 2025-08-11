// routes/uploadRoutes.js
const express = require('express');
const upload = require('../middleware/upload');
const streamUpload = require('../utils/streamUpload');

const router = express.Router();
/*
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
*/
// Route for question images - now expects 'image' field, returns 'imageUrl'
router.post('/upload/question', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }
        const result = await streamUpload(req.file.buffer);
        res.json({ imageUrl: result.secure_url }); // Consistent response property
    } catch (err) {
        console.error("Error uploading question image:", err); // Log detailed error
        res.status(500).json({ error: 'Question image upload failed' });
    }
});

// Route for header images - now expects 'image' field, returns 'imageUrl'
router.post('/upload/header', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }
        const result = await streamUpload(req.file.buffer);
        res.json({ imageUrl: result.secure_url }); // Consistent response property
    } catch (err) {
        console.error("Error uploading header image:", err); // Log detailed error
        res.status(500).json({ error: 'Header image upload failed' });
    }
});

module.exports = router;