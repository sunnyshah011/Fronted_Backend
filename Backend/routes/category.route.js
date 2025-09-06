import express from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getCategoryDetails,
  getSubcategoryDetails,
  getProductDetails,
} from "../controllers/category.controller.js";
import adminAuth from "../middleware/adminAuth.middleware.js";

const categoryRouter = express.Router();

categoryRouter.post("/", adminAuth, createCategory);
categoryRouter.put("/:id", adminAuth, updateCategory);
categoryRouter.delete("/:id", adminAuth, deleteCategory);

//category routs
categoryRouter.get("/", getCategories);

// Category details + subcategories
categoryRouter.get("/:slug", getCategoryDetails);

// Subcategory details + products
categoryRouter.get("/:categorySlug/:subSlug", getSubcategoryDetails);

// Product details inside subcategory
categoryRouter.get("/:categorySlug/:subSlug/:productSlug", getProductDetails);

export default categoryRouter;
