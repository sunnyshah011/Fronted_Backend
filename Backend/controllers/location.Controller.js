// controllers/locationController.js
import Province from "../models/location.model.js";

/* -------------------- PROVINCES -------------------- */
// ✅ Add Province
export const addProvince = async (req, res) => {
  try {
    const { province } = req.body;
    if (!province) return res.status(400).json({ message: "Province required" });

    const newProvince = new Province({ name: province, districts: [] });
    await newProvince.save();
    res.json({ success: true, province: newProvince });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Edit Province
export const editProvince = async (req, res) => {
  try {
    const { provinceName } = req.params;
    const { newName } = req.body;

    const province = await Province.findOne({ name: provinceName });
    if (!province) return res.status(404).json({ message: "Province not found" });

    province.name = newName;
    await province.save();

    res.json({ success: true, province });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete Province
export const deleteProvince = async (req, res) => {
  try {
    const { provinceName } = req.params;
    const province = await Province.findOneAndDelete({ name: provinceName });
    if (!province) return res.status(404).json({ message: "Province not found" });

    res.json({ success: true, message: "Province deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* -------------------- DISTRICTS -------------------- */
// ✅ Add District
export const addDistrict = async (req, res) => {
  try {
    const { provinceName } = req.params;
    const { district } = req.body;

    const province = await Province.findOne({ name: provinceName });
    if (!province) return res.status(404).json({ message: "Province not found" });

    province.districts.push({ name: district, cities: [] });
    await province.save();

    res.json({ success: true, province });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Edit District
export const editDistrict = async (req, res) => {
  try {
    const { provinceName, districtName } = req.params;
    const { newName } = req.body;

    const province = await Province.findOne({ name: provinceName });
    if (!province) return res.status(404).json({ message: "Province not found" });

    const district = province.districts.find((d) => d.name === districtName);
    if (!district) return res.status(404).json({ message: "District not found" });

    district.name = newName;
    await province.save();

    res.json({ success: true, province });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete District
export const deleteDistrict = async (req, res) => {
  try {
    const { provinceName, districtName } = req.params;

    const province = await Province.findOne({ name: provinceName });
    if (!province) return res.status(404).json({ message: "Province not found" });

    province.districts = province.districts.filter((d) => d.name !== districtName);
    await province.save();

    res.json({ success: true, message: "District deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* -------------------- CITIES -------------------- */
// ✅ Add City
export const addCity = async (req, res) => {
  try {
    const { provinceName, districtName } = req.params;
    const { city } = req.body;

    const province = await Province.findOne({ name: provinceName });
    if (!province) return res.status(404).json({ message: "Province not found" });

    const district = province.districts.find((d) => d.name === districtName);
    if (!district) return res.status(404).json({ message: "District not found" });

    district.cities.push({ name: city });
    await province.save();

    res.json({ success: true, province });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Edit City
export const editCity = async (req, res) => {
  try {
    const { provinceName, districtName, cityName } = req.params;
    const { newName } = req.body;

    const province = await Province.findOne({ name: provinceName });
    if (!province) return res.status(404).json({ message: "Province not found" });

    const district = province.districts.find((d) => d.name === districtName);
    if (!district) return res.status(404).json({ message: "District not found" });

    const city = district.cities.find((c) => c.name === cityName);
    if (!city) return res.status(404).json({ message: "City not found" });

    city.name = newName;
    await province.save();

    res.json({ success: true, province });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Delete City
export const deleteCity = async (req, res) => {
  try {
    const { provinceName, districtName, cityName } = req.params;

    const province = await Province.findOne({ name: provinceName });
    if (!province) return res.status(404).json({ message: "Province not found" });

    const district = province.districts.find((d) => d.name === districtName);
    if (!district) return res.status(404).json({ message: "District not found" });

    district.cities = district.cities.filter((c) => c.name !== cityName);
    await province.save();

    res.json({ success: true, message: "City deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* -------------------- GETTERS -------------------- */
// ✅ Get all provinces
export const getProvinces = async (req, res) => {
  try {
    const provinces = await Province.find({}, "name districts.name districts.cities.name");
    res.json({ success: true, provinces });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get districts of a province
export const getDistricts = async (req, res) => {
  try {
    const { provinceName } = req.params;
    const province = await Province.findOne({ name: provinceName }, "districts.name");

    if (!province) return res.status(404).json({ message: "Province not found" });

    res.json({ success: true, districts: province.districts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Get cities of a district
export const getCities = async (req, res) => {
  try {
    const { provinceName, districtName } = req.params;
    const province = await Province.findOne({ name: provinceName });

    if (!province) return res.status(404).json({ message: "Province not found" });

    const district = province.districts.find((d) => d.name === districtName);
    if (!district) return res.status(404).json({ message: "District not found" });

    res.json({ success: true, cities: district.cities });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
