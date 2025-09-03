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
    const { itemId, size, color, quantity = 1 } = req.body;
    const userId = req.userId;

    if (!itemId || !size || !color) {
      return res.status(400).json({ success: false, message: "Missing itemId, size or color" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.category || {}; // fallback if null

    // Ensure itemId exists
    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }

    // Ensure size exists
    if (!cartData[itemId][size]) {
      cartData[itemId][size] = {};
    }

    // Ensure color exists and add quantity
    cartData[itemId][size][color] = (Number(cartData[itemId][size][color]) || 0) + Number(quantity);

    await userModel.findByIdAndUpdate(userId, { category: cartData });

    return res.status(200).json({ success: true, message: "Added To Cart", cartData });

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
    const { itemId, size, color, quantity } = req.body;
    const userId = req.userId;

    if (!itemId || !size || !color || typeof quantity !== "number") {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let cartData = userData.category || {};

    if (quantity <= 0) {
      if (cartData[itemId] && cartData[itemId][size] && cartData[itemId][size][color]) {
        delete cartData[itemId][size][color];

        // clean empty objects
        if (Object.keys(cartData[itemId][size]).length === 0) {
          delete cartData[itemId][size];
        }
        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      }
    } else {
      if (!cartData[itemId]) cartData[itemId] = {};
      if (!cartData[itemId][size]) cartData[itemId][size] = {};
      cartData[itemId][size][color] = Number(quantity);
    }

    await userModel.findByIdAndUpdate(userId, { category: cartData });

    return res.status(200).json({ success: true, message: "Cart Updated", cartData });

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
