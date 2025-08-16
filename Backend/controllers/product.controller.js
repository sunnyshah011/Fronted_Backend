// //function for add product
// const addProduct = async (req, res) => {
//     try {
//         const { name, description, price, category, subCategory, sizes } = req.body
//         const image1 = req.files.image1[0]
//         const image2 = req.files.image2[0]
//         const image3 = req.files.image3[0]
//         const image4 = req.files.image4[0]

//         console.log(name, description, price, category, subCategory, sizes);
//         console.log(image1, image2, image3, image4);

//         res.json({})

//     } catch (error) {
//         res.json({ success: false, message: error.message })
//     }
// }

// //function for list product
// const listProduct = async (req, res) => {

// }


// //function for remove product
// const removeProduct = async (req, res) => {

// }


// //function for single product info
// const singleProduct = async (req, res) => {

// }

// export { addProduct, listProduct, removeProduct, singleProduct }


// controllers/product.controller.js

import productModel from '../models/productModel.js'

export const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subCategory, sizes } = req.body

        // Validate images
        const getFile = (field) => req.files?.[field]?.[0]?.filename
        const images = [
            getFile("image1"),
            getFile("image2"),
            getFile("image3"),
            getFile("image4")
        ]

        if (images.some(img => !img)) {
            return res.status(400).json({ success: false, message: "All 4 images are required" })
        }

        // Parse sizes if it's sent as JSON string
        const parsedSizes = typeof sizes === "string" ? JSON.parse(sizes) : sizes

        const newProduct = new productModel({
            name,
            description,
            price,
            image: images,
            category,
            subCategory,
            sizes: parsedSizes,
            date: Date.now()
        })

        await newProduct.save()

        res.status(201).json({ success: true, message: "Product added successfully", product: newProduct })

    } catch (error) {
        console.error("Add Product Error:", error)
        res.status(500).json({ success: false, message: error.message })
    }
}

// Placeholder exports for others if needed
export const listProduct = (req, res) => { }
export const removeProduct = (req, res) => { }
export const singleProduct = (req, res) => { }
