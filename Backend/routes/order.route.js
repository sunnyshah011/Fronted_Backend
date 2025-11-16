import express from "express";
import {
  placeOrder,
  allOrders,
  getSingleOrder,
  userOrders,
  updateStatus,
  cancelOrder,
  deleteOrder,
  requestReturn,
  handleReturnStatus,
  userpaymentproof,
  removePaymentProof,
} from "../controllers/order.controller.js";
import authUser from "../middleware/auth.middleware.js";
import adminAuth from "../middleware/adminAuth.middleware.js";
import upload from "../middleware/multer.middleware.js";

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
orderRouter.post("/return/handle", adminAuth, handleReturnStatus);

orderRouter.post(
  "/paymentproof",
  upload.single("image"),
  authUser,
  userpaymentproof
);

orderRouter.post("/paymentproof/remove", authUser, removePaymentProof);

orderRouter.post("/:id", authUser, getSingleOrder);

export default orderRouter;
