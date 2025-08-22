import userModel from "../models/user.model.js"

//add to cart
const addToCart = async (req,res) => {
    try {
        const { userId, itemId, size } = req.body

         console.log("Incoming userId:", userId);
        
        const userData = await userModel.findById(userId)
        let cartData = await userData.category

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1
            } else {
                cartData[itemId][size] = 1
            }
        } else {
            cartData[itemId] = {}
            cartData[itemId][size] = 1
        }

        await userModel.findByIdAndUpdate(userId, { category: cartData })
        res.json({ success: true, message: "Added To Cart" })

    } catch (error) {
        console.log(error);
        res.json({ success: false, message:"from cart controller" })
    }
}


//update cart
const updateCart = async (req,res) => {
    try {

        const { userId, itemId, size, quantity } = req.body

        const userData = await userModel.findById(userId)
        let cartData = await userData.category

        cartData[itemId][size] = quantity

        await userModel.findByIdAndUpdate(userId, { category: cartData })
        res.json({ success: true, message: "Cart Updated" })


    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

//getuser cart
const getUserCart = async (req,res) => {
    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId)
        let cartData = await userData.category
        
        res.json({ success: true, cartData })
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

export { addToCart, updateCart, getUserCart }