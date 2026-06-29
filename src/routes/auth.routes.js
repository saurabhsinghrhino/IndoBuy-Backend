const express = require("express");
const authController = require("../controllers/auth.controller");
const { getProfile } = require("../middlewares/auth.middleware");
const router = express.Router();

/* POST /api/auth/register */
router.post("/register", authController.userRegister);

/* POST /api/auth/login */
router.post("/login", authController.userLogin);

module.exports = router;
