import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    images: [{ type: String }],

    colors: [{ type: String }], // simple array
    attributes: [
      {
        name: { type: String }, // "Size", "Weight", "Length"
        value: { type: String }, // "42", "25", "5"
        unit: { type: String }, // "EU", "kg", "ft", "cm"
      },
    ],

    subcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subcategory",
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ProductModel = mongoose.models.product || mongoose.model("product", productSchema);
export default ProductModel;

// import mongoose from "mongoose"

// const productSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     description: { type: String, required: true },
//     price: { type: Number, required: true },
//     image: { type: Array, required: true },
//     category: { type: String, required: true },
//     subCategory: { type: String, required: true },
//     sizes: { type: Array, required: true },
//     date: { type: Number, required: true }
// })

// const productModel = mongoose.models.product || mongoose.model("product", productSchema)

// export default productModel
