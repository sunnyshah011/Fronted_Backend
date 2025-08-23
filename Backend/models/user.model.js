import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    category: { type: Object, default: {} },
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "useraddress", // this must match the model name used above
      required: false,
      default: null
    },
  },
  { minimize: false }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
