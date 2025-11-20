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
        <h2 className="text-[15px] text-gray-800">Welcome To,</h2>
        <h2 className="text-2xl  text-gray-800 mb-2">Fishing Tackle Store🎣</h2>
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
            className={`w-full py-3 text-white rounded-md transition ${
              loading
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




// import { useContext, useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { ShopContext } from "../Context/ShopContext";
// import axios from "axios";
// import validator from "validator"; // ADD THIS
// import { Eye, EyeOff } from "lucide-react";

// const Register = () => {
//   const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

//   const [name, setName] = useState("");
//   const [gmail, setGmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [agree, setAgree] = useState(false);
//   const [loading, setLoading] = useState(false);

//   // NEW: Track input errors
//   const [errors, setErrors] = useState({});

//   useEffect(() => {
//     if (token) navigate("/");
//   }, [token]);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   const onSubmitHandler = async (e) => {
//     e.preventDefault();

//     let newErrors = {};

//     // Validate fields
//     if (!name.trim()) newErrors.name = "Full name is required";

//     if (!validator.isEmail(gmail) || !gmail.endsWith("@gmail.com")) {
//       newErrors.gmail = "Enter a valid Gmail address";
//     }

//     if (password.length < 8) {
//       newErrors.password = "Password must be at least 8 characters";
//     }

//     if (password !== confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match";
//     }

//     if (!agree) newErrors.agree = "You must accept Terms and Privacy Policy";

//     // If any error exists, stop submit
//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     // Clear errors
//     setErrors({});
//     setLoading(true);

//     try {
//       const response = await axios.post(`${backendUrl}/api/user/register`, {
//         name,
//         gmail,
//         password,
//         confirmPassword,
//       });

//       if (!response.data.success) {
//         setErrors({ server: response.data.message });
//         return;
//       }

//       // success
//       setToken(response.data.token);
//       localStorage.setItem("token", response.data.token);

//       navigate("/");
//     } catch (err) {
//       setErrors({
//         server: err.response?.data?.message || "Registration failed",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="mt-5 flex items-center justify-center bg-gray-100 px-4">
//       <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
//         <h2 className="text-[15px] text-gray-800">Welcome To,</h2>
//         <h2 className="text-2xl text-gray-800 mb-2">Fishing Tackle Store🎣</h2>
//         <p className="text-gray-600 mb-4">Create New Account</p>

//         {/* SERVER ERROR (Top of form) */}
//         {errors.server && (
//           <p className="text-red-600 text-sm text-center mb-2">
//             {errors.server}
//           </p>
//         )}

//         <form onSubmit={onSubmitHandler} className="space-y-4">
//           {/* NAME FIELD */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Full Name
//             </label>
//             <input
//               type="text"
//               placeholder="Enter full name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className={`w-full px-4 py-2 border ${
//                 errors.name ? "border-red-500" : "border-gray-300"
//               } rounded-md`}
//             />
//             {errors.name && (
//               <p className="text-red-500 text-sm mt-1">{errors.name}</p>
//             )}
//           </div>

//           {/* EMAIL FIELD */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Email
//             </label>
//             <input
//               type="email"
//               placeholder="Enter email"
//               value={gmail}
//               onChange={(e) => setGmail(e.target.value)}
//               className={`w-full px-4 py-2 border ${
//                 errors.gmail ? "border-red-500" : "border-gray-300"
//               } rounded-md`}
//             />
//             {errors.gmail && (
//               <p className="text-red-500 text-sm mt-1">{errors.gmail}</p>
//             )}
//           </div>

//           {/* PASSWORD FIELD */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className={`w-full px-4 py-2 border ${
//                   errors.password ? "border-red-500" : "border-gray-300"
//                 } rounded-md`}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute inset-y-0 right-3 flex items-center text-gray-500"
//               >
//                 {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>
//             {errors.password && (
//               <p className="text-red-500 text-sm mt-1">{errors.password}</p>
//             )}
//           </div>

//           {/* CONFIRM PASSWORD */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Confirm Password
//             </label>
//             <div className="relative">
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 placeholder="Confirm password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 className={`w-full px-4 py-2 border ${
//                   errors.confirmPassword ? "border-red-500" : "border-gray-300"
//                 } rounded-md`}
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute inset-y-0 right-3 flex items-center text-gray-500"
//               >
//                 {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//               </button>
//             </div>
//             {errors.confirmPassword && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.confirmPassword}
//               </p>
//             )}
//           </div>

//           {/* AGREEMENT CHECKBOX */}
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
//           {errors.agree && (
//             <p className="text-red-500 text-sm mt-1">{errors.agree}</p>
//           )}

//           {/* SUBMIT BUTTON */}
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-3 text-white rounded-md transition ${
//               loading
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700"
//             }`}
//           >
//             {loading ? "Creating Account..." : "Sign Up"}
//           </button>

//           <p className="text-center text-gray-600 text-sm mt-4">
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
