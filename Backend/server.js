import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";
import bodyParser from "body-parser";
import cartRouter from "./routes/cart.route.js";
import userAddress from "./routes/address.route.js";
import orderRouter from "./routes/order.route.js";
import locationrRouter from "./routes/location.route.js";
import categoryRouter from "./routes/category.route.js";
import subCategoryRouter from "./routes/subcategory.route.js";

//App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

//middlewares
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//api endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/profile", userAddress);
app.use("/api/order", orderRouter);
app.use("/api/location", locationrRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/subcategories", subCategoryRouter);

app.listen(port, () => {
  console.log("server started on :: ", port);
});
