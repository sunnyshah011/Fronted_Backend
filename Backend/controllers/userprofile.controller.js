import userAddress from "../models/useraddress.model.js";
import userModel from "../models/user.model.js";

// // ✅ Add or Update Address
// const addProfile = async (req, res) => {
//   try {
//     const { name, phone, province, district, city, street } = req.body;
//     const userId = req.userId;

//     let address = await userAddress.findOne({ userId });

//     if (address) {
//       // Update existing address
//       address.name = name;
//       address.phone = phone;
//       address.province = province;
//       address.district = district;
//       address.city = city;
//       address.street = street;

//       await address.save();
//       return res.status(200).json({ success: true, message: "Address Updated Successfully" });
//     } else {
//       // Create new address
//       address = await userAddress.create({
//         userId,
//         name,
//         phone,
//         province,
//         district,
//         city,
//         street,
//       });

//       // Link new address to user
//       await userModel.findByIdAndUpdate(userId, { address: address._id });

//       return res.status(200).json({ success: true, message: "Address added Successfully" });
//     }
//   } catch (error) {
//     console.error("Error in addProfile:", error);
//     if (!res.headersSent) {
//       return res.status(500).json({ success: false, message: error.message });
//     }
//   }
// };

const addProfile = async (req, res) => {
  try {
    let { name, phone, province, district, city, street } = req.body;
    const userId = req.userId;

    // Convert everything to string before trimming
    name = String(name || "").trim();
    phone = String(phone || "").trim();
    province = String(province || "").trim();
    district = String(district || "").trim();
    city = String(city || "").trim();
    street = String(street || "").trim();

    // Validate empty or only-space inputs
    if (!name || !province || !district || !city || !street) {
      return res.status(400).json({
        success: false,
        message: "All address fields are required and cannot be blank spaces.",
      });
    }

    let address = await userAddress.findOne({ userId });

    if (address) {
      address.name = name;
      address.phone = phone;
      address.province = province;
      address.district = district;
      address.city = city;
      address.street = street;

      await address.save();
      return res
        .status(200)
        .json({ success: true, message: "Address Updated Successfully" });
    } else {
      address = await userAddress.create({
        userId,
        name,
        phone,
        province,
        district,
        city,
        street,
      });

      await userModel.findByIdAndUpdate(userId, { address: address._id });

      return res
        .status(200)
        .json({ success: true, message: "Address added Successfully" });
    }
  } catch (error) {
    console.error("Error in addProfile:", error);
    if (!res.headersSent) {
      return res
        .status(500)
        .json({ success: false, message: error.message });
    }
  }
};


// ✅ Get User Profile with Address
const getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    const userprofiledet = await userModel.findById(userId).populate("address");

    if (!userprofiledet) {
      return res.status(404).json({ success: false, message: "User Profile not found" });
    }

    return res.status(200).json({ success: true, userprofiledet });
  } catch (error) {
    console.error("Error in getProfile:", error);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

export { addProfile, getProfile };
