import orderModel from "../models/order.model.js";
import userModel from "../models/user.model.js";

//placing order using COD Method
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      amount,
      address,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = await orderModel(orderData);
    await newOrder.save();

    res.json({ success: true, message: "Order Placed Successfully" });

    await userModel.findByIdAndUpdate(userId, { category: {} });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//user order data for fronted for my order page
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;

    const orders = await orderModel.find({ userId });

    if (!orders) {
      res.json({ success: false, message: error.message });
    }

    res.json({ success: true, orders });
    
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//All orders data for Admin Panel
const allOrders = async (req, res) => {};

//update orders status from adming panel
const updateStatus = async (req, res) => {};

export { placeOrder, allOrders, userOrders, updateStatus };
