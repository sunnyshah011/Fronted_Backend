import express from "express";
import authUser from "../middleware/auth.middleware.js";
import { addProfile } from "../controllers/userprofile.controller.js";

const profileRouter = express.Router();

profileRouter.post("/setaddress", authUser, addProfile);
profileRouter.post("/getprofile", authUser, getProfile);

export default profileRouter