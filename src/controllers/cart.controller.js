const Cart = require("../models/cart.model");

const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  const userId = req.user.id;

  let cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    cart = await Cart.create({
      user: userId,
      items: [],
    });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId,
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
    });
  }

  await cart.save();

  res.status(200).json({
    success: true,
    message: "Added to cart",
  });
};
