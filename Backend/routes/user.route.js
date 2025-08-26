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
userRouter.post("/is-auth", authUser, isAuthenticated);

//reset password for user
userRouter.post("/send-reset-otp", sendResetOtp);
userRouter.post("/reset-password", resetPassword);

export default userRouter;
