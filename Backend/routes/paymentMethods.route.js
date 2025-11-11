import express from "express";
import {
  getPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from "../controllers/paymentMethods.controller.js";
import upload from "../middleware/multer.middleware.js";

const paymentMethods = express.Router();

// ✅ Routes
paymentMethods.get("/", getPaymentMethods); // fetch all
paymentMethods.post("/", upload.single("image"), addPaymentMethod); // add new
paymentMethods.put("/:id", upload.single("image"), updatePaymentMethod); // update existing
paymentMethods.delete("/:id", deletePaymentMethod); // delete

export default paymentMethods;
