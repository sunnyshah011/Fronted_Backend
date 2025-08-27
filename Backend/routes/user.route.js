import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  sendVerifyOtp,
  verifyEmail,
  isAuthenticated,
  sendResetOtp,
  resetPassword,
  getuserdata
} from "../controllers/user.controller.js";
import authUser from "../middleware/auth.middleware.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);

//account verification
userRouter.post("/sendverifyotp", authUser, sendVerifyOtp);
userRouter.post("/verifyaccount", authUser, verifyEmail);

//authenticating user
userRouter.get("/is-auth", authUser, isAuthenticated);

//reset password for user
userRouter.post("/send-reset-otp", sendResetOtp);
userRouter.post("/reset-password", resetPassword);

//get user data for fronted
userRouter.post("/user-data",authUser,getuserdata)

export default userRouter;
