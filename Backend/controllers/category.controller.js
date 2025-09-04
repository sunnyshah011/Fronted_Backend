import CategoryModel from "../models/category.model.js";
import SubCategoryModel from "../models/subcategory.model.js";
import slugify from "slugify";
import mongoose from 'mongoose'

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
    res.json({categories});
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.json({subcategories});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get subcategories of a category
export const getSubcategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const subcategories = await SubCategoryModel.find({ category: categoryId });
    res.json({ subcategories }); // return as object to match frontend
  } catch (err) {
    console.error(err); // log error
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
