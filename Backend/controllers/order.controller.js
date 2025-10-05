import orderModel from "../models/order.model.js";
import userModel from "../models/user.model.js";

// Place Order (COD)
const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId; // from auth middleware

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Create new order
    const newOrder = new orderModel({
      user: userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      paymentStatus: "Pending",
      orderStatus: "Processing",
      date: Date.now(),
    });

    await newOrder.save();

    // Clear user's cart after order
    await userModel.findByIdAndUpdate(userId, { cart: {} });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Orders for Logged-in User
const userOrders = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await orderModel
      .find({ user: userId })
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Orders (Admin)
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Order Status (Admin)
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await orderModel.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true }
    );

    if (!order)
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });

    res.json({ success: true, message: "Order status updated", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { placeOrder, allOrders, userOrders, updateStatus };
