import express from "express";
import {
  placeOrder,
  allOrders,
  userOrders,
  updateStatus,
  cancelOrder,
  deleteOrder,
  requestReturn,
  handleReturnStatus,
} from "../controllers/order.controller.js";
import authUser from "../middleware/auth.middleware.js";
import adminAuth from "../middleware/adminAuth.middleware.js";

const orderRouter = express.Router();

// Admin routes
orderRouter.post("/status", adminAuth, updateStatus);
orderRouter.post("/list", adminAuth, allOrders);

// User routes
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/userorders", authUser, userOrders);

//deleter order
orderRouter.post("/delete", authUser, deleteOrder);

orderRouter.post("/cancel", authUser, cancelOrder); // 🆕 cancel route

// User: Request return
orderRouter.post("/return", authUser, requestReturn);

// Admin: Handle return decision
orderRouter.post("/return/handle", adminAuth, handleReturnStatus);

export default orderRouter;
