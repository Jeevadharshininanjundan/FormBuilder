const multer = require('multer');

// store files in memory; we'll stream to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = upload;