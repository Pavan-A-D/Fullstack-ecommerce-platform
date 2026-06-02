const Order = require("../models/Order");
const Cart = require("../models/Cart");

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No order items provided" });
    }

    const order = await Order.create({
      userId: req.user._id,
      items,
      totalAmount,
      address,
      status: "Pending",
    });

    // Clear the user's cart after placing the order
    await Cart.deleteMany({ userId: req.user._id });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate("items.productId", "name price image")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel an order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Ensure the user owns this order
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this order" });
    }

    // Only allow cancellation if order is Pending or Processing
    if (!["Pending", "Processing"].includes(order.status)) {
      return res.status(400).json({ message: `Cannot cancel order with status "${order.status}"` });
    }

    order.status = "Cancelled";
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, getOrders, cancelOrder };
