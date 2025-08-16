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

// models/productModel.js

import mongoose from "mongoose"

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: [String], required: true }, // Array of filenames
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: { type: [String], required: true },
    date: { type: Number, default: Date.now }
})

const productModel = mongoose.models.product || mongoose.model("product", productSchema)

export default productModel
