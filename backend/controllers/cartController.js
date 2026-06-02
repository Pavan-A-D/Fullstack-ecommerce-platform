const Cart = require("../models/Cart");

// @desc    Get user's cart items
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.user._id }).populate(
      "productId",
      "name price image category"
    );
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart (or update quantity if exists)
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    // Check if item already in cart
    const existingItem = await Cart.findOne({
      userId: req.user._id,
      productId,
    });

    if (existingItem) {
      // Update quantity
      existingItem.quantity = quantity || existingItem.quantity + 1;
      await existingItem.save();
      const populated = await existingItem.populate(
        "productId",
        "name price image category"
      );
      return res.json(populated);
    }

    // Create new cart item
    const cartItem = await Cart.create({
      userId: req.user._id,
      productId,
      quantity: quantity || 1,
    });

    const populated = await cartItem.populate(
      "productId",
      "name price image category"
    );
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const cartItem = await Cart.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await Cart.findByIdAndDelete(req.params.id);
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCart, addToCart, removeFromCart };
