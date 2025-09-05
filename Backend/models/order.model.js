import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  }, // linked to login user
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, required: true },
  status: { type: String, required: true, default: "Order Placed" },
  paymentMethod: { type: String, required: true },
  payment: { type: Boolean, required: true, default: false },
  date: { type: Number, required: true },
});

const orderModel =
  mongoose.models.order || mongoose.model("order", orderSchema);

export default orderModel;




// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema(
//   {
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },

//     items: [
//       {
//         productId: { type: mongoose.Schema.Types.ObjectId, ref: "product", required: true },
//         size: { type: String },
//         color: { type: String },
//         quantity: { type: Number, required: true },
//         price: { type: Number, required: true }
//       }
//     ],

//     amount: { type: Number, required: true },

//     address: {
//       street: { type: String, required: true },
//       city: { type: String, required: true },
//       state: { type: String },
//       postalCode: { type: String, required: true },
//       country: { type: String, required: true }
//     },

//     status: {
//       type: String,
//       enum: ["Order Placed", "Processing", "Shipped", "Delivered", "Cancelled"],
//       default: "Order Placed"
//     },

//     paymentMethod: { type: String, enum: ["COD", "ONLINE"], required: true },
//     payment: { type: Boolean, default: false }
//   },
//   { timestamps: true }
// );

// const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
// export default orderModel;
