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
    phone: { type: Number, required: true },
    province: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
  },
  { timestamps: true }
);

const userAddress =
  mongoose.models.userAddressSchema ||
  mongoose.model("useraddress", userAddressSchema);

export default userAddress;
