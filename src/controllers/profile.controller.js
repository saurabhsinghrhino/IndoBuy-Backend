const userModel = require("../models/user.model");

/**
 * - User profile controller
 * - POST /api/profile/view
 */
const userProfile = async (req, res) => {
  try {
    const user = await userModel.findOne({
      _id: req.user.id,
    });
    if (!user) {
      console.log(user);
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user: {
        _id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  userProfile,
};
