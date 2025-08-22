import { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "Rs.";
  const delivery_fee = 200;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [cartitem, setcartitem] = useState({});
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const [user, setUser] = useState("");

  const addtocart = async (itemId, size) => {
    if (!size) {
      toast.error("Please Select Size!", {
        position: "top-center", // still needed, but we'll override
        className: "custom-toast-center",
        bodyClassName: "text-sm",
        closeOnClick: true,
        pauseOnHover: true,
        autoClose: 2000,
      });
      return;
    }

    let cartdata = structuredClone(cartitem);
    if (cartdata[itemId]) {
      if (cartdata[itemId][size]) {
        cartdata[itemId][size] += 1;
      } else {
        cartdata[itemId][size] = 1;
      }
    } else {
      cartdata[itemId] = {};
      cartdata[itemId][size] = 1;
    }
    setcartitem(cartdata);

    toast.success("Product added to cart!", {
      position: "top-center",
      className: "custom-toast-center",
      bodyClassName: "text-sm",
      autoClose: 2000,
      closeOnClick: true,
      pauseOnHover: true,
    });

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size },
          { headers: { token } }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getcartcount = () => {
    let totalcount = 0;
    for (const items in cartitem) {
      for (const item in cartitem[items]) {
        try {
          if (cartitem[items][item] > 0) {
            totalcount += cartitem[items][item];
          }
        } catch (error) {
          console.log(error.getMessage());
        }
      }
    }
    return totalcount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartdata = structuredClone(cartitem);

    if (quantity <= 0) {
      // Remove the item size from cart if quantity is 0 or less
      if (cartdata[itemId] && cartdata[itemId][size]) {
        delete cartdata[itemId][size];

        // If no sizes left for this item, remove the whole item entry
        if (Object.keys(cartdata[itemId]).length === 0) {
          delete cartdata[itemId];
        }
      }

      setcartitem(cartdata);
        if (token) {
        try {
          await axios.post(
            backendUrl + "/api/cart/update",
            { itemId, size, quantity },
            { headers: { token } }
          );
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      }
      // Toast for remove
      toast.info("Item removed from cart", {
        position: "top-center",
        className: "custom-toast-center",
        bodyClassName: "text-sm",
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    } else {
      // Just update quantity
      cartdata[itemId][size] = quantity;
      setcartitem(cartdata);

      // Show loading toast first
      const toastId = toast.loading("...", {
        position: "top-center",
        className: "custom-toast-center",
        bodyClassName: "text-sm",
        closeOnClick: false,
        draggable: false,
        closeButton: false,
      });

      // After 1.5 seconds, update toast to success
      setTimeout(() => {
        toast.update(toastId, {
          render: "",
          type: "success",
          isLoading: false,
          autoClose: 500,
          closeOnClick: true,
          draggable: true,
          closeButton: true,
        });
      }, 500);

      if (token) {
        try {
          await axios.post(
            backendUrl + "/api/cart/update",
            { itemId, size, quantity },
            { headers: { token } }
          );
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      }
    }
  };

  const calculatetotalamount = () => {
    let totalamount = 0;
    for (const items in cartitem) {
      const cartinfo = products.find((product) => product._id === items);
      for (const item in cartitem[items]) {
        try {
          if (cartitem[items][item] > 0) {
            totalamount += cartinfo.price * cartitem[items][item];
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
    return totalamount;
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setcartitem(response.data.cartData);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getUserCart(localStorage.getItem("token"));
    }
  }, []);

  useEffect(() => {
    if (!user && localStorage.getItem("user")) {
      setUser(localStorage.getItem("user"));
    }
  }, []);

   useEffect(() => {
    if (!user && localStorage.getItem("token")) {
      
    }
  }, []);

  const value = {
    products,
    currency,
    delivery_fee,
    cartitem,
    addtocart,
    getcartcount,
    updateQuantity,
    calculatetotalamount,
    setcartitem,
    navigate,
    backendUrl,
    setToken,
    token,
    user,
    setUser,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
export { ShopContext };
