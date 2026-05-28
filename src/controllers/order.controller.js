const orderModel = require("../models/order.model");
const productModel = require("../models/product.model");
const userModel = require("../models/user.model");

const createOrder = async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    const user = await userModel.findById(req.user.id);

    if (!items || !totalAmount) {
      return res.status(400).json({
        message: "Items or totalAmount missing",
      });
    }

    // 🔥 Check all products exist
    for (let item of items) {
      const product = await productModel.findById(item.product);

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.product}`,
        });
      }
    }

    // 🔥 Create order
    const order = await orderModel.create({
      user: req.user.id,
      items,
      totalAmount,
    });

    res.status(201).json({
      message: `${user.username}, your order placed successfully 🚀`,
      data: order,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await orderModel.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({ message: "Status updated", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllOrder = async (req, res) => {
  try {
    const allOrder = await orderModel
      .find({ user: req.user.id })
      .populate("items.product");
    if (allOrder.length === 0 || !allOrder) {
      return res.status(400).json({
        message: "No Order Found",
      });
    }
    const user = await userModel.findById({
      _id: req.user.id,
    });

    res.status(200).json({
      message: "All Order fetched successfully",
      orders: allOrder,
      user: user,
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      message: error.message,
    });
  }
};

const getAllOrderById = async (req, res) => {
  if (!req.params.id) {
    return res.status(403).json({
      message: "Id is required to getting order details...",
    });
  }
  try {
    const allOrder = await orderModel.findById({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!allOrder) {
      return res.status(400).json({
        message: "No Order Found",
      });
    }
    res.status(200).json({
      message: "Order details fetched successfully",
      orders: allOrder,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
module.exports = {
  createOrder,
  updateOrderStatus,
  getAllOrder,
  getAllOrderById,
};
