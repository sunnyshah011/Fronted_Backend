// import userModel from "../models/user.model.js";

// //add to cart
// const addToCart = async (req, res) => {
//   try {
//     const { itemId, size } = req.body;
//     const userId = req.userId;

//     const userData = await userModel.findById(userId);
//     let cartData = await userData.category;

//     if (cartData[itemId]) {
//       if (cartData[itemId][size]) {
//         cartData[itemId][size] += 1;
//       } else {
//         cartData[itemId][size] = 1;
//       }
//     } else {
//       cartData[itemId] = {};
//       cartData[itemId][size] = 1;
//     }

//     await userModel.findByIdAndUpdate(userId, { category: cartData });
//     res.json({ success: true, message: "Added To Cart" });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: "from cart controller" });
//   }
// };

// //update cart
// const updateCart = async (req, res) => {
//   try {
//     const { itemId, size, quantity } = req.body;
//     const userId = req.userId;

//     const userData = await userModel.findById(userId);
//     let cartData = await userData.category;

//     cartData[itemId][size] = quantity;

//     await userModel.findByIdAndUpdate(userId, { category: cartData });
//     res.json({ success: true, message: "Cart Updated" });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// //getuser cart
// const getUserCart = async (req, res) => {
//   try {
//     const userId = req.userId;

//     const userData = await userModel.findById(userId);
//     let cartData = await userData.category;

//     res.json({ success: true, cartData });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// export { addToCart, updateCart, getUserCart };




import userModel from "../models/user.model.js";

// Add to cart
const addToCart = async (req, res) => {
  try {
    const { itemId, size } = req.body;
    const userId = req.userId;

    if (!itemId || !size) {
      return res.status(400).json({ success: false, message: "Missing itemId or size" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.category || {}; // fallback if null

    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    cartData[itemId][size] = (cartData[itemId][size] || 0) + 1;

    await userModel.findByIdAndUpdate(userId, { category: cartData });

    return res.status(200).json({ success: true, message: "Added To Cart" });

  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
};

// Update cart
const updateCart = async (req, res) => {
  try {
    const { itemId, size, quantity } = req.body;
    const userId = req.userId;

    if (!itemId || !size || typeof quantity !== "number") {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.category || {};

    if (quantity <= 0) {
      if (cartData[itemId] && cartData[itemId][size]) {
        delete cartData[itemId][size];
        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      }
    } else {
      if (!cartData[itemId]) cartData[itemId] = {};
      cartData[itemId][size] = quantity;
    }

    await userModel.findByIdAndUpdate(userId, { category: cartData });

    return res.status(200).json({ success: true, message: "Cart Updated" });

  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
};

// Get user cart
const getUserCart = async (req, res) => {
  try {
    const userId = req.userId;

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.category || {};

    return res.status(200).json({ success: true, cartData });

  } catch (error) {
    console.error(error);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
};

export { addToCart, updateCart, getUserCart };
