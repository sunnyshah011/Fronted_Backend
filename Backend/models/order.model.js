import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: true,
        },
        size: { type: String, required: true },
        color: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    amount: { type: Number, required: true },
    address: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      province: { type: String, required: true },
      district: { type: String, required: true },
      city: { type: String, required: true },
      streetAddress: { type: String, required: true },
    },

    paymentMethod: { type: String, required: true },
    // 🆕 proof of payment uploaded by user

    // 🆕 store selected online payment method reference
    paymentMethodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PaymentMethod",
      default: null,
    },

    paymentProof: { type: String, default: "" }, // URL of uploaded screenshot

    paymentStatus: { type: String, default: "" },

    orderStatus: { type: String, default: "" },

    // 🆕 Return information
    returnRequest: {
      isRequested: { type: Boolean, default: false },
      reason: { type: String, default: "" },
      status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
      },
    },
    // 🆕 8-digit unique order ID
    orderId: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
