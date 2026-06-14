const razorpay = require("../config/razorpay");
const crypto = require("crypto");

const orderModel = require("../models/order.model");
const paymentModel = require("../models/payment.model");

// CREATE RAZORPAY ORDER
const createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: "Amount is required",
      });
    }

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    console.log(razorpayOrder);

    res.status(200).json({
      success: true,
      message: "Razorpay order created successfully",
      order: razorpayOrder,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// VERIFY PAYMENT
const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      totalAmount,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment details are missing",
      });
    }

    // Signature Verification
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Create Order
    const order = await orderModel.create({
      user: req.user.id,
      items,
      totalAmount,
      status: "Processing",
    });

    // Save Payment
    const payment = await paymentModel.create({
      user: req.user.id,
      order: order._id,

      razorpayOrderId: razorpay_order_id,

      razorpayPaymentId: razorpay_payment_id,

      amount: totalAmount,

      status: "Paid",
    });

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",

      order,

      payment,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET USER PAYMENTS
const getMyPayments = async (req, res) => {
  try {
    const payments = await paymentModel
      .find({
        user: req.user.id,
      })
      .populate("order");

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
  getMyPayments,
};
