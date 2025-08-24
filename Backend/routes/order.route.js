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

//admin feature
orderRouter.post("/status", adminAuth, updateStatus);
orderRouter.post("/list", adminAuth, allOrders);

//payment feature
orderRouter.post("/place", authUser, placeOrder);

//order for fronted
orderRouter.post("/userorders", authUser, userOrders);

export default orderRouter
