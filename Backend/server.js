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
import paymentMethods from "./routes/paymentMethods.route.js";

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

// Redirect all other domains to primary domain
app.use((req, res, next) => {
  const primaryDomain = "fishingtacklestore.com.np";
  
  // Check if the current host is NOT the primary
  if (req.hostname !== primaryDomain) {
    // Permanent redirect (301) preserving the path
    return res.redirect(301, `https://${primaryDomain}${req.originalUrl}`);
  }

  next();
});

app.get("/health", (req, res) => {
  res.status(200).send("Ok");
});

//api endpoints
app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/profile", userAddress);
app.use("/api/order", orderRouter);
app.use("/api/location", locationrRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/subcategories", subCategoryRouter);
app.use("/api/paymentmethods", paymentMethods);

app.listen(port, () => {
  console.log("server started on :: ", port);
});
