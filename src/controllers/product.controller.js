const productModel = require("../models/product.model");
const ImageKit = require("imagekit");
const imagekit = require("../Services/imagekit");

/**
 * - Add product controller
 * - POST /api/products/add-product
 */
const addProduct = async (req, res) => {
  const { name, price, description, category, stock, imageId } = req.body;
  let imageUrl = "";

  if (!name || !price || !description || !category || !stock) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  if (req.file) {
    const result = await imagekit.upload({
      file: req.file.buffer,
      fileName: Date.now() + "-" + req.file.originalname,
    });
    imageUrl = result.url;
  } else {
    return res.status(400).json({
      message: "Image is required",
    });
  }

  try {
    const isExisted = await productModel.findOne({ name: name });

    if (isExisted) {
      return res.status(409).json({
        message:
          "Product already exists, Please update the details of existing product",
      });
    }
    const productCreation = await productModel.create({
      name: name,
      price: price,
      description: description,
      image: imageUrl,
      category: category,
      stock: stock,
      imageFileId: imageId,
      user: req.user.id,
    });
    res.status(200).json({
      message: "Product added successfully",
      product: productCreation,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
    console.log(error);
  }
};

/**
 * - Get product controller
 * - GET /api/products/get-product
 */

const getProductCheckUser = async (req, res) => {
  try {
    const product = await productModel.find();

    res.status(200).json({
      message: "All products fetched successfully",
      product: product,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

/**
 * - Get product by Id
 * - GET /api/products/:id
 */

const getProductById = async (req, res) => {
  if (!req.params.id) {
    return res.status(403).json({
      message: "Id is required to fetch product details...",
    });
  }

  try {
    const product = await productModel.findOne({
      _id: req.params.id,
    });
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    res.status(200).json({
      message: "Product fetched successfully",
      product: product,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

/**
 * - Update product by Id
 * - PUT /api/products/update/:id
 */

const updateProductById = async (req, res) => {
  if (!req.params.id) {
    return res.status(403).json({
      message: "Id is required to Update product details...",
    });
  }
  try {
    const product = await productModel.findOne({
      _id: req.params.id,
    });
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (req.file) {
      if (product.imageFileId) {
        await imagekit.deleteFile(product.imageFileId);
      }
      const result = await imagekit.upload({
        file: req.file.buffer,
        fileName: Date.now() + "-" + req.file.originalname,
      });
      product.image = result.url;
      product.imageFileId = result.fileId;
    }

    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    product.description = req.body.description || product.description;
    product.category = req.body.category || product.category;
    product.stock = req.body.stock || product.stock;

    const updated = await product.save();
    res.status(200).json({
      message: "Product updated successfully",
      product: product,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
    console.log(error);
  }
};

/**
 * - delete product by Id
 * - DELETE /api/products/delete/:id
 */

const deleteProductById = async (req, res) => {
  try {
    const product = await productModel.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }
    // 🔥 Step 1: Delete image from ImageKit
    if (product.imageFileId) {
      await imagekit.deleteFile(product.imageFileId);
    }

    // 🔥 Step 2: Delete product from DB
    await product.deleteOne();

    res.status(201).json({
      message: "Delete product successfully",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
    console.log(error);
  }
};

module.exports = {
  addProduct,
  getProductCheckUser,
  getProductById,
  updateProductById,
  deleteProductById,
};
