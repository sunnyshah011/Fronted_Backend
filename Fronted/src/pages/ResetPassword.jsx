import { useState, useContext, useRef } from "react";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { backendUrl,navigate } = useContext(ShopContext);


  const OTP_LENGTH = 6;

  const [step, setStep] = useState("email"); // "email" | "otp" | "newPassword"
  const [gmail, setGmail] = useState("");
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);

  // Step 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!gmail) return toast.error("Enter your email");

    try {
      const res = await axios.post(`${backendUrl}/api/user/send-reset-otp`, {
        gmail,
      });
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

  // OTP input handlers
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < OTP_LENGTH - 1) inputRefs.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index] === "" && index > 0) {
        inputRefs.current[index - 1].focus();
      } else {
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("Text").slice(0, OTP_LENGTH);
    const newOtp = pastedData.split("").map((char, i) => char || "");
    setOtp([...newOtp, ...Array(OTP_LENGTH - newOtp.length).fill("")]);
    newOtp.forEach((_, i) => inputRefs.current[i]?.focus());
  };

  // Step 2: Verify OTP with backend
  const handleVerifyOtp = async () => {
    const otpString = otp.join("");
    if (otpString.length !== OTP_LENGTH)
      return toast.error("Enter complete OTP");

    try {
      setLoading(true);
      const res = await axios.post(`${backendUrl}/api/user/verify-reset-otp`, {
        gmail,
        otp: otpString,
      });
      if (res.data.success) {
        toast.success("OTP verified! You can now set a new password.");
        setStep("newPassword");
      } else {
        toast.error(res.data.message || "Invalid OTP");
      }
    } catch (error) {
      toast.error(error.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (!newPassword) return toast.error("Enter new password");

    try {
      setLoading(true);
      const res = await axios.post(`${backendUrl}/api/user/reset-password`, {
        gmail,
        otp: otpString,
        newPassword,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setStep("email");
        setGmail("");
        setOtp(Array(OTP_LENGTH).fill(""));
        setNewPassword("");
        navigate("/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5 flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        {/* Step 1: Enter email */}
        {step === "email" && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Reset Password
            </h2>
            <p className="text-gray-600 mb-6">
              Enter your email to receive OTP
            </p>
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

        {/* Step 2: Enter OTP */}
        {step === "otp" && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Enter OTP</h2>
            <p className="text-gray-600 mb-6">
              Check your email and enter the OTP
            </p>
            <div className="flex justify-center gap-2 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                  className="w-10 h-12 text-center border rounded text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* Step 3: Enter New Password */}
        {step === "newPassword" && (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Set New Password
            </h2>
            <p className="text-gray-600 mb-6">Enter your new password</p>
            <form onSubmit={handleResetPassword} className="space-y-4">
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
                disabled={loading}
                className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
