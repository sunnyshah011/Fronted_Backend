// routes/locationRoutes.js
import express from "express";
import {
  // GET
  getProvinces,
  getDistricts,
  getCities,
  // POST
  addProvince,
  addDistrict,
  addCity,
  // PUT
  editProvince,
  editDistrict,
  editCity,
  // DELETE
  deleteProvince,
  deleteDistrict,
  deleteCity,
} from "../controllers/locationController.js";

import adminAuth from "../middleware/adminAuth.middleware.js";

const locationRouter = express.Router();

/* -------------------- PUBLIC ROUTES -------------------- */
locationRouter.get("/province", getProvinces);
locationRouter.get("/:provinceName/districts", getDistricts);
locationRouter.get("/:provinceName/:districtName/cities", getCities);

/* -------------------- ADMIN ROUTES -------------------- */
// PROVINCE
locationRouter.post("/province", adminAuth, addProvince);
locationRouter.put("/province/:provinceName", adminAuth, editProvince);
locationRouter.delete("/province/:provinceName", adminAuth, deleteProvince);

// DISTRICT
locationRouter.post("/:provinceName/district", adminAuth, addDistrict);
locationRouter.put("/:provinceName/district/:districtName", adminAuth, editDistrict);
locationRouter.delete("/:provinceName/district/:districtName", adminAuth, deleteDistrict);

// CITY
locationRouter.post("/:provinceName/:districtName/city", adminAuth, addCity);
locationRouter.put("/:provinceName/:districtName/city/:cityName", adminAuth, editCity);
locationRouter.delete("/:provinceName/:districtName/city/:cityName", adminAuth, deleteCity);

export default locationRouter;
