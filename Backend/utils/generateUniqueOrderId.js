// utils/generateOrderId.js
import OrderModel from "../models/order.model.js"; // your order model

export async function generateUniqueOrderId() {
  // First 4 digits: use last 4 digits of current timestamp
  const first4 = Date.now().toString().slice(-4);

  let last4,
    exists = true;

  while (exists) {
    // Generate random 4 digits
    last4 = Math.floor(1000 + Math.random() * 9000).toString();

    const orderId = first4 + last4;

    // Check if orderId exists in DB
    exists = await OrderModel.findOne({ orderId });
    if (!exists) return orderId;
  }
}
