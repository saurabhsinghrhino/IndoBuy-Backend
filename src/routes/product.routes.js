const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const productMiddleware = require("../middlewares/products.middleware");
const productController = require("../controllers/product.controller");
const orderController = require("../controllers/order.controller");
const upload = require("../config/multer");

/* POST /api/product/add-product/*/
router.post(
  "/add-product",
  authMiddleware.getProfile,
  productMiddleware.roleMiddleware("ADMIN"),
  upload.single("image"),
  productController.addProduct,
);

/* GET /api/products/get-product */
router.get("/get-product", productController.getProductCheckUser);

/* GET /api/products/:id */
router.get("/:id", authMiddleware.getProfile, productController.getProductById);

/* PUT /api/products/update/:id */
router.put(
  "/update/:id",
  authMiddleware.getProfile,
  productMiddleware.roleMiddleware("ADMIN"),
  upload.single("image"),
  productController.updateProductById,
);

/* DELETE /api/products/delete/:id */
router.delete(
  "/delete/:id",
  authMiddleware.getProfile,
  productMiddleware.roleMiddleware("ADMIN"),
  productController.deleteProductById,
);

module.exports = router;
