import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/user.route.js";
import productRouter from "./routes/product.route.js";

//App Config
const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectCloudinary();

//middlewares
app.use(express.json());
app.use(cors());

//api endpoints
app.use('/api/user', userRouter)
app.use('/api/product',productRouter)

app.get("/", (req, res) => {
  res.send("API");
});

app.listen(port, () => {
  console.log("server started on :: ", port);
});



// import express from 'express'
// import mongoose from 'mongoose'
// import productRouter from './routes/product.routes.js'
// import cors from 'cors'
// import bodyParser from 'body-parser'

// const app = express()

// // Middleware
// app.use(cors())
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))

// // Serve uploaded files statically
// app.use('/uploads', express.static('uploads'))

// // Routes
// app.use('/api/product', productRouter)

// // DB and Server
// mongoose.connect('mongodb://localhost:27017/myshop')
//   .then(() => {
//     console.log("MongoDB connected")
//     app.listen(5000, () => console.log("Server running on http://localhost:5000"))
//   })
//   .catch(err => console.error("MongoDB error:", err))
