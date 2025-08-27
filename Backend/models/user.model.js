// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     category: { type: Object, default: {} },
//     address: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "useraddress", // this must match the model name used above
//       required: false,
//       default: null
//     },
//   },
//   { minimize: false }
// );

// const userModel = mongoose.models.user || mongoose.model("user", userSchema);

// export default userModel;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: Number, required: true, trim: true },
    gmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 8 },
    category: { type: Object, default: {} },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "useraddress",
      default: null,
    },
    verifyOtp: { type: String, default: "" },
    verifyOtpExpireAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: "" },
    resetOtpExpireAt: { type: Number, default: 0 },
  },
  { minimize: false, timestamps: true }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
