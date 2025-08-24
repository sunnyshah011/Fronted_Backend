import userAddress from "../models/useraddress.model.js";
import userModel from "../models/user.model.js";

//adding new address
const addProfile = async (req, res) => {
  try {
    const { userId, name, phone, province, district, city, street } = req.body;

    let address = await userAddress.findOne({ userId });

    if (address) {
      //update existing address
      address.name = name;
      address.phone = phone;
      address.province = province;
      address.district = district;
      address.city = city;
      address.street = street;
      await address.save();
      res.json({ success: true, message: "Address Updated Successfully" });
    } else {
      //create new address in db
      address = await userAddress.create({
        userId,
        name,
        phone,
        province,
        district,
        city,
        street,
      });

      //link with user
      await userModel.findByIdAndUpdate(userId, { address: address._id });
      res.json({ success: true, message: "Address added Successfully" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// GET /api/profile
const getProfile = async (req, res) => {
  try {
    const userId = req.body.userId; // from auth middleware
    const userprofiledet = await userModel.findById(userId).populate("address");

    if (!userprofiledet) {
      res
        .status(404)
        .json({ success: false, message: "User Profile not found" });
    }

    res.json({ success: true, userprofiledet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// update user address
// const updateAddress = async (req, res) => {
//   try {
//     const userId = req.body.userId; // assumed to come from auth middleware
//     const { name, phone, province, district, city, street } = req.body;

//     // Find the existing address linked to the user
//     const address = await userAddress.findOne({ userId });

//     if (!address) {
//       return res.status(404).json({ success: false, message: "Address not found" });
//     }

//     // Update only provided fields
//     if (name) address.name = name;
//     if (phone) address.phone = phone;
//     if (province) address.province = province;
//     if (district) address.district = district;
//     if (city) address.city = city;
//     if (street) address.street = street;

//     await address.save();

//     res.json({ success: true, message: "Address updated successfully" });
//   } catch (error) {
//     console.error("Error updating address:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

export { addProfile, getProfile };
