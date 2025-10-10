import orderModel from "../models/order.model.js";
import userModel from "../models/user.model.js";
import ProductModel from "../models/product.model.js";

// 🔹 Place Order (COD)
const placeOrder = async (req, res) => {
  try {
    const { items, amount, address } = req.body;
    const userId = req.userId;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // ✅ Validate variant stock before placing order
    for (const item of items) {
      const product = await ProductModel.findById(item.productId);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.productId}`,
        });
      }

      const variant = product.variants.find(
        (v) => v.color === item.color && v.size === item.size
      );
      if (!variant) {
        return res.status(404).json({
          success: false,
          message: `Variant not found for ${product.name} (${item.color}, ${item.size})`,
        });
      }

      if (variant.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${product.name} (${item.color}, ${item.size})`,
        });
      }
    }

    // ✅ Deduct stock from variant
    for (const item of items) {
      const product = await ProductModel.findById(item.productId);
      const variantIndex = product.variants.findIndex(
        (v) => v.color === item.color && v.size === item.size
      );
      if (variantIndex !== -1) {
        product.variants[variantIndex].stock -= item.quantity;
        await product.save();
      }
    }

    // ✅ Create new order
    const newOrder = new orderModel({
      user: userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      paymentStatus: "Pending",
      orderStatus: "Pending",
      date: Date.now(),
    });

    await newOrder.save();

    // ✅ Clear user's cart
    await userModel.findByIdAndUpdate(userId, { category: {} });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Get Orders for Logged-in User
const userOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await orderModel
      .find({ user: userId })
      .populate({ path: "items.productId", select: "name images variants" })
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Get All Orders (Admin)
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate("user", "name gmail")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.error("Fetch all orders error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// // 🔹 Update Order Status (Admin)
// const updateStatus = async (req, res) => {
//   try {
//     const { orderId, status } = req.body;

//     const order = await orderModel.findByIdAndUpdate(
//       orderId,
//       { orderStatus: status },
//       { new: true }
//     );

//     if (!order)
//       return res
//         .status(404)
//         .json({ success: false, message: "Order not found" });

//     res.json({ success: true, message: "Order status updated", order });
//   } catch (error) {
//     console.error("Update status error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// 🔹 Update Order Status (Admin)
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // ✅ If already cancelled, don't restock again
    if (order.orderStatus === "Cancelled" && status === "Cancelled") {
      return res.status(400).json({
        success: false,
        message: "This order is already cancelled.",
      });
    }

    // ✅ If changing status to Cancelled, restore stock
    if (status === "Cancelled" && order.orderStatus !== "Cancelled") {
      for (const item of order.items) {
        const product = await ProductModel.findById(item.productId);
        if (!product) continue;

        const variantIndex = product.variants.findIndex(
          (v) => v.color === item.color && v.size === item.size
        );

        if (variantIndex !== -1) {
          product.variants[variantIndex].stock += item.quantity;
          await product.save();
        }
      }
    }

    // ✅ Update order status
    order.orderStatus = status;
    await order.save();

    res.json({
      success: true,
      message:
        status === "Cancelled"
          ? "Order cancelled and stock restored."
          : "Order status updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//delete order (admin)
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const deleted = await orderModel.findByIdAndDelete(orderId);
    if (!deleted) {
      return res.json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Delete order error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🔹 Cancel Order (User)
const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;
    const userId = req.userId;

    const order = await orderModel.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.orderStatus === "Cancelled") {
      return res
        .status(400)
        .json({ success: false, message: "This order is already cancelled." });
    }

    if (order.orderStatus !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "You can only cancel orders that are still in Pending phase.",
      });
    }
    // ✅ Restore stock for each variant
    for (const item of order.items) {
      const product = await ProductModel.findById(item.productId);
      const variantIndex = product.variants.findIndex(
        (v) => v.color === item.color && v.size === item.size
      );
      if (variantIndex !== -1) {
        product.variants[variantIndex].stock += item.quantity;
        await product.save();
      }
    }
    // ✅ Update order status
    order.orderStatus = "Cancelled";
    await order.save();

    res.json({
      success: true,
      message: "Order has been cancelled and stock restored.",
      order,
    });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  allOrders,
  userOrders,
  updateStatus,
  cancelOrder,
  deleteOrder,
};
