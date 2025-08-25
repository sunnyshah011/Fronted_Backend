import express from 'express'
import { addProduct, listProduct, removeProduct, singleProduct,getSingleProduct } from '../controllers/product.controller.js'
import upload from '../middleware/multer.middleware.js'
import adminAuth from '../middleware/adminAuth.middleware.js'

const productRouter = express.Router()

productRouter.post('/add',adminAuth,upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }]),
    addProduct)
productRouter.post('/remove',adminAuth,removeProduct)
productRouter.post('/single', singleProduct)
productRouter.get('/list', listProduct)

// Route to get a single product by ID
productRouter.get("/single/:id", getSingleProduct);


export default productRouter