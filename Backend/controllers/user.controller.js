import userModel from "../models/user.model.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";
import userAddress from "../models/useraddress.model.js";
import fetch from "node-fetch";

//generating token for new user
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

//Route for use register
const registerUser = async (req, res) => {
  try {
    // const { name, gmail, phone, password, confirmPassword } = req.body;
    const { name, gmail, password, confirmPassword } = req.body;

    const exists = await userModel.findOne({ gmail });
    if (exists) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Validating Gmail format (must be a proper Gmail address)
    if (!validator.isEmail(gmail) || !gmail.endsWith("@gmail.com")) {
      return res.json({
        success: false,
        message: "Please enter a valid Gmail address",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password should be 8 character",
      });
    }

    //matching password
    if (password !== confirmPassword) {
      return res.json({
        success: false,
        message: "Password Not Match",
      });
    }

    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new userModel({
      name,
      // phone,
      gmail,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    // 🆕 Auto-create address record with name from user model
    const existingAddress = await userAddress.findOne({ userId: user._id });
    if (!existingAddress) {
      const createdAddress = await userAddress.create({
        userId: user._id,
        name: user.name,
        phone: 0,
        province: "",
        district: "",
        city: "",
        street: "",
      });

      // 🔗 update user's address reference
      await userModel.findByIdAndUpdate(user._id, {
        address: createdAddress._id,
      });
    }

    //sending welcome email
    // const mailOptions = {
    //   from: process.env.SENDER_EMAIL,
    //   to: gmail,
    //   subject: "WELCOME TO FISHING TACKLE STORE",
    //   text: `welcome to fishing tackle store website. your account has been created email ${gmail} `,
    // };

    // await transporter.sendMail(mailOptions);

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "FTS",
          email: process.env.SENDER_EMAIL,
        },
        to: [{ email: gmail }],
        subject: "Welcome to Fishing Tackle Store 🎣",
        htmlContent: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Welcome, ${name}!</h2>
        <p>Thank you for joining <strong>Fishing Tackle Store</strong>.</p>
        <p>Your account has been successfully created with email: <strong>${gmail}</strong>.</p>
        <p>We’re excited to have you onboard. Tight lines! 🎣</p>
      </div>
    `,
      }),
    });

    res.json({
      success: true,
      token,
      user: {
        name: user.name,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//Route for user login
const loginUser = async (req, res) => {
  try {
    const { gmail, password } = req.body;

    const user = await userModel.findOne({ gmail });
    if (!user) {
      return res.json({ success: false, message: "user doesn't exists" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      const token = createToken(user._id);
      res.status(200).json({
        success: true,
        token,
        user: {
          name: user.name,
        },
      });
    } else {
      res.json({ success: false, message: "Invalid Credential" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Server error, please try again later.",
    });
  }
};

//Route for Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign({ role: "admin", email }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      return res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//send verification otp to the users email
const sendVerifyOtp = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId);

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account Already Veified" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.gmail,
      subject: "Account Verification Otp",
      text: `Your OTP is ${otp}. Verify Your Account Using This OTP `,
    };

    await transporter.sendMail(mailOption);

    return res.json({
      success: true,
      message: "Verificatin OTP Send on Email",
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//verify the account according to otp send by user
const verifyEmail = async (req, res) => {
  const userId = req.userId;
  const { otp } = req.body || {};

  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.gmail,
      subject: "Your Account Has Been Acivated",
      text: `Welcome to fishing takcle store ::${user.name}.`,
    };
    await transporter.sendMail(mailOption);

    return res.json({ success: true, message: "Email Verified successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

//authenticating user
const isAuthenticated = async (req, res) => {
  try {
    res.json({ success: true, message: "Authenticated user!!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "You are not Login!!" });
  }
};

//get user data for fronted
const getuserdata = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await userModel.findById(userId);

    res.json({ success: true, message: user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "You are not Login!!" });
  }
};

// verify OTP
const verifyResetOtp = async (req, res) => {
  const { gmail, otp } = req.body || {};

  if (!gmail || !otp) {
    return res.json({ success: false, message: "Email and OTP are required" });
  }

  try {
    const user = await userModel.findOne({ gmail });
    if (!user) return res.json({ success: false, message: "User not found" });

    if (user.resetOtp !== otp)
      return res.json({ success: false, message: "Invalid OTP" });

    if (user.resetOtpExpireAt < Date.now())
      return res.json({ success: false, message: "OTP expired" });

    return res.json({ success: true, message: "OTP verified" });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

// //send password reset otp
// const sendResetOtp = async (req, res) => {
//   const { gmail } = req.body || {};

//   if (!gmail) {
//     return res.json({ success: false, message: "Email is Required" });
//   }

//   try {
//     const user = await userModel.findOne({ gmail });
//     if (!user) {
//       return res.json({ success: false, message: "User Not Found" });
//     }

//     const otp = String(Math.floor(100000 + Math.random() * 900000));
//     user.resetOtp = otp;
//     user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

//     await user.save();

//     const mailOption = {
//       from: process.env.SENDER_EMAIL,
//       to: user.gmail,
//       subject: "Password Reset OTP",
//       text: `Your OTP for Resetting Your Password - ${otp}.`,
//     };
//     await transporter.sendMail(mailOption);

//     return res.json({ success: true, message: "OTP Send To Your Email" });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.massage });
//   }
// };

//send password reset otp
const sendResetOtp = async (req, res) => {
  const { gmail } = req.body || {};

  if (!gmail) {
    return res.json({ success: false, message: "Email is required" });
  }

  try {
    const user = await userModel.findOne({ gmail });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 mins expiry
    await user.save();

    // Send OTP via Brevo API
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: {
          name: "FTS", // change to your app name
          email: process.env.SENDER_EMAIL,
        },
        to: [{ email: user.gmail }],
        subject: "Password Reset OTP",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Password Reset Request</h2>
            <p>Hello ${user.name || ""},</p>
            <p>Your OTP for resetting your password is:</p>
            <h3 style="color:#2b6cb0;">${otp}</h3>
            <p>This OTP is valid for <strong>15 minutes</strong>.</p>
            <p>If you didn't request this, you can ignore this email.</p>
          </div>
        `,
      }),
    });

    const data = await response.json();
    console.log("Brevo API Response:", data);

    if (response.ok) {
      res.json({ success: true, message: "OTP sent to your email" });
    } else {
      res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
        details: data,
      });
    }
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// reset user password
const resetPassword = async (req, res) => {
  const { gmail, otp, newPassword } = req.body || {};

  if (!gmail || !otp || !newPassword)
    return res.json({
      success: false,
      message: "Email, OTP, and new password are required",
    });

  try {
    const user = await userModel.findOne({ gmail });
    if (!user) return res.json({ success: false, message: "User not found" });

    if (user.resetOtp !== otp)
      return res.json({ success: false, message: "Invalid OTP" });

    if (user.resetOtpExpireAt < Date.now())
      return res.json({ success: false, message: "OTP expired" });

    if (newPassword.length < 8)
      return res.json({
        success: false,
        message: "Password must be at least 8 characters",
      });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;

    await user.save();
    return res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};

export {
  loginUser,
  registerUser,
  adminLogin,
  sendVerifyOtp,
  verifyEmail,
  isAuthenticated,
  sendResetOtp,
  resetPassword,
  getuserdata,
  verifyResetOtp,
};
