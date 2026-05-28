const express = require("express");

const router = express.Router();

const {
  createPaymentOrder,
  verifyPayment,
} = require("../controllers/payment.controller");

const { getProfile } = require("../middlewares/auth.middleware");

router.post("/create-order", getProfile, createPaymentOrder);

router.post("/verify-payment", getProfile, verifyPayment);

module.exports = router;
