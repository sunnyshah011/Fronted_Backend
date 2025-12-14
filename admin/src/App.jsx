import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Add from "./pages/Add";
import List from "./pages/List";
import Order from "./pages/Order";
import Login from "./components/Login";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Location from "./pages/Location";
import CategoryManager from "./pages/Category";
import PaymentMethod from "./pages/PaymentMethod";

export const BackendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const [token, settoken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen p-2">
      <ToastContainer />
      {token === "" ? (
        <Login settoken={settoken} />
      ) : (
        <>
          <Navbar settoken={settoken} />
          <hr />
          <div className="flex w-full">
            <Sidebar />
            <div className="w-[75%] mx-auto ml-[max(3vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
                <Route />
                <Route path="/add" element={<Add token={token} />} />
                <Route path="/list" element={<List token={token} />} />
                <Route path="/order" element={<Order token={token} />} />
                <Route path="/location" element={<Location token={token} />} />
                <Route path="/category-manager" element={<CategoryManager token={token} />} />
                <Route path="/payment-methods" element={<PaymentMethod token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
