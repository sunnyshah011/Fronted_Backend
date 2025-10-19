import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    images: [{ type: String }],

    // Variants
    variants: [
      {
        color: { type: String, required: true },
        size: { type: String, required: true },
        stock: { type: Number, default: 0 },
        price: { type: Number, required: true }, // variant-specific price
      },
    ],

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category",
      required: true,
    },

    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subcategory",
      required: true,
    },

    isActive: { type: Boolean, default: true },

    // ⭐ new flag
    isTopProduct: { type: Boolean, default: false },
    isBestSelling: { type: Boolean, default: false },
    isFlashSale: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ProductModel =
  mongoose.models.product || mongoose.model("product", productSchema);
export default ProductModel;
