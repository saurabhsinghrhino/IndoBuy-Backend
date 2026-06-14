const { getProfile } = require("../middlewares/auth.middleware");

const express = require("express");

const router = express.Router();

const {
  createPaymentOrder,
  verifyPayment,
  getMyPayments,
} = require("../controllers/payment.controller");

router.post("/create-order", getProfile, createPaymentOrder);

router.post("/verify-payment", getProfile, verifyPayment);

router.get("/my-payments", getProfile, getMyPayments);

module.exports = router;
