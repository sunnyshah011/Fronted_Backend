import mongoose from "mongoose";

const userAddressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true, // <-- Enforce only one address per user
    }, // linked to login user
    name: { type: String, required: true },
    phone: { type: Number, default: 0 },
    province: { type: String, default: "" },
    district: { type: String, default: "" },
    city: { type: String, default: "" },
    street: { type: String, default: "" },
  },
  { timestamps: true }
);

const userAddress =
  mongoose.models.userAddressSchema ||
  mongoose.model("useraddress", userAddressSchema);

export default userAddress;
