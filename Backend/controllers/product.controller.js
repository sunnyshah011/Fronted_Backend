import { v2 as cloudinary } from "cloudinary";
import ProductModel from "../models/product.model.js";
import slugify from "slugify";
import SubCategoryModel from "../models/subcategory.model.js";
import sharp from "sharp";
import fs from "fs";

// ------------------------------------------------------
// 🟢 Helper: compress image with Sharp & upload to Cloudinary
// ------------------------------------------------------
const uploadCompressedImage = async (filePath) => {
  // 1️⃣ Compress to WebP buffer
  const buffer = await sharp(filePath)
    .resize(1000, 1000, { fit: "inside" }) // safe max size
    .webp({ quality: 90 }) // adjust if needed
    .toBuffer();

  // 2️⃣ Upload buffer to Cloudinary
  const uploadResult = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { format: "webp" }, // stored as webp
        (err, result) => (err ? reject(err) : resolve(result))
      )
      .end(buffer);
  });

  // 3️⃣ Delete temporary file
  fs.unlink(filePath, () => {});

  return uploadResult.secure_url;
};

// Add Product
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      subcategory,
      variants,
      isTopProduct,
      isBestSelling,
      isFlashSale,
      deliveryCharge,
      discountedPrice,
      isActive,
    } = req.body;

    if (!name || !subcategory) {
      return res
        .status(400)
        .json({ success: false, message: "Name and subcategory required" });
    }

    if (deliveryCharge && Number(deliveryCharge) < 150) {
      return res.status(400).json({
        success: false,
        message: "Delivery charge must be at least Rs.150",
      });
    }

    // Prevent duplicate product by slug
    const slug = slugify(name, { lower: true });
    const existing = await ProductModel.findOne({ slug });
    if (existing)
      return res
        .status(400)
        .json({ success: false, message: "Product already exists" });

    // 🔹 Get category from subcategory
    const subcat = await SubCategoryModel.findById(subcategory).populate(
      "category"
    );
    if (!subcat) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid subcategory" });
    }

    const category = subcat.category; // category id from subcategory

    // Upload images to Cloudinary (convert to WebP)
    const imagesFiles = [];
    ["image1", "image2", "image3", "image4"].forEach((field) => {
      if (req.files[field] && req.files[field][0])
        imagesFiles.push(req.files[field][0]);
    });

    // const imagesUrl = await Promise.all(
    //   imagesFiles.map(async (file) => {
    //     const result = await cloudinary.uploader.upload(file.path, {
    //       resource_type: "image",
    //       format: "webp", // Convert to WebP
    //       quality: "auto", // Compress image
    //       fetch_format: "auto",
    //       flags: "lossy",
    //       max_bytes: 200000   // <= 200 KB
    //     });
    //     return result.secure_url;
    //   })
    // );

    // 🔹 Upload with compression
    const imagesUrl = await Promise.all(
      imagesFiles.map(async (file) => await uploadCompressedImage(file.path))
    );

    const parsedVariants = variants ? JSON.parse(variants) : [];
    const totalStock = parsedVariants.reduce(
      (acc, v) => acc + (v.stock || 0),
      0
    );

    const productData = {
      name,
      slug,
      description,
      variants: parsedVariants,
      stock: totalStock,
      images: imagesUrl,
      category, // ✅ now category is set
      subcategory,
      isActive:
        typeof isActive !== "undefined"
          ? isActive === "true" || isActive === true
          : true,
      isTopProduct: isTopProduct === "true" || isTopProduct === true,
      isBestSelling: isBestSelling === "true" || isBestSelling === true,
      isFlashSale: isFlashSale === "true" || isFlashSale === true,
      deliveryCharge: deliveryCharge ? Number(deliveryCharge) : 150, // ✅ enforce default
      discountedPrice: discountedPrice ? Number(discountedPrice) : 0,
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
      discountedPrice,
      isActive,
    } = req.body;

    const product = await ProductModel.findById(id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    /* ------------------------------------------------------
      🔥 IF SUBCATEGORY IS UPDATED → UPDATE CATEGORY ALSO
   ------------------------------------------------------ */
    if (subcategory) {
      const newSubcat = await SubCategoryModel.findById(subcategory).populate(
        "category"
      );
      if (!newSubcat)
        return res
          .status(400)
          .json({ success: false, message: "Invalid subcategory" });

      product.subcategory = subcategory;
      product.category = newSubcat.category._id; // 🔥 auto update category
    }

    // // Handle images (compressed on update also)
    // const finalImages = [];
    // for (let i = 0; i < 4; i++) {
    //   const field = `image${i + 1}`;

    //   if (req.files && req.files[field] && req.files[field][0]) {
    //     // 🔥 SAME compression as Add Product
    //     const result = await cloudinary.uploader.upload(
    //       req.files[field][0].path,
    //       {
    //         resource_type: "image",
    //         format: "webp",
    //         quality: "auto",
    //         fetch_format: "auto",
    //         flags: "lossy",
    //         max_bytes: 200000, // <= 200 KB
    //       }
    //     );
    //     finalImages.push(result.secure_url);
    //   } else if (req.body[`existing_${field}`]) {
    //     finalImages.push(req.body[`existing_${field}`]);
    //   } else if (product.images[i]) {
    //     finalImages.push(product.images[i]);
    //   }
    // }

    // 🔥 Handle image update (compress new ones)
    const finalImages = [];
    for (let i = 0; i < 4; i++) {
      const field = `image${i + 1}`;

      if (req.files && req.files[field] && req.files[field][0]) {
        // New image → compress
        const uploadUrl = await uploadCompressedImage(req.files[field][0].path);
        finalImages.push(uploadUrl);
      } else if (req.body[`existing_${field}`]) {
        // Keep old image (sent by frontend)
        finalImages.push(req.body[`existing_${field}`]);
      } else if (product.images[i]) {
        // Keep existing in DB
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
    product.discountedPrice =
      typeof discountedPrice !== "undefined"
        ? Number(discountedPrice)
        : product.discountedPrice;
    product.isActive =
      typeof isActive !== "undefined"
        ? isActive === "true" || isActive === true
        : product.isActive;

    await product.save();
    res.json({ success: true, message: "Product Updated", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

// controllers/product.controller.js
export const listProducts = async (req, res) => {
  try {
    const products = await ProductModel.find({ isActive: true })
      .populate("subcategory", "slug category")
      .populate({
        path: "subcategory",
        populate: { path: "category", select: "slug" },
      });

    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const listProductsAdmin = async (req, res) => {
  try {
    const products = await ProductModel.find()
      .populate("subcategory", "slug category")
      .populate({
        path: "subcategory",
        populate: { path: "category", select: "slug" },
      });

    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

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
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch product" });
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

/* ----------------------------------------
   🟢 Get Top Products
---------------------------------------- */
export const getTopProducts = async (req, res) => {
  try {
    const products = await ProductModel.find({
      isTopProduct: true,
      isActive: true,
    })
      .populate({
        path: "subcategory",
        populate: { path: "category" },
      })
      .limit(6)
      .sort({ createdAt: -1 }); // sort newest → oldest

    res.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching top products:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch top products" });
  }
};

/* ----------------------------------------
   🔴 Get Flash Sale Products
---------------------------------------- */
export const getFlashSaleProducts = async (req, res) => {
  try {
    const products = await ProductModel.find({
      isFlashSale: true,
      isActive: true,
    })
      .populate({
        path: "subcategory",
        populate: { path: "category" },
      })
      .limit(6);

    res.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching flash sale products:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch flash sale products" });
  }
};

export const getTop30Products = async (req, res) => {
  try {
    const products = await ProductModel.find({ isActive: true })
      .sort({ isBestSelling: -1, createdAt: -1 }) // best-selling first, then newest
      .limit(30)
      .populate({ path: "subcategory", populate: { path: "category" } })
      .lean();

    res.json({
      success: true,
      products,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch top products",
    });
  }
};

// Toggle Product Active / Inactive (simple quick toggle)
export const toggleActive = async (req, res) => {
  try {
    const { id, isActive } = req.body;

    if (!id)
      return res
        .status(400)
        .json({ success: false, message: "Product ID required" });

    const product = await ProductModel.findById(id);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    const newState = isActive === "true" || isActive === true ? true : false;

    product.isActive = newState;
    await product.save();

    res.json({
      success: true,
      message: `Product ${newState ? "Activated" : "Deactivated"} successfully`,
      product,
    });
  } catch (err) {
    console.error("toggleActive Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// import sharp from "sharp";
// import fs from "fs";

// // Helper: compress and upload image
// const uploadCompressedImage = async (filePath) => {
//   const buffer = await sharp(filePath)
//     .resize(600, 600, { fit: "inside" }) // max width/height
//     .webp({ quality: 30 })               // aggressive compression
//     .toBuffer();

//   const uploadResult = await new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       { resource_type: "image" },
//       (err, result) => (err ? reject(err) : resolve(result))
//     );
//     stream.end(buffer);
//   });

//   // Remove temporary local file
//   fs.unlink(filePath, () => {});

//   return uploadResult.secure_url;
// };
