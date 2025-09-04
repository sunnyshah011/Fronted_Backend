import { v2 as cloudinary } from "cloudinary";
import ProductModel from "../models/product.model.js";
import slugify from "slugify";

// Add Product
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      subcategory,
      variants, // array of { color, size, stock, price }
      isTopProduct,
      isBestSelling,
      isFlashSale,
    } = req.body;

    if (!name || !subcategory) {
      return res
        .status(400)
        .json({ success: false, message: "Name and subcategory required" });
    }

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

    const parsedVariants = variants ? JSON.parse(variants) : [];
    const totalStock = parsedVariants.reduce(
      (acc, v) => acc + (v.stock || 0),
      0
    );

    const productData = {
      name,
      slug: slugify(name, { lower: true }),
      description,
      variants: parsedVariants,
      stock: totalStock,
      images: imagesUrl,
      subcategory,
      isActive: true,
      isTopProduct: isTopProduct === "true" || isTopProduct === true,
      isBestSelling: isBestSelling === "true" || isBestSelling === true,
      isFlashSale: isFlashSale === "true" || isFlashSale === true,
    };

    const product = new ProductModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const {
      id,
      name,
      description,
      subcategory,
      variants,
      isTopProduct,
      isBestSelling,
      isFlashSale,
    } = req.body;

    const product = await ProductModel.findById(id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    // Handle images: preserve old, replace selectively
    const finalImages = [];
    for (let i = 0; i < 4; i++) {
      const field = `image${i + 1}`;
      if (req.files && req.files[field] && req.files[field][0]) {
        const result = await cloudinary.uploader.upload(
          req.files[field][0].path,
          { resource_type: "image" }
        );
        finalImages.push(result.secure_url);
      } else if (req.body[`existing_${field}`]) {
        finalImages.push(req.body[`existing_${field}`]);
      } else if (product.images[i]) {
        finalImages.push(product.images[i]);
      }
    }

    const parsedVariants = variants ? JSON.parse(variants) : product.variants;
    const totalStock = parsedVariants.reduce(
      (acc, v) => acc + (v.stock || 0),
      0
    );

    // Update fields
    product.name = name || product.name;
    product.slug = name ? slugify(name, { lower: true }) : product.slug;
    product.description = description || product.description;
    product.subcategory = subcategory || product.subcategory;
    product.variants = parsedVariants;
    product.stock = totalStock;
    product.images = finalImages;
    product.isTopProduct =
      typeof isTopProduct !== "undefined"
        ? isTopProduct === "true" || isTopProduct === true
        : product.isTopProduct;
    product.isBestSelling =
      typeof isBestSelling !== "undefined"
        ? isBestSelling === "true" || isBestSelling === true
        : product.isBestSelling;
    product.isFlashSale =
      typeof isFlashSale !== "undefined"
        ? isFlashSale === "true" || isFlashSale === true
        : product.isFlashSale;

    await product.save();
    res.json({ success: true, message: "Product Updated", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// List Products
export const listProducts = async (req, res) => {
  try {
    const products = await ProductModel.find().populate({
      path: "subcategory",
      populate: { path: "category" },
    });
    res.json({ success: true, products });
  } catch (err) {
    console.error(err);
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
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// Delete Product
export const removeProduct = async (req, res) => {
  try {
    await ProductModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
