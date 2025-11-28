import express from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getCategoryDetails,
  // getSubcategoryDetails,
  getProductDetails,
  getSubcategoriesByCategory
} from "../controllers/category.controller.js";
import upload from "../middleware/multer.middleware.js";
import adminAuth from "../middleware/adminAuth.middleware.js";

const categoryRouter = express.Router();

categoryRouter.post("/", adminAuth, upload.single("image"), createCategory);
categoryRouter.put("/:id", adminAuth, upload.single("image"), updateCategory);
categoryRouter.delete("/:id", adminAuth, deleteCategory);

//category routs
categoryRouter.get("/", getCategories); // gives all category

// Get subcategories by category ID  ✅ FIXED
categoryRouter.get("/subcategories/:categoryId", getSubcategoriesByCategory);

// Category details + subcategories
categoryRouter.get("/:slug", getCategoryDetails); // subcategory with its product rod -> lucana -> lucana force 6ft

// Product details inside subcategory
categoryRouter.get("/:categorySlug/:productSlug", getProductDetails);


export default categoryRouter;
