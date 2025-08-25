// import { useContext, useState } from "react";
// import { Link } from "react-router-dom";
// import { ShopContext } from "../Context/ShopContext";
// import axios from "axios";
// import { toast } from "react-toastify";

// const Register = () => {
//   const {setUser, setToken, navigate, backendUrl } = useContext(ShopContext);

//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");
//   const [email, setEmail] = useState("");

//   const onsubmithandler = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(backendUrl + "/api/user/register", {
//         name,
//         email,
//         password,
//       });
//       if (response.data.success) {

//         navigate('/')

//          toast.info("Account Crated Successfully", {
//           position: "top-center",
//           className: "custom-toast-center",
//           bodyClassName: "text-sm",
//           autoClose: 1000,
//           closeOnClick: true,
//           pauseOnHover: true,
//         });

//         setToken(response.data.token);
//         localStorage.setItem("token", response.data.token);

//         setUser(response.data.user.name)
//         localStorage.setItem("user", response.data.user.name);

//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.message)
//     }
//   };

//   return (
//     <form
//       onSubmit={onsubmithandler}
//       className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-5 gap-4 text-gray-700"
//     >
//       <div className="inline-flex items-center gap-2 mb-2 mt-10">
//         <p className="prata-regular text-3xl"> Sign Up </p>
//         <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
//       </div>
//       <input
//         onChange={(e) => setName(e.target.value)}
//         type="text"
//         className="w-full px-3 py-2 border border-gray-300"
//         placeholder="Full Name"
//         required
//       />
//       {/* <input
//         type="number"
//         className="w-full px-3 py-2 border border-gray-300"
//         placeholder="Phone Number"
//         required
//       /> */}
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
//         <Link to="/login">
//           <p className="cursor-pointer">Login Here</p>
//         </Link>
//       </div>

//       <button className="bg-black px-8 py-2 mt-8 text-white font-light">
//         Sign Up
//       </button>
//     </form>
//   );
// };

// export default Register;





import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const Register = () => {
  const { setUser, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState("");
  const [gmail, setGmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State for show/hide password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onsubmithandler = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(backendUrl + "/api/user/register", {
        name,
        gmail,
        phone,
        password,
        confirmPassword,
      });

      if (response.data.success) {
        navigate("/");
        toast.info("Account Created Successfully", {
          position: "top-center",
          className: "custom-toast-center",
          bodyClassName: "text-sm",
          autoClose: 1000,
          closeOnClick: true,
          pauseOnHover: true,
        });

        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);

        setUser(response.data.user.name);
        localStorage.setItem("user", response.data.user.name);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message, {
        position: "top-center",
        className: "custom-toast-center",
        bodyClassName: "text-sm",
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

  return (
    <form
      onSubmit={onsubmithandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-5 gap-4 text-gray-700"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl"> Sign Up </p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      <input
        onChange={(e) => setName(e.target.value)}
        type="text"
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
        placeholder="Full Name"
        required
      />
      <input
        onChange={(e) => setPhone(e.target.value)}
        type="number"
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
        placeholder="Phone Number"
        required
      />
      <input
        onChange={(e) => setGmail(e.target.value)}
        type="email"
        className="w-full px-3 py-2 border border-gray-300 rounded-md"
        placeholder="Email"
        required
      />

      {/* Password Field with Show/Hide */}
      <div className="relative w-full">
        <input
          type={showPassword ? "text" : "password"}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md"
          placeholder="New Password"
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500"
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      {/* Confirm Password Field with Show/Hide */}
      <div className="relative w-full">
        <input
          type={showConfirmPassword ? "text" : "password"}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md"
          placeholder="Confirm Password"
          required
        />
        <button
          type="button"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          className="absolute inset-y-0 right-3 flex items-center text-gray-500"
        >
          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>

      <div className="w-full flex justify-between text-sm ">
        <p className="cursor-pointer">Forgot your password</p>
        <Link to="/login">
          <p className="cursor-pointer">Login Here</p>
        </Link>
      </div>

      <button className="bg-black px-8 py-2 mt-8 text-white font-light rounded-md">
        Sign Up
      </button>
    </form>
  );
};

export default Register;
