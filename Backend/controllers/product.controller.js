import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/product.model.js";

//function for add product
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes } = req.body;
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined
    );

    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now(),
    };

    console.log(productData);

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//function for list product
const listProduct = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//function for remove product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//function for single product info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addProduct, listProduct, removeProduct, singleProduct };

// import productModel from '../models/productModel.js'

// export const addProduct = async (req, res) => {
//     try {
//         const { name, description, price, category, subCategory, sizes } = req.body

//         // Validate images
//         const getFile = (field) => req.files?.[field]?.[0]?.filename
//         const images = [
//             getFile("image1"),
//             getFile("image2"),
//             getFile("image3"),
//             getFile("image4")
//         ]

//         if (images.some(img => !img)) {
//             return res.status(400).json({ success: false, message: "All 4 images are required" })
//         }

//         // Parse sizes if it's sent as JSON string
//         const parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes

//         const newProduct = new productModel({
//             name,
//             description,
//             price,
//             image: images,
//             category,
//             subCategory,
//             sizes: parsedSizes,
//             date: Date.now()
//         })

//         await newProduct.save()

//         res.status(201).json({ success: true, message: "Product added successfully", product: newProduct })

//     } catch (error) {
//         console.error("Add Product Error:", error)
//         res.status(500).json({ success: false, message: error.message })
//     }
// }

// // Placeholder exports for others if needed
// export const listProduct = (req, res) => { }
// export const removeProduct = (req, res) => { }
// export const singleProduct = (req, res) => { }
