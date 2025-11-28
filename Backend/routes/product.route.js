import express from "express";
import {
  addProduct,
  listProducts,
  getSingleProduct,
  removeProduct,
  updateProduct,
  getTopProducts,
  getFlashSaleProducts,
  getTop30Products,
  toggleActive,
  listProductsAdmin
} from "../controllers/product.controller.js";
import upload from "../middleware/multer.middleware.js";
import adminAuth from "../middleware/adminAuth.middleware.js";

const productRouter = express.Router();

productRouter.post(
  "/add",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProduct
);

productRouter.post(
  "/update",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  updateProduct
);

productRouter.post("/remove", adminAuth, removeProduct);
productRouter.get("/list", listProducts);
productRouter.get("/list-admin", listProductsAdmin);
productRouter.get("/single/:id", getSingleProduct);

// ✅ Product type routes
productRouter.get("/top-products", getTopProducts);
productRouter.get("/flash-sale", getFlashSaleProducts);
productRouter.get("/top-30-products", getTop30Products);

productRouter.post("/toggle-active", adminAuth, toggleActive);


export default productRouter;
