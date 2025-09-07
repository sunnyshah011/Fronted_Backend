import CategoryModel from "../models/category.model.js";
import SubCategoryModel from "../models/subcategory.model.js";
import ProductModel from "../models/product.model.js";
import slugify from "slugify";
import mongoose from "mongoose";

// Create category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = slugify(name, { lower: true });
    const category = new CategoryModel({ name, slug });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = slugify(name, { lower: true });
    const updated = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      { name, slug },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Delete category
export const deleteCategory = async (req, res) => {
  try {
    await CategoryModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//----------------------------------------------------------------------

// Create subcategory
export const createSubcategory = async (req, res) => {
  try {
    const { name, category } = req.body;
    const slug = slugify(name, { lower: true });
    const subcategory = new SubCategoryModel({ name, slug, category });
    await subcategory.save();
    res.status(201).json(subcategory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all subcategories
export const getSubcategories = async (req, res) => {
  try {
    const subcategories = await SubCategoryModel.find().populate(
      "category",
      "name"
    );
    res.json({ subcategories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Update subcategory
export const updateSubcategory = async (req, res) => {
  try {
    const { name } = req.body;
    const slug = slugify(name, { lower: true });
    const updated = await SubCategoryModel.findByIdAndUpdate(
      req.params.id,
      { name, slug },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete subcategory
export const deleteSubcategory = async (req, res) => {
  try {
    await SubCategoryModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Subcategory deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getSubcategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }
    const subcategories = await SubCategoryModel.find({ category: categoryId });
    res.json({ subcategories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// ---------------------- NEW ROUTES ----------------------

// Get category details + subcategories + products
export const getCategoryDetails = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await CategoryModel.findOne({ slug });
    if (!category) return res.json({ success: false, message: "Category not found" });

    const subcategories = await SubCategoryModel.find({ category: category._id });
    const products = await ProductModel.find({ category: category._id });

    res.json({ success: true, category, subcategories, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get subcategory details + products
export const getSubcategoryDetails = async (req, res) => {
  try {
    const { categorySlug, subSlug } = req.params;

    const category = await CategoryModel.findOne({ slug: categorySlug });
    if (!category) return res.json({ success: false, message: "Category not found" });

    const subcategory = await SubCategoryModel.findOne({
      slug: subSlug,
      category: category._id,
    });
    if (!subcategory) return res.json({ success: false, message: "Subcategory not found" });

    const products = await ProductModel.find({
      category: category._id,
      subcategory: subcategory._id,
    });

    res.json({ success: true, category, subcategory, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get single product details
export const getProductDetails = async (req, res) => {
  try {
    const { categorySlug, subSlug, productSlug } = req.params;
    console.log({ categorySlug, subSlug, productSlug });

    const category = await CategoryModel.findOne({ slug: categorySlug });
    console.log("category",category);
    if (!category) return res.json({ success: false, message: "Category not found" });

    const subcategory = await SubCategoryModel.findOne({
      slug: subSlug,
      category: category._id,
    });
    console.log("subcategory",subcategory);
    if (!subcategory) return res.json({ success: false, message: "Subcategory not found" });

    const product = await ProductModel.findOne({
      slug: productSlug,
      category: category._id,
      subcategory: subcategory._id,
    });
    console.log("product",product);
    if (!product) return res.json({ success: false, message: "Product not found" });

    res.json({ success: true, product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
