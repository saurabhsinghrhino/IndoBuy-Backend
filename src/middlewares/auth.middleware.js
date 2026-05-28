const jwt = require("jsonwebtoken");

/**
 * - User Profile Middleware
 * - POST /api/profile/view
 */

const getProfile = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    const decoded = await jwt.decode(token, process.env.JWT_TOKEN);
    req.user = decoded; // {id, role}

    next();
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  getProfile,
};
