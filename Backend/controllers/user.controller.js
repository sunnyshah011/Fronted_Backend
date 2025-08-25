// import userModel from "../models/user.model.js";
// import validator from "validator";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";

// //generating token for new user
// const createToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET);
// };

// //Route for user login
// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await userModel.findOne({ email });
//     if (!user) {
//       return res.json({ success: false, message: "user doesn't exists" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     // res.status(200).json({
//     //   success: true,
//     //   token,
//     // });

//     if (isMatch) {
//       const token = createToken(user._id);

//       // ✅ Include user details in the response
//       res.status(200).json({
//         success: true,
//         token,
//         user: {
//           name: user.name,
//         },
//       });
      
//     } else {
//       res.json({ success: false, message: "Invalid Credential" });
//     }
//   } catch (error) {}
// };

// //Route for use register
// const registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     //checking user already exists or not
//     const exists = await userModel.findOne({ email });
//     if (exists) {
//       return res.json({ success: false, message: "User already exists" });
//     }

//     //Validating email format & strong password
//     if (!validator.isEmail(email)) {
//       return res.json({
//         success: false,
//         message: "Please enter a valid email",
//       });
//     }
//     if (password.length < 8) {
//       return res.json({
//         success: false,
//         message: "Please enter a strong password",
//       });
//     }

//     //hashing password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = new userModel({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     const user = await newUser.save();

//     const token = createToken(user._id);

//     res.json({
//       success: true,
//       token,
//       user: {
//         name: user.name,
//       },
//     });
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// //Route for Admin Login
// const adminLogin = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (
//       email === process.env.ADMIN_EMAIL &&
//       password === process.env.ADMIN_PASSWORD
//     ) {
//       const token = jwt.sign(email + password, process.env.JWT_SECRET);
//       res.json({ success: true, token });
//     } else {
//       res.json({ success: false, message: "Invalid Credentials" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.json({ success: false, message: error.message });
//   }
// };

// export { loginUser, registerUser, adminLogin };


























import userModel from "../models/user.model.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import transporter from "../config/nodemailer.js";

//generating token for new user
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

//Route for use register
const registerUser = async (req, res) => {
  try {
    const { name, gmail, phone, password, confirmPassword } = req.body;

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
      phone,
      gmail,
      password: hashedPassword,
    });

    const user = await newUser.save();
    const token = createToken(user._id);

    //sending welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: gmail,
      subject: 'WELCOME TO FISHING TACKLE STORE',
      text: `welcome to fishing tackle store website. your account has been created email ${gmail} `
    }

    await transporter.sendMail(mailOptions)

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
    res.status(500).json({ success: false, message: "Server error, please try again later." });
  }
};


//Route for Admin Login
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.userId;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        { role: "admin", email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//send verification otp to the users email
const sendVerifyOtp = async (req, res) => {
  try {

    const { userId } = req.userId
    const user = await userModel.findById(userId)

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account Already Veified" })
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000))

    user.verifyOtp = otp
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000

    await user.save()

    const mailOption = {
      from: process.env.SENDER_EMAIL,
      to: user.gmail,
      subject: 'Account Verification Otp',
      text: `Your OTP is ${otp}. Verify Your Account Using This OTP `
    }

    await transporter.sendMail(mailOption)

    res.json({ success: true, message: "Verificatin OTP Send on Email" })


  } catch (error) {

  }
}

//verify the account according to otp send by user
const verifyEmail = async (req, res) => {

  const { userId, otp } = req.body
  console.log(userId);
  console.log(otp);
  
  if (!userId || !otp) {
    return res.json({ success: false, message: "Missing Details" })
  }

  try {

    const user = await userModel.findById(userId)

    if (!user) {
      return res.json({ success: false, message: "user not found" })
    }

    if (user.verifyOtp === '' || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "Invalid OTP" })
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" })
    }

    user.isAccountVerified = true;
    user.verifyOtp = ''
    user.verifyOtpExpireAt = 0

    await user.save()
    return res.json({ success: true, message: 'Email Verified successfully' })

  } catch (error) {
    return res.json({ success: false, message: error.message })
  }
}


export { loginUser, registerUser, adminLogin, sendVerifyOtp,verifyEmail };
