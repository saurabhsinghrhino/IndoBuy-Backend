const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profile.controller");
const authMiddleware = require("../middlewares/auth.middleware");

/* GET /api/profile/view */
router.get("/view", authMiddleware.getProfile, profileController.userProfile);

module.exports = router;
