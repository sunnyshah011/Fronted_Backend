import { useState } from "react";
import axios from "axios";
import { BackendUrl } from "../App";
import { toast } from "react-toastify";

const Login = ({ settoken }) => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(BackendUrl + "/api/user/admin", {
        email,
        password,
      });

      if (response.data.success) {
        settoken(response.data.token);
        toast.success("Login Successfully");
      } else {
        console.log("please enter correct password and gmail");
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <div className="bg-white shadow-md rounde-lg px-8 py-6 max-w-md">
        <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

        <form onSubmit={onSubmitHandler}>
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Email Address
            </p>
            <input
              onChange={(e) => setemail(e.target.value)}
              value={email}
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
              type="email"
              placeholder="your email"
              required
            />
          </div>
          <div className="mb-3 min-w-72">
            <p className="text-sm font-medium text-gray-700 mb-2">Password</p>
            <input
              onChange={(e) => setpassword(e.target.value)}
              value={password}
              className="rounded-md w-full px-3 py-2 border border-gray-300 outline-none"
              type="password"
              placeholder="your password"
              required
            />
          </div>
          <button className="bg-black text-white py-2 px-4 w-full mt-3 rounded-md">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
