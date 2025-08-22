import userprofile from "../models/userprofile.model.js";
import userModel from "../models/user.model.js";

//adding new address
const addProfile = async (req, res) => {
  try {
    const { userId, name, phone, province, district, city, street } = req.body;
    console.log(userId);

    let address = await userprofile.findOne({ userModel: userId });

    if (address) {
      //update existing address
      address.name = name;
      address.phone = phone;
      address.province = province;
      address.district = district;
      address.city = city;
      address.street = street;
      await address.save();
    } else {
      //create new address in db
      address = await userprofile.create({
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
    }

    res.json({ success: true, message: "Address added Successfully" });
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
    console.log(userprofiledet);
    

    if (!userprofiledet) {
      res.status(404).json({ success: false, message: "User Profile not found" });
    }

    res.json({ success: true, userprofiledet });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export { addProfile, getProfile };
