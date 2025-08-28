import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useQuery, useQueryClient } from "@tanstack/react-query";

function Account() {
  const { token, userDetails, navigate, backendUrl } = useContext(ShopContext);
  const queryClient = useQueryClient(); // works now

  const sendVerificationOtp = async () => {
    try {
      const response = await axios.post(
        backendUrl + "/api/user/sendverifyotp",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message, {
          className: "custom-toast-center",
          autoClose: 1000,
          pauseOnHover: false,
          closeOnClick: true,
          hideProgressBar: true,
        });
        queryClient.invalidateQueries(["userDetails", token]);
        navigate("/email-verify");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message, {
        className: "custom-toast-center",
        autoClose: 1000,
        pauseOnHover: false,
        closeOnClick: true,
        hideProgressBar: true,
      });
    }
  };

  if (!userDetails) {
    return (
      <div className="max-w-md mx-auto mt-3 p-4">
        <div className="p-4 bg-white rounded-sm shadow-sm">
          <h2 className="text-xl font-bold mb-4">User Profile</h2>
          <p className="text-gray-500">Loading user details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-3 p-4">
      <div className="p-4 bg-white rounded-sm shadow-sm">
        <h2 className="text-xl font-bold mb-4">Manage Your Account</h2>
        <div className="flex flex-col gap-6">
          <p>
            <span className="font-semibold">Name:</span> {userDetails.name}
          </p>
          <p>
            <span className="font-semibold">Phone:</span> {userDetails.phone}
          </p>
          <p>
            <span className="font-semibold">Email:</span> {userDetails.gmail}
          </p>
          <div className="flex justify-between max-[300px]:flex-col max-[300px]:gap-5">
            <div>
              <span className="font-semibold">Status:</span>{" "}
              {userDetails.isAccountVerified ? (
                <span className="text-green-600">Verified</span>
              ) : (
                <span className="text-red-600">Not Verified</span>
              )}
            </div>
            <div onClick={sendVerificationOtp}>
              <span className="border border-gray-300 p-1 px-2 rounded-sm cursor-pointer">
                Verify Now
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account;
