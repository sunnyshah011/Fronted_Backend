import mongoose from "mongoose";

const userProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
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

const userprofile =
  mongoose.models.userProfileSchema ||
  mongoose.model("userprofile", userProfileSchema);

export default userprofile;
