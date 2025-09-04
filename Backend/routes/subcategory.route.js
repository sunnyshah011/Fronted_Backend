import express from "express";
import {
  createSubcategory,
  getSubcategoriesByCategory,
  updateSubcategory,
  deleteSubcategory,
} from "../controllers/category.controller.js";
import adminAuth from "../middleware/adminAuth.middleware.js";

const subCategoryRouter = express.Router();

// Get subcategories of a category
subCategoryRouter.get("/category/:categoryId", getSubcategoriesByCategory);
subCategoryRouter.post("/", adminAuth, createSubcategory);
subCategoryRouter.put("/:id", adminAuth, updateSubcategory);
subCategoryRouter.delete("/:id", adminAuth, deleteSubcategory);

export default subCategoryRouter;
