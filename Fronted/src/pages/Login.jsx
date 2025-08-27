// import { useContext, useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { ShopContext } from "../Context/ShopContext";
// import axios from "axios";
// import { toast } from "react-toastify";

// const Login = () => {
//   const { setUser, token, setToken, navigate, backendUrl } = useContext(ShopContext);

//   const [password, setPassword] = useState("");
//   const [email, setEmail] = useState("");

//   const onsubmithandler = async (e) => {
//     e.preventDefault();

//     try {
//       const response = await axios.post(backendUrl + "/api/user/login", {
//         email,
//         password,
//       });
//       if (response.data.success) {
//         setToken(response.data.token);
//         localStorage.setItem("token", response.data.token);
        
//         setUser(response.data.user.name)
//         localStorage.setItem("user", response.data.user.name);
//         // console.log("Logged in user:", response.data); // ✅ Will work!
//         toast.success("You are Login", {
//           position: "top-center",
//           className: "custom-toast-center",
//           bodyClassName: "text-sm",
//           autoClose: 1000,
//           closeOnClick: true,
//           pauseOnHover: true,
//         });
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       toast.error(error);
//     }
//   };

//   useEffect(() => {
//     if (token) {
//       navigate("/");
//     }
//   }, [token]);

//   return (
//     <form
//       onSubmit={onsubmithandler}
//       className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-5 gap-4 text-gray-700 "
//     >
//       <div className="inline-flex items-center gap-2 mb-2 mt-10">
//         <p className="prata-regular text-3xl"> Sign Up </p>
//         <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
//       </div>
//       <input
//         onChange={(e) => setEmail(e.target.value)}
//         type="email"
//         className="w-full px-3 py-2 border border-gray-300"
//         placeholder="Email"
//         required
//       />
//       <input
//         onChange={(e) => setPassword(e.target.value)}
//         type="password"
//         className="w-full px-3 py-2 border border-gray-300"
//         placeholder="Set Password"
//         required
//       />

//       <div className="w-full flex justify-between text-sm ">
//         <p className="cursor-pointer">Forgot your password</p>
//         <Link to="/register">
//           <p className="cursor-pointer">Create New Account</p>
//         </Link>
//       </div>

//       <button className="bg-black px-8 py-2 mt-8 text-white font-light">
//         Sign In
//       </button>
//     </form>
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

  const [password, setPassword] = useState("");
  const [gmail, setGmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onsubmithandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(backendUrl + "/api/user/login", {
        gmail,
        password,
      });
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);

       toast.success("You Are Logged In", {
          className: "custom-toast-center",
          autoClose: 1000,
          pauseOnHover: false,
          closeOnClick: true,
          hideProgressBar: true,
        });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message || "Login failed");
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  return (
    <div className="mt-5 flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Welcome Back</h2>
        <p className="text-gray-600 mb-6">Please log in to your account</p>

        <form onSubmit={onsubmithandler} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              onChange={(e) => setGmail(e.target.value)}
              type="email"
              placeholder="Enter email"
              required
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

          <div className="flex justify-between text-sm text-gray-600">
            <p className="cursor-pointer hover:underline text-red-600">
              Forgot your password?
            </p>
            <Link to="/register" className="hover:underline text-red-600">
              Create New Account
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
