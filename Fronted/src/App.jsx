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
import Footer from "./component/Footer";
import { ToastContainer } from "react-toastify";
import NotFound from "./component/NotFound";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Account from "./pages/Account";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import Breadcrumbs from "./component/Breadcrumb";
import CategoryPage from "./pages/CategoryPage";
import CategoryPageGroup from "./pages/CategoryPageGroup";
import AllFlashSaleProducts from "./pages/AllFlashSaleProducts";
import AllTopProducts from "./pages/AllTopProducts";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        toastClassName="text-sm px-3 py-2 rounded-md"
        bodyClassName="text-sm"
      />

      {/* Wrapper that limits width */}
      <div className="flex flex-col flex-grow mx-auto w-full max-w-[1250px] ">
        <Navbar />
        <Breadcrumbs />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/email-verify" element={<EmailVerify />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            <Route path="/profile" element={<Profile />} />
            <Route path="/manage-account" element={<Account />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/cart" element={<Cart />} />

            {/* category -> subcategory -> product */}
            <Route path="/categories" element={<CategoryPageGroup />} />
            <Route
              path="/categories/:categorySlug"
              element={<CategoryPage />}
            />
            <Route
              path="/categories/:categorySlug/:productSlug"
              element={<Product />}
            />

            <Route path="/order" element={<Order />} />
            <Route path="/placeorder" element={<Placeorder />} />

            {/* FlashSale and Topproducts pages */}
            <Route
              path="/all-flash-sale-products"
              element={<AllFlashSaleProducts />}
            />
            <Route path="/all-top-products" element={<AllTopProducts />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default App;
