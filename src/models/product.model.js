const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    imageFileId: {
      type: String,
    },
    category: {
      type: String,
      required: true,
    },
    stock: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, createdAt: true },
);

module.exports = mongoose.model("product", productSchema);
