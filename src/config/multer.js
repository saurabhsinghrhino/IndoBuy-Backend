const multer = require("multer");

/**
 * This is for image storage
 */
const upload = multer({
  storage: multer.memoryStorage(),
});

module.exports = upload;
