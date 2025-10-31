// import { useContext, useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { ShopContext } from "../Context/ShopContext";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { Eye, EyeOff } from "lucide-react";

// const Register = () => {
//   const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

//   const [name, setName] = useState("");
//   const [gmail, setGmail] = useState("");
//   // const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [agree, setAgree] = useState(false);

//   useEffect(() => {
//     const showToast = localStorage.getItem("showRegisterToast");
//     if (showToast) {
//       toast.success("Account Created Successfully", {
//         className: "custom-toast-center",
//         autoClose: 2000,
//         pauseOnHover: false,
//         closeOnClick: true,
//         hideProgressBar: true,
//       });
//       localStorage.removeItem("showRegisterToast"); // remove flag
//     }
//   }, []);

//   const onsubmithandler = async (e) => {
//     e.preventDefault();

//     if (!agree) {
//       toast.error("You must agree to the Terms and Privacy");
//       return;
//     }

//     try {
//       const response = await axios.post(backendUrl + "/api/user/register", {
//         name,
//         gmail,
//         // phone,
//         password,
//         confirmPassword,
//       });

//       if (response.data.success) {
//         setToken(response.data.token);
//         localStorage.setItem("token", response.data.token);

//         // Set flag to show toast after reload
//         localStorage.setItem("showRegisterToast", "true");

//         // Reload page to update navbar/user info
//         window.location.reload();
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.message, { position: "top-center", autoClose: 1000 });
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       navigate("/");
//     }
//   }, [token]);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   return (
//     <div className="mt-5 flex items-center justify-center bg-gray-100 px-4">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold text-gray-800 mb-2">
//           Welcome To FTS
//         </h2>
//         <p className="text-gray-600 mb-4">Create New Account</p>

//         <form onSubmit={onsubmithandler} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Full Name
//             </label>
//             <input
//               onChange={(e) => setName(e.target.value)}
//               type="text"
//               placeholder="Enter full name"
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 outline-none"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email
//             </label>
//             <input
//               onChange={(e) => setGmail(e.target.value)}
//               type="email"
//               placeholder="Enter email address"
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 outline-none"
//             />
//           </div>

//           {/* <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Phone
//             </label>
//             <input
//               onChange={(e) => setPhone(e.target.value)}
//               type="number"
//               placeholder="Enter phone number"
//               required
//               className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500 outline-none"
//             />
//           </div> */}

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter password"
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 outline-none"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute inset-y-0 right-3 flex items-center text-gray-500"
//               >
//                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Confirm Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 placeholder="Confirm password"
//                 required
//                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 outline-none"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute inset-y-0 right-3 flex items-center text-gray-500"
//               >
//                 {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>
//           </div>

//           {/* Terms & Privacy */}
//           <div className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={agree}
//               onChange={(e) => setAgree(e.target.checked)}
//               className="h-4 w-4"
//             />
//             <p className="text-sm text-gray-600">
//               I agree to the{" "}
//               <span className="text-red-500 cursor-pointer">Terms</span> and{" "}
//               <span className="text-red-500 cursor-pointer">Privacy</span>
//             </p>
//           </div>

//           <button
//             type="submit"
//             className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
//           >
//             Sign Up
//           </button>

//           {/* Divider */}
//           <div className="flex items-center gap-2 my-4">
//             <hr className="flex-1 border-gray-300" />
//             <span className="text-gray-500 text-sm">OR</span>
//             <hr className="flex-1 border-gray-300" />
//           </div>

//           {/* Login link */}
//           <p className="text-center text-gray-600 text-sm">
//             Already have an account?{" "}
//             <Link to="/login" className="text-red-600 font-medium">
//               Login
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Register;

import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState("");
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (token) navigate("/");
  }, [token]);

  // Disable scroll when loading
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple submits

    if (!agree) {
      toast.error("You must agree to the Terms and Privacy");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${backendUrl}/api/user/register`, {
        name,
        gmail,
        password,
        confirmPassword,
      });

      if (response.data.success && response.data.token) {
        // ✅ Set token in context and localStorage
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);

        // ✅ Show toast
        toast.success("Account Created Successfully", {
          autoClose: 2000,
          pauseOnHover: false,
          closeOnClick: true,
          hideProgressBar: true,
        });

        // ✅ Navigate to home
        navigate("/");
      } else {
        toast.error(response.data.message || "Registration failed");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="mt-5 flex items-center justify-center bg-gray-100 px-4">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome To FTS
        </h2>
        <p className="text-gray-600 mb-4">Create New Account</p>

        <form onSubmit={onSubmitHandler} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter full name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email address"
              required
              value={gmail}
              onChange={(e) => setGmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="h-4 w-4"
            />
            <p className="text-sm text-gray-600">
              I agree to the{" "}
              <span className="text-red-500 cursor-pointer">Terms</span> and{" "}
              <span className="text-red-500 cursor-pointer">Privacy</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white rounded-md transition ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

          <div className="flex items-center gap-2 my-4">
            <hr className="flex-1 border-gray-300" />
            <span className="text-gray-500 text-sm">OR</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          <p className="text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-red-600 font-medium">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
