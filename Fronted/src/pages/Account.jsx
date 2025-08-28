import { useState } from "react";

// Dummy data (replace with API fetched user)
const user = {
  name: "John Doe",
  phone: 9876543210,
  gmail: "john@example.com",
  isAccountVerified: false,
};

function Account() {
  const [step, setStep] = useState("profile"); // profile | otp | reset
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // 👉 Request OTP (API call)
  const handleRequestOtp = () => {
    console.log("Sending OTP to", user.gmail);
    setStep("otp");
  };

  // 👉 Verify OTP (API call)
  const handleVerifyOtp = () => {
    if (otp === "1234") {
      console.log("OTP verified ✅");
      setStep("reset");
    } else {
      alert("Invalid OTP ❌");
    }
  };

  // 👉 Reset Password (API call)
  const handleResetPassword = () => {
    console.log("Password changed to:", newPassword);
    alert("Password reset successful ✅ Redirecting to Home...");
    window.location.href = "/"; // redirect
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      {step === "profile" && (
        <>
          <h2 className="text-xl font-bold mb-4">User Profile</h2>
          <div className="space-y-2">
            <p><span className="font-semibold">Name:</span> {user.name}</p>
            <p><span className="font-semibold">Phone:</span> {user.phone}</p>
            <p><span className="font-semibold">Email:</span> {user.gmail}</p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              {user.isAccountVerified ? (
                <span className="text-green-600">Verified</span>
              ) : (
                <span className="text-red-600">Not Verified</span>
              )}
            </p>
          </div>

          <button
            onClick={() =>
              user.isAccountVerified ? setStep("reset") : handleRequestOtp()
            }
            className="mt-6 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700"
          >
            Change Password
          </button>
        </>
      )}

      {step === "otp" && (
        <>
          <h2 className="text-xl font-bold mb-4">Verify OTP</h2>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border p-2 rounded-lg mb-4"
          />
          <button
            onClick={handleVerifyOtp}
            className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700"
          >
            Verify OTP
          </button>
        </>
      )}

      {step === "reset" && (
        <>
          <h2 className="text-xl font-bold mb-4">Reset Password</h2>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full border p-2 rounded-lg mb-4"
          />
          <button
            onClick={handleResetPassword}
            className="w-full bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700"
          >
            Reset Password
          </button>
        </>
      )}
    </div>
  );
}

export default Account