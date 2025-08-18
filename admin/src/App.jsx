import { Routes, Route } from "react-router-dom";
import "./index.css";
import Navbar from "./component/Navbar";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Order from "./pages/Order";
import Placeorder from "./pages/PlaceOrder";
import Product from "./pages/Product";
import Footer from './component/Footer'
import { ToastContainer, toast } from 'react-toastify';
import NotFound from "./component/NotFound";
import Register from "./pages/Register";

const App = () => {
  return (
    <div className="flex flex-col min-h-screen sm:px-[4vw] md:px-[5vw] lg:px-[7vw]">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        // pauseOnFocusLoss
        draggable
        toastClassName="text-sm px-3 py-2 rounded-md"
        bodyClassName="text-sm"
      />

      <Navbar />

      {/* This makes main content grow and push footer down */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/collection" element={<Collection />} />
          <Route path="/order" element={<Order />} />
          <Route path="/placeorder" element={<Placeorder />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer stays at bottom, no absolute positioning needed */}
      <Footer />
    </div>
  );
};

export default App
