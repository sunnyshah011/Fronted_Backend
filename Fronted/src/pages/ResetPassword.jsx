import { useState, useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { backendUrl } = useContext(ShopContext);

  const [step, setStep] = useState("email"); // "email" | "otp" | "newPassword"
  const [gmail, setGmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // ✅ Step 1: Send reset OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!gmail) return toast.error("Enter your email");

    try {
      const res = await axios.post(`${backendUrl}/api/user/send-reset-otp`, { gmail });
      if (res.data.success) {
        toast.success(res.data.message);
        setStep("otp");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to send OTP");
    }
  };

  // ✅ Step 2 & 3: Verify OTP & Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword) return toast.error("Enter OTP and new password");

    try {
      const res = await axios.post(`${backendUrl}/api/user/reset-password`, {
        gmail,
        otp,
        newPassword,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        setStep("email"); // go back to email step
        setGmail("");
        setOtp("");
        setNewPassword("");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to reset password");
    }
  };

  return (
    <div className="mt-5 flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {step === "email" && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h2>
            <p className="text-gray-600 mb-6">Enter your email to receive OTP</p>
            <form onSubmit={handleSendOtp} className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                value={gmail}
                onChange={(e) => setGmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 outline-none"
              />
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Send OTP
              </button>
            </form>
          </>
        )}

        {step === "otp" && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Enter OTP</h2>
            <p className="text-gray-600 mb-6">Check your email and enter the OTP</p>
            <form onSubmit={handleResetPassword} className="space-y-4">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 outline-none"
              />
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 outline-none"
              />
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Reset Password
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;


// import { useState, useContext } from "react";
// import { ShopContext } from "../Context/ShopContext";
// import axios from "axios";
// import { toast } from "react-toastify";

// const ResetPassword = () => {
//   const { backendUrl } = useContext(ShopContext);

//   const [step, setStep] = useState("email"); // "email" | "otp" | "newPassword"
//   const [gmail, setGmail] = useState("");
//   const [otp, setOtp] = useState("");
//   const [newPassword, setNewPassword] = useState("");

//   // Step 1: Send reset OTP
//   const handleSendOtp = async (e) => {
//     e.preventDefault();
//     if (!gmail) return toast.error("Enter your email");

//     try {
//       const res = await axios.post(`${backendUrl}/api/user/send-reset-otp`, { gmail });
//       if (res.data.success) {
//         toast.success(res.data.message);
//         setStep("otp");
//       } else {
//         toast.error(res.data.message);
//       }
//     } catch (error) {
//       toast.error(error.message || "Failed to send OTP");
//     }
//   };

//   // Step 2: Verify OTP
//   const handleVerifyOtp = async (e) => {
//     e.preventDefault();
//     if (!otp) return toast.error("Enter OTP");

//     try {
//       // Optionally, you could verify OTP from backend here
//       setStep("newPassword"); // Move to new password step
//     } catch (error) {
//       toast.error(error.message || "Invalid OTP");
//     }
//   };

//   // Step 3: Reset password
//   const handleResetPassword = async (e) => {
//     e.preventDefault();
//     if (!newPassword) return toast.error("Enter new password");

//     try {
//       const res = await axios.post(`${backendUrl}/api/user/reset-password`, {
//         gmail,
//         otp,
//         newPassword,
//       });

//       if (res.data.success) {
//         toast.success(res.data.message);
//         // Reset all states to start over
//         setStep("email");
//         setGmail("");
//         setOtp("");
//         setNewPassword("");
//       } else {
//         toast.error(res.data.message);
//       }
//     } catch (error) {
//       toast.error(error.message || "Failed to reset password");
//     }
//   };

//   return (
//     <div className="mt-5 flex items-center justify-center bg-gray-100 px-4">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         {step === "email" && (
//           <>
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">Reset Password</h2>
//             <p className="text-gray-600 mb-6">Enter your email to receive OTP</p>
//             <form onSubmit={handleSendOtp} className="space-y-4">
//               <input
//                 type="email"
//                 placeholder="Enter your email"
//                 value={gmail}
//                 onChange={(e) => setGmail(e.target.value)}
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 outline-none"
//               />
//               <button
//                 type="submit"
//                 className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
//               >
//                 Send OTP
//               </button>
//             </form>
//           </>
//         )}

//         {step === "otp" && (
//           <>
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">Enter OTP</h2>
//             <p className="text-gray-600 mb-6">Check your email and enter the OTP</p>
//             <form onSubmit={handleVerifyOtp} className="space-y-4">
//               <input
//                 type="text"
//                 placeholder="Enter OTP"
//                 value={otp}
//                 onChange={(e) => setOtp(e.target.value)}
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 outline-none"
//               />
//               <button
//                 type="submit"
//                 className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
//               >
//                 Verify OTP
//               </button>
//             </form>
//           </>
//         )}

//         {step === "newPassword" && (
//           <>
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">Enter New Password</h2>
//             <p className="text-gray-600 mb-6">Set your new password</p>
//             <form onSubmit={handleResetPassword} className="space-y-4">
//               <input
//                 type="password"
//                 placeholder="Enter new password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 outline-none"
//               />
//               <button
//                 type="submit"
//                 className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
//               >
//                 Reset Password
//               </button>
//             </form>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;
