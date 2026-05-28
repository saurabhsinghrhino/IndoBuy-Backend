const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const productMiddleware = require("../middlewares/products.middleware");
const orderController = require("../controllers/order.controller");

/**
 * POST - /api/order/booking
 * This is for Order Booking
 */

router.post("/booking", authMiddleware.getProfile, orderController.createOrder);

/**
 * GET - /api/orders/all-order
 * This is for Order Booking
 */
router.get(
  "/all-order",
  authMiddleware.getProfile,
  orderController.getAllOrder,
);

/**
 * GET - /api/orders/details/:id
 * This is for Order Booking
 */
router.get(
  "/details/:id",
  authMiddleware.getProfile,
  orderController.getAllOrder,
);

/**
 * PUT - /api/orders/:id/status
 * This is for updating status of product
 */
router.put(
  "/:id/status",
  authMiddleware.getProfile,
  productMiddleware.roleMiddleware("ADMIN"),
  orderController.updateOrderStatus,
);

module.exports = router;
