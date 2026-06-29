const bcrypt = require("bcrypt");
const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
/**
 * - User register controller
 * - POST /api/auth/register
 */

const userRegister = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    const isExisted = await userModel.findOne({ email: email });

    if (isExisted) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    const user = await userModel.create({
      username: username,
      email: email,
      password: password,
      role: role,
      lastLogin: new Date(),
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("token", token);
    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        lastLogin: user.lastLogin,
        token: token,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

/**
 * - User login controller
 * - POST /api/auth/login
 */
const userLogin = async (req, res) => {
  console.log("Reached before response");
  try {
    const { email, password } = req.body;
    const user = await userModel
      .findOne({
        email: email,
      })
      .select("+password");
    // Check if user exists
    console.log(req.body);
    console.log(user.password);
    console.log(password);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    console.log(isPasswordCorrect);
    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: token,
        lastLogin: user.lastLogin,
      },
    });

    console.log("Response sent");
  } catch (error) {
    console.log(error);
    res.status(400).json({
      message: error.message,
    });
  }
};

module.exports = {
  userRegister,
  userLogin,
};
