const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      trim: true,
      lowercase: true,
      unique: [true, "Username already existed"],
      required: [true, "Username is required to register or login"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email address",
      ],
      unique: [true, "Email already existed"],
      required: [true, "Email is required to register or login"],
    },
    password: {
      type: String,
      minlength: [6, "Password should be contain more than 6 characters"],
      required: [true, "Password is required to register or login"],
      select: false,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  { timeStamps: true, createdAt: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
  return;
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
