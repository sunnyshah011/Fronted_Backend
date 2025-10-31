// import { useContext, useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { ShopContext } from "../Context/ShopContext";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { Eye, EyeOff } from "lucide-react";

// const Login = () => {
//   const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

//   const [password, setPassword] = useState("");
//   const [gmail, setGmail] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // Show toast after reload
//   useEffect(() => {
//     const showToast = localStorage.getItem("showLoginToast");
//     if (showToast) {
//       toast.success("You Are Logged In", {
//         className: "custom-toast-center",
//         autoClose: 2000,
//         pauseOnHover: false,
//         closeOnClick: true,
//         hideProgressBar: true,
//       });
//       localStorage.removeItem("showLoginToast");
//     }
//   }, []);

//   const onsubmithandler = async (e) => {
//     e.preventDefault();
//     setLoading(true); // ✅ start loading

//     try {
//       const response = await axios.post(backendUrl + "/api/user/login", {
//         gmail,
//         password,
//       });
//       if (response.data.success) {
//         setToken(response.data.token);
//         localStorage.setItem("token", response.data.token);
//         localStorage.setItem("showLoginToast", "true");
//         window.location.reload();
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       toast.error(error.message || "Login failed");
//     } finally {
//       setLoading(false); // ✅ stop loading after request finishes
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

//       {loading && (
//         <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
//         </div>
//       )}
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
//         <p className="text-gray-600 mb-6">Please log in to your account</p>

//         <form onSubmit={onsubmithandler} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email
//             </label>
//             <input
//               onChange={(e) => setGmail(e.target.value)}
//               type="email"
//               placeholder="Enter email"
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 outline-none"
//             />
//           </div>

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

//           <div className="text-sm text-gray-600">
//             <p className="cursor-pointer hover:underline text-red-400">
//               <Link to="/reset-password">Forgot your password?</Link>
//             </p>
//           </div>

//           <button
//             type="submit"
//             className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
//           >
//             Sign In
//           </button>

//           {/* Divider */}
//           <div className="flex items-center gap-2 my-4">
//             <hr className="flex-1 border-gray-300" />
//             <span className="text-gray-500 text-sm">OR</span>
//             <hr className="flex-1 border-gray-300" />
//           </div>

//           <div className="text-center">
//             <Link to="/register" className="hover:underline text-blue-700">
//               Create New Account
//             </Link>
//           </div>
//           {/* Login link */}
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
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
    if (!gmail || !password) return;

    setLoading(true);

    try {
      const response = await axios.post(`${backendUrl}/api/user/login`, {
        gmail,
        password,
      });

      if (response.data.success && response.data.token) {
        // ✅ Set token in context and localStorage
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);

        // ✅ Show success toast
        toast.success("You Are Logged In", {
          className: "custom-toast-center",
          autoClose: 2000,
          pauseOnHover: false,
          closeOnClick: true,
          hideProgressBar: true,
        });

        // ✅ Redirect to home page
        navigate("/");
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Login failed");
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
        <div className="absolute inset-0  flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md z-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h2>
        <p className="text-gray-600 mb-6">Please log in to your account</p>

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
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 outline-none"
            />
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
                required
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600 outline-none"
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

          {/* Forgot Password */}
          <div className="text-sm text-gray-600">
            <p className="cursor-pointer hover:underline text-red-400">
              <Link to="/reset-password">Forgot your password?</Link>
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 bg-blue-600 text-white rounded-md transition ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
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

          <p className="text-center text-gray-600 text-sm">
            Don't have an account?{" "}
            <Link to="/register" className="text-red-600 font-medium">
              Signup
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
