// import PaymentMethod from "../models/PaymentMethods.model.js";

// // ✅ Fetch all payment methods
// export const getPaymentMethods = async (req, res) => {
//   try {
//     const methods = await PaymentMethod.find();
//     res.json({ success: true, methods });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ✅ Add a new payment method
// export const addPaymentMethod = async (req, res) => {
//   try {
//     const { name, title, accountNumber } = req.body;
//     if (!req.file)
//       return res
//         .status(400)
//         .json({ success: false, message: "Image is required" });

//     const newMethod = new PaymentMethod({
//       name,
//       title,
//       accountNumber,
//       image: req.file.path, // multer stores the path
//     });

//     await newMethod.save();
//     res.json({ success: true, method: newMethod });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ✅ Update a payment method
// export const updatePaymentMethod = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name, title, accountNumber } = req.body;

//     const updateData = { name, title, accountNumber };
//     if (req.file) updateData.image = req.file.path;

//     const updatedMethod = await PaymentMethod.findByIdAndUpdate(
//       id,
//       updateData,
//       { new: true }
//     );
//     if (!updatedMethod)
//       return res
//         .status(404)
//         .json({ success: false, message: "Method not found" });

//     res.json({ success: true, method: updatedMethod });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };

// // ✅ Delete a payment method
// export const deletePaymentMethod = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleted = await PaymentMethod.findByIdAndDelete(id);
//     if (!deleted)
//       return res
//         .status(404)
//         .json({ success: false, message: "Method not found" });

//     res.json({ success: true, message: "Payment method deleted" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };



import { v2 as cloudinary } from "cloudinary";
import PaymentMethod from "../models/PaymentMethods.model.js";

// ✅ Fetch all payment methods
export const getPaymentMethods = async (req, res) => {
  try {
    const methods = await PaymentMethod.find();
    res.json({ success: true, methods });
  } catch (err) {
    console.error("Error fetching payment methods:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Add a new payment method (with Cloudinary image upload)
export const addPaymentMethod = async (req, res) => {
  try {
    const { name, title, accountNumber } = req.body;

    if (!name || !title || !accountNumber) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, title, accountNumber) are required",
      });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Image is required" });
    }

    // 🔹 Upload image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "image",
      format: "webp", // Convert to WebP
      quality: "auto",
      fetch_format: "auto",
    });

    const newMethod = new PaymentMethod({
      name,
      title,
      accountNumber,
      image: uploadedImage.secure_url, // Store Cloudinary URL
    });

    await newMethod.save();
    res.json({
      success: true,
      message: "Payment method added successfully",
      method: newMethod,
    });
  } catch (err) {
    console.error("Error adding payment method:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Update a payment method
export const updatePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, title, accountNumber } = req.body;

    const existing = await PaymentMethod.findById(id);
    if (!existing) {
      return res
        .status(404)
        .json({ success: false, message: "Payment method not found" });
    }

    let imageUrl = existing.image;

    // 🔹 If new image uploaded, replace on Cloudinary
    if (req.file) {
      const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        resource_type: "image",
        format: "webp",
        quality: "auto",
        fetch_format: "auto",
      });
      imageUrl = uploadedImage.secure_url;
    }

    existing.name = name || existing.name;
    existing.title = title || existing.title;
    existing.accountNumber = accountNumber || existing.accountNumber;
    existing.image = imageUrl;

    await existing.save();

    res.json({
      success: true,
      message: "Payment method updated successfully",
      method: existing,
    });
  } catch (err) {
    console.error("Error updating payment method:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Delete a payment method
export const deletePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await PaymentMethod.findByIdAndDelete(id);

    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "Payment method not found" });

    res.json({ success: true, message: "Payment method deleted successfully" });
  } catch (err) {
    console.error("Error deleting payment method:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
