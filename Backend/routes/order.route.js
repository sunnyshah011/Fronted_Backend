import express from "express";
import {
  placeOrder,
  allOrders,
  userOrders,
  updateStatus,
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

export default orderRouter;
