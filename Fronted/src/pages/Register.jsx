import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Register = () => {
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const onsubmithandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(backendUrl + "/api/user/register", {
        name,
        email,
        password,
      });
      if (response.data.success) {
        navigate('/')
        toast.success("Account Crated Successfully")
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        console.log(response.data)
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
        console.log(error);
        toast.error(error.message)
    }
  };

  return (
    <form
      onSubmit={onsubmithandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-700"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl"> Sign Up </p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      <input
        onChange={(e) => setName(e.target.value)}
        type="text"
        className="w-full px-3 py-2 border border-gray-300"
        placeholder="Full Name"
        required
      />
      {/* <input
        type="number"
        className="w-full px-3 py-2 border border-gray-300"
        placeholder="Phone Number"
        required
      /> */}
      <input
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        className="w-full px-3 py-2 border border-gray-300"
        placeholder="Email"
        required
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        className="w-full px-3 py-2 border border-gray-300"
        placeholder="Set Password"
        required
      />

      <div className="w-full flex justify-between text-sm ">
        <p className="cursor-pointer">Forgot your password</p>
        <Link to="/login">
          <p className="cursor-pointer">Login Here</p>
        </Link>
      </div>

      <button className="bg-black px-8 py-2 mt-8 text-white font-light">
        Sign Up
      </button>
    </form>
  );
};

export default Register;
