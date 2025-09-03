import { v2 as cloudinary } from "cloudinary";
import ProductModel from "../models/product.model.js";
import SubCategoryModel from "../models/subcategory.model.js";
import CategoryModel from "../models/category.model.js"; // <- must import
import slugify from "slugify";

// Add Product
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, stock, colors, attributes, subcategory } =
      req.body;

    // Upload images
    const imagesFiles = [];
    ["image1", "image2", "image3", "image4"].forEach((field) => {
      if (req.files[field] && req.files[field][0])
        imagesFiles.push(req.files[field][0]);
    });

    const imagesUrl = await Promise.all(
      imagesFiles.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      slug: slugify(name, { lower: true }),
      description,
      price: Number(price),
      stock: Number(stock) || 0,
      colors: colors ? JSON.parse(colors) : [],
      attributes: attributes ? JSON.parse(attributes) : [],
      images: imagesUrl,
      subcategory,
      isActive: true,
    };

    const product = new ProductModel(productData);
    await product.save();
    res.json({ success: true, message: "Product Added", product });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// List Products
export const listProducts = async (req, res) => {
  try {
    const products = await ProductModel.find().populate({
      path: "subcategory",
      populate: { path: "category" }, // nested populate
    });
    res.json({ success: true, products });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get Single Product
export const getSingleProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id)
      .populate("subcategory")
      .populate({ path: "subcategory", populate: { path: "category" } });

    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    res.json({ success: true, product });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete Product
export const removeProduct = async (req, res) => {
  try {
    await ProductModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// import { v2 as cloudinary } from "cloudinary";
// import productModel from "../models/product.model.js";

// //function for add product
// const addProduct = async (req, res) => {
//   try {
//     const { name, description, price, category, subCategory, sizes } = req.body;
//     const image1 = req.files.image1 && req.files.image1[0];
//     const image2 = req.files.image2 && req.files.image2[0];
//     const image3 = req.files.image3 && req.files.image3[0];
//     const image4 = req.files.image4 && req.files.image4[0];

//     const images = [image1, image2, image3, image4].filter(
//       (item) => item !== undefined
//     );

//     let imagesUrl = await Promise.all(
//       images.map(async (item) => {
//         let result = await cloudinary.uploader.upload(item.path, {
//           resource_type: "image",
//         });
//         return result.secure_url;
//       })
//     );

//     const productData = {
//       name,
//       description,
//       category,
//       price: Number(price),
//       subCategory,
//       sizes: JSON.parse(sizes),
//       image: imagesUrl,
//       date: Date.now(),
//     };

//     const product = new productModel(productData);
//     await product.save();

//     res.json({ success: true, message: "Product Added" });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// //function for list product
// const listProduct = async (req, res) => {
//   try {
//     const products = await productModel.find({});
//     res.json({ success: true, products });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// //function for remove product
// const removeProduct = async (req, res) => {
//   try {
//     await productModel.findByIdAndDelete(req.body.id);
//     res.json({ success: true, message: "Product Removed" });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// //function for single product info
// const singleProduct = async (req, res) => {
//   try {
//     const { productId } = req.body;
//     const product = await productModel.findById(productId);
//     res.json({ success: true, product });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

//  const getSingleProduct = async (req, res) => {
//   const productId = req.params.id;

//   try {
//     const product = await productModel.findById(productId);

//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     res.status(200).json({ product });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server Error" });
//   }
// };

// export { addProduct, listProduct, removeProduct, singleProduct,getSingleProduct };
