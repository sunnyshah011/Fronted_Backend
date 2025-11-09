// // models/Province.js
// import mongoose from "mongoose";

// const citySchema = new mongoose.Schema({
//   name: { type: String, required: true, trim: true },
// });

// const districtSchema = new mongoose.Schema({
//   name: { type: String, required: true, trim: true },
//   cities: [citySchema],
// });

// const provinceSchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true, trim: true },
//   districts: [districtSchema],
// });

// export default mongoose.models.Province || mongoose.model("Province", provinceSchema);


import mongoose from "mongoose";

const districtSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
});

const provinceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  districts: [districtSchema],
});

export default mongoose.models.Province || mongoose.model("Province", provinceSchema);
