// import { useContext, useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { ShopContext } from "../Context/ShopContext";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { Eye, EyeOff } from "lucide-react";

// const Login = () => {
//   const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

//   const [gmail, setGmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Redirect if already logged in
//   useEffect(() => {
//     if (token) navigate("/");
//   }, [token]);

//   // Disable scroll when loading
//   useEffect(() => {
//     if (loading) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [loading]);

//   const onSubmitHandler = async (e) => {
//     e.preventDefault();
//     if (!gmail || !password) return;

//     setLoading(true);

//     try {
//       const response = await axios.post(`${backendUrl}/api/user/login`, {
//         gmail,
//         password,
//       });

//       if (response.data.success && response.data.token) {
//         // ✅ Set token in context and localStorage
//         setToken(response.data.token);
//         localStorage.setItem("token", response.data.token);

//         // ✅ Show success toast
//         toast.success("You Are Logged In", {
//           className: "custom-toast-center",
//           autoClose: 2000,
//           pauseOnHover: false,
//           closeOnClick: true,
//           hideProgressBar: true,
//         });

//         // ✅ Redirect to home page
//         navigate("/");
//       } else {
//         toast.error(response.data.message || "Login failed");
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   return (
//     <div className="mt-5 flex items-center justify-center bg-gray-100 px-4">
//       {loading && (
//         <div className="absolute inset-0  flex items-center justify-center z-50">
//           <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//         </div>
//       )}

//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md z-10">
//         <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
//         <p className="text-gray-600 mb-6">Please log in to your account</p>

//         <form onSubmit={onSubmitHandler} className="space-y-4">
//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               placeholder="Enter email"
//               value={gmail}
//               onChange={(e) => setGmail(e.target.value)}
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 outline-none"
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="Enter password"
//                 required
//                 className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 outline-none"
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

//           {/* Forgot Password */}
//           <div className="text-sm text-gray-600">
//             <p className="cursor-pointer hover:underline text-red-400">
//               <Link to="/reset-password">Forgot your password?</Link>
//             </p>
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-3 bg-blue-600 text-white rounded-md transition ${
//               loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
//             }`}
//           >
//             {loading ? "Logging In..." : "Sign In"}
//           </button>

//           {/* Divider */}
//           <div className="flex items-center gap-2 my-4">
//             <hr className="flex-1 border-gray-300" />
//             <span className="text-gray-500 text-sm">OR</span>
//             <hr className="flex-1 border-gray-300" />
//           </div>

//           {/* Register Link */}
//           <div className="text-center">
//             <Link to="/register" className="hover:underline text-blue-700">
//               Create New Account
//             </Link>
//           </div>

//           <p className="text-center text-gray-600 text-sm">
//             Don't have an account?{" "}
//             <Link to="/register" className="text-red-600 font-medium">
//               Signup
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;

import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import validator from "validator";

const Login = () => {
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Track input errors
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (token) navigate("/");
  }, [token]);

  // Disable scroll when loading
  useEffect(() => {
    document.body.style.overflow = loading ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (loading) return;

    let newErrors = {};

    // Validate email
    if (!gmail.trim()) {
      newErrors.gmail = "Email is required";
    } else if (!validator.isEmail(gmail)) {
      newErrors.gmail = "Enter a valid email";
    }

    // Validate password
    if (!password.trim()) newErrors.password = "Password is required";

    // Stop submission if any errors
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await axios.post(`${backendUrl}/api/user/login`, {
        gmail,
        password,
      });

      if (response.data.success && response.data.token) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        navigate("/");
      } else {
        setErrors({ server: response.data.message || "Login failed" });
      }
    } catch (err) {
      setErrors({
        server: err.response?.data?.message || "Login failed",
      });
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
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md z-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
        <p className="text-gray-600 mb-6">Please log in to your account</p>

        {/* Server error */}
        {errors.server && (
          <p className="text-red-600 text-sm text-center mb-4 p-1 uppercase bg-red-50 border border-red-100 rounded">
             <span className="pr-1">⚠️</span>{errors.server}
          </p>
        )}

        <form onSubmit={onSubmitHandler} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter email"
              value={gmail}
              onChange={(e) => setGmail(e.target.value)}
              className={`w-full px-4 py-2 border ${errors.gmail ? "border-red-500" : "border-gray-300"
                } rounded-md focus:ring-2 focus:ring-blue-600 outline-none`}
            />
            {errors.gmail && (
              <p className="text-red-500 text-[12px] ml-1 mt-1">*{errors.gmail}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className={`w-full px-4 py-2 pr-10 border ${errors.password ? "border-red-500" : "border-gray-300"
                  } rounded-md focus:ring-2 focus:ring-blue-600 outline-none`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-[12px] ml-1 mt-1">*{errors.password}</p>
            )}
          </div>

          {/* Forgot Password */}
          <div className="text-sm text-gray-600">
            <Link
              to="/reset-password"
              className="cursor-pointer hover:underline text-red-400"
            >
              Forgot your password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-blue-600 text-white rounded-md transition ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
          >
            {loading ? "Logging In..." : "Sign In"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-2 my-4">
            <hr className="flex-1 border-gray-300" />
            <span className="text-gray-500 text-sm">OR</span>
            <hr className="flex-1 border-gray-300" />
          </div>

          {/* Register Link */}
          <div className="text-center">
            <Link to="/register" className="hover:underline text-blue-700">
              Create New Account
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
