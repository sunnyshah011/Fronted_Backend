import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { useState, useRef,useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function EmailVerify() {
  const { token, navigate, backendUrl,userDetails } = useContext(ShopContext);
  const OTP_LENGTH = 6;
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);

  // Handle input change
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, ""); // allow only digits
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input
    if (index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index] === "") {
        if (index > 0) {
          inputRefs.current[index - 1].focus();
        }
      } else {
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  // Handle paste
  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("Text").slice(0, OTP_LENGTH);
    const newOtp = pastedData.split("").map((char, i) => char || "");
    setOtp([...newOtp, ...Array(OTP_LENGTH - newOtp.length).fill("")]);
    newOtp.forEach((_, i) => inputRefs.current[i]?.focus());
  };

  // Submit OTP
  const handleSubmit = async () => {
    const otpString = otp.join("");
    if (otpString.length !== OTP_LENGTH) {
      toast.error("Please enter complete OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(backendUrl +
        "/api/user/verifyaccount",
        {
          otp: otpString,
        },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        navigate('/manage-account')
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-center">Enter OTP</h2>
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
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </div>
  );
}

export default EmailVerify;
