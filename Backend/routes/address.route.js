import express from "express";
import authUser from "../middleware/auth.middleware.js";
import { addProfile,getProfile } from "../controllers/userprofile.controller.js";

const userAddress = express.Router();

userAddress.post("/setaddress", authUser, addProfile);
userAddress.post("/getprofile", authUser, getProfile);
// userAddress.post("/updateaddress", authUser, updateAddress);

export default userAddress