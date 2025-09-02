import express from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getSubcategoriesByCategory,
} from "../controllers/category.controller.js";
import adminAuth from "../middleware/adminAuth.middleware.js";

const categoryRouter = express.Router();

//category routs
categoryRouter.get("/", getCategories);
categoryRouter.post("/", adminAuth, createCategory);
categoryRouter.put("/:id", adminAuth, updateCategory);
categoryRouter.delete("/:id", adminAuth, deleteCategory);

// Get subcategories of a category
categoryRouter.get("/:categoryId/subcategories", getSubcategoriesByCategory);

export default categoryRouter;
