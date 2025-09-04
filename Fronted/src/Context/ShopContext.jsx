// import { createContext, useState, useEffect, useCallback } from "react";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useQuery } from "@tanstack/react-query";

// const ShopContext = createContext();

// const ShopContextProvider = (props) => {
//   const currency = "Rs.";
//   const delivery_fee = 200;
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;
//   const navigate = useNavigate();

//   // State variables
//   const [cartitem, setCartitem] = useState({});
//   const [products, setProducts] = useState([]);
//   const [token, setToken] = useState(null);
//   const [address, setAddress] = useState(null);
//   // const [userDetails, setUserDetails] = useState({});

//   // to fetch user data from backend
//   const { data: userDetails, isLoading, isError } = useQuery(
//     ["userDetails", token],
//     async () => {
//       const res = await axios.post(
//         backendUrl + "/api/user/user-data",
//         {},
//         { headers: { token } }
//       );
//       if (!res.data.success) throw new Error("Failed to fetch user data");
//       return res.data.message;
//     },
//     {
//       enabled: !!token,        // don’t run if no token
//       staleTime: 5 * 60 * 1000, // cache 5 mins
//       refetchOnWindowFocus: false, // no spam calls
//     }
//   );
//   // const getUserData = async () => {
//   //   try {
//   //     const response = await axios.post(
//   //       backendUrl + "/api/user/user-data",
//   //       {},
//   //       { headers: { token } }
//   //     );
//   //     if (response.data.success) {
//   //       setUserDetails(response.data.message || {});
//   //     } else {
//   //       toast.error("error");
//   //     }
//   //   } catch (error) {
//   //     handleApiError(error);
//   //   }
//   // };

//   // Loading states
//   const [isLoadingProducts, setIsLoadingProducts] = useState(false);
//   const [isLoadingCart, setIsLoadingCart] = useState(false);
//   const [isLoadingProfile, setIsLoadingProfile] = useState(false);

//   // Centralized error handler
//   const handleApiError = (error) => {
//     const message =
//       error?.response?.data?.message || error.message || "Something went wrong";
//     toast.error(message, {
//       position: "top-center",
//       className: "custom-toast-center",
//       bodyClassName: "text-sm",
//       closeOnClick: true,
//       pauseOnHover: true,
//       autoClose: 2000,
//     });
//   };

//   // Function to update address manually from anywhere
//   const updateAddress = useCallback((newAddress) => {
//     setAddress(newAddress);
//   }, []);

//   // Add to cart function
//   const addtocart = useCallback(
//     async (itemId, size) => {
//       if (!size) {
//         toast.error("Please Select Size!", {
//           position: "top-center",
//           className: "custom-toast-center",
//           bodyClassName: "text-sm",
//           closeOnClick: true,
//           pauseOnHover: true,
//           autoClose: 2000,
//         });
//         return;
//       }

//       let cartdata = structuredClone(cartitem);
//       if (cartdata[itemId]) {
//         cartdata[itemId][size] = (cartdata[itemId][size] || 0) + 1;
//       } else {
//         cartdata[itemId] = { [size]: 1 };
//       }
//       setCartitem(cartdata);
//       localStorage.setItem("cartItems", JSON.stringify(cartdata));

//       toast.success("Product added to cart!", {
//         position: "top-center",
//         className: "custom-toast-center",
//         bodyClassName: "text-sm",
//         autoClose: 2000,
//         closeOnClick: true,
//         pauseOnHover: true,
//       });

//       if (token) {
//         try {
//           await axios.post(
//             backendUrl + "/api/cart/add",
//             { itemId, size },
//             { headers: { token } }
//           );
//         } catch (error) {
//           handleApiError(error);
//         }
//       }
//     },
//     [cartitem, token, backendUrl]
//   );

//   // Get total cart count
//   const getcartcount = useCallback(() => {
//     let totalcount = 0;
//     for (const items in cartitem) {
//       for (const item in cartitem[items]) {
//         try {
//           if (cartitem[items][item] > 0) {
//             totalcount += cartitem[items][item];
//           }
//         } catch (error) {
//           console.error(error);
//         }
//       }
//     }
//     return totalcount;
//   }, [cartitem]);

//   // Update quantity in cart
//   const updateQuantity = useCallback(
//     async (itemId, size, quantity) => {
//       let cartdata = structuredClone(cartitem);

//       if (quantity <= 0) {
//         if (cartdata[itemId] && cartdata[itemId][size]) {
//           delete cartdata[itemId][size];
//           if (Object.keys(cartdata[itemId]).length === 0) {
//             delete cartdata[itemId];
//           }
//         }
//         setCartitem(cartdata);
//         localStorage.setItem("cartItems", JSON.stringify(cartdata));

//         if (token) {
//           try {
//             await axios.post(
//               backendUrl + "/api/cart/update",
//               { itemId, size, quantity },
//               { headers: { token } }
//             );
//           } catch (error) {
//             handleApiError(error);
//           }
//         }

//         toast.info("Item removed from cart", {
//           position: "top-center",
//           className: "custom-toast-center",
//           bodyClassName: "text-sm",
//           autoClose: 1000,
//           closeOnClick: true,
//           pauseOnHover: true,
//         });
//       } else {
//         cartdata[itemId][size] = quantity;
//         setCartitem(cartdata);
//         localStorage.setItem("cartItems", JSON.stringify(cartdata));

//         const toastId = toast.loading("Updating...", {
//           position: "top-center",
//           className: "custom-toast-center",
//           bodyClassName: "text-sm",
//           closeOnClick: false,
//           draggable: false,
//           closeButton: false,
//         });

//         if (token) {
//           try {
//             await axios.post(
//               backendUrl + "/api/cart/update",
//               { itemId, size, quantity },
//               { headers: { token } }
//             );
//             toast.update(toastId, {
//               render: "Quantity updated",
//               type: "success",
//               isLoading: false,
//               autoClose: 1000,
//               closeOnClick: true,
//               draggable: true,
//               closeButton: true,
//             });
//           } catch (error) {
//             toast.dismiss(toastId);
//             handleApiError(error);
//           }
//         } else {
//           toast.dismiss(toastId);
//         }
//       }
//     },
//     [cartitem, token, backendUrl]
//   );

//   // Calculate total amount
//   const calculatetotalamount = useCallback(() => {
//     let totalamount = 0;
//     for (const items in cartitem) {
//       const cartinfo = products.find((product) => product._id === items);
//       for (const item in cartitem[items]) {
//         try {
//           if (cartinfo) totalamount += cartinfo.price * cartitem[items][item];
//         } catch (error) {
//           console.error(error);
//         }
//       }
//     }
//     return totalamount;
//   }, [cartitem, products]);

//   // Fetch products data
//   const getProductsData = useCallback(async () => {
//     setIsLoadingProducts(true);
//     try {
//       const response = await axios.get(backendUrl + "/api/product/list");
//       if (response.data.success) {
//         setProducts(response.data.products);
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       handleApiError(error);
//     } finally {
//       setIsLoadingProducts(false);
//     }
//   }, [backendUrl]);

//   // Fetch user cart
//   const getUserCart = useCallback(
//     async (token) => {
//       setIsLoadingCart(true);
//       try {
//         const response = await axios.post(
//           backendUrl + "/api/cart/get",
//           {},
//           { headers: { token } }
//         );
//         if (response.data.success) {
//           setCartitem(response.data.cartData || {});
//           localStorage.setItem(
//             "cartItems",
//             JSON.stringify(response.data.cartData || {})
//           );
//         }
//       } catch (error) {
//         handleApiError(error);
//       } finally {
//         setIsLoadingCart(false);
//       }
//     },
//     [backendUrl]
//   );

//   // Fetch profile data
//   const getProfileData = useCallback(async () => {
//     if (!token) return;
//     setIsLoadingProfile(true);
//     try {
//       const response = await axios.post(
//         backendUrl + "/api/profile/getprofile",
//         {},
//         { headers: { token } }
//       );
//       if (response.data.success) {
//         setAddress(response.data.userprofiledet.address || null);
//       } else {
//         toast.error("failed");
//       }
//     } catch (error) {
//       handleApiError(error);
//     } finally {
//       setIsLoadingProfile(false);
//     }
//   }, [token, backendUrl]);

//   // Load token on mount
//   useEffect(() => {
//     const savedToken = localStorage.getItem("token");
//     const savedCart = localStorage.getItem("cartItems");
//     if (savedToken) setToken(savedToken);
//     if (savedCart) setCartitem(JSON.parse(savedCart));
//   }, []);

//   // Fetch products once
//   useEffect(() => {
//     getProductsData();
//   }, [getProductsData]);

//   // Fetch profile data
//   useEffect(() => {
//     getProfileData();
//   }, [getProfileData]);

//   // 🔹 Fix: Fetch cart immediately after login & clear on logout
//   useEffect(() => {
//     if (token) {
//       getUserCart(token);
//     } else {
//       // logout: clear cart
//       setCartitem({});
//       localStorage.setItem("cartItems", JSON.stringify({}));
//     }
//   }, [token, getUserCart]);

//   useEffect(() => {
//     if (token) {
//       getUserData(); // fetch user details
//     } else {
//       setUserDetails(null); // clear user details if no token
//     }
//   }, [token]);

//   // Context value
//   const value = {
//     currency,
//     delivery_fee,
//     products,
//     isLoadingProducts,
//     cartitem,
//     isLoadingCart,
//     addtocart,
//     getcartcount,
//     updateQuantity,
//     calculatetotalamount,
//     setCartitem,
//     navigate,
//     backendUrl,
//     setToken,
//     token,
//     address,
//     setAddress,
//     updateAddress,
//     isLoadingProfile,
//     getUserData,
//     userDetails,
//     // setUserDetails,
//   };

//   return (
//     <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
//   );
// };

// export default ShopContextProvider;
// export { ShopContext };

import { createContext, useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "Rs.";
  const delivery_fee = 200;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State variables
  const [cartitem, setCartitem] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(null);
  const [address, setAddress] = useState(null);

  // Loading states
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  // Centralized error handler
  const handleApiError = (error) => {
    const message =
      error?.response?.data?.message || error.message || "Something went wrong";
    toast.error(message, {
      position: "top-center",
      className: "custom-toast-center",
      bodyClassName: "text-sm",
      closeOnClick: true,
      pauseOnHover: true,
      autoClose: 2000,
    });
  };

  // -----------------------
  // React Query: userDetails
  // -----------------------
  const { data: userDetails, isLoading: isLoadingUser } = useQuery({
    queryKey: ["userDetails", token],
    queryFn: async () => {
      const res = await axios.post(
        backendUrl + "/api/user/user-data",
        {},
        { headers: { token } }
      );
      if (!res.data.success) throw new Error("Failed to fetch user data");
      return res.data.message;
    },
    enabled: !!token, // only fetch if token exists
    staleTime: 5 * 60 * 1000, // cache 5 minutes
    refetchOnWindowFocus: false, // avoid refetch on window focus
  });

  // -----------------------
  // Functions
  // -----------------------
  const updateAddress = useCallback((newAddress) => {
    setAddress(newAddress);
  }, []);

  // const addtocart = useCallback(
  //   async (itemId, size) => {
  //     if (!size) {
  //       toast.error("Please Select Size!");
  //       return;
  //     }
  //     let cartdata = structuredClone(cartitem);
  //     if (cartdata[itemId]) {
  //       cartdata[itemId][size] = (cartdata[itemId][size] || 0) + 1;
  //     } else {
  //       cartdata[itemId] = { [size]: 1 };
  //     }
  //     setCartitem(cartdata);
  //     localStorage.setItem("cartItems", JSON.stringify(cartdata));

  //     toast.success("Product added to cart!");

  //     if (token) {
  //       try {
  //         await axios.post(
  //           backendUrl + "/api/cart/add",
  //           { itemId, size },
  //           { headers: { token } }
  //         );
  //       } catch (error) {
  //         handleApiError(error);
  //       }
  //     }
  //   },
  //   [cartitem, token, backendUrl]
  // );

  // const getcartcount = useCallback(() => {
  //   let totalcount = 0;
  //   for (const items in cartitem) {
  //     for (const item in cartitem[items]) {
  //       totalcount += cartitem[items][item];
  //     }
  //   }
  //   return totalcount;
  // }, [cartitem]);

  // const updateQuantity = useCallback(
  //   async (itemId, size, quantity) => {
  //     let cartdata = structuredClone(cartitem);

  //     if (quantity <= 0) {
  //       if (cartdata[itemId] && cartdata[itemId][size]) {
  //         delete cartdata[itemId][size];
  //         if (Object.keys(cartdata[itemId]).length === 0) {
  //           delete cartdata[itemId];
  //         }
  //       }
  //       setCartitem(cartdata);
  //       localStorage.setItem("cartItems", JSON.stringify(cartdata));
  //       if (token) {
  //         try {
  //           await axios.post(
  //             backendUrl + "/api/cart/update",
  //             { itemId, size, quantity },
  //             { headers: { token } }
  //           );
  //         } catch (error) {
  //           handleApiError(error);
  //         }
  //       }
  //       toast.info("Item removed from cart", { autoClose: 1000 });
  //     } else {
  //       cartdata[itemId][size] = quantity;
  //       setCartitem(cartdata);
  //       localStorage.setItem("cartItems", JSON.stringify(cartdata));
  //       if (token) {
  //         try {
  //           await axios.post(
  //             backendUrl + "/api/cart/update",
  //             { itemId, size, quantity },
  //             { headers: { token } }
  //           );
  //         } catch (error) {
  //           handleApiError(error);
  //         }
  //       }
  //     }
  //   },
  //   [cartitem, token, backendUrl]
  // );

  // const calculatetotalamount = useCallback(() => {
  //   let totalamount = 0;
  //   for (const items in cartitem) {
  //     const cartinfo = products.find((product) => product._id === items);
  //     for (const item in cartitem[items]) {
  //       if (cartinfo) totalamount += cartinfo.price * cartitem[items][item];
  //     }
  //   }
  //   return totalamount;
  // }, [cartitem, products]);

  // ✅ Add to Cart
  const addtocart = useCallback(
    async (itemId, size, color, quantity = 1) => {
      if (!size && !color) {
        toast.error("Please select size and/or color!");
        return;
      }

      const key = `${size || ""}|${color || ""}`; // unique key for size+color
      let cartdata = structuredClone(cartitem);

      if (cartdata[itemId]) {
        cartdata[itemId][key] = (cartdata[itemId][key] || 0) + quantity;
      } else {
        cartdata[itemId] = { [key]: quantity };
      }

      setCartitem(cartdata);
      localStorage.setItem("cartItems", JSON.stringify(cartdata));
      toast.success("Product added to cart!");

      if (token) {
        try {
          await axios.post(
            backendUrl + "/api/cart/add",
            { itemId, size, color, quantity },
            { headers: { token } }
          );
        } catch (error) {
          handleApiError(error);
        }
      }
    },
    [cartitem, token, backendUrl]
  );

  // ✅ Get Cart Count
  const getcartcount = useCallback(() => {
    let totalcount = 0;
    for (const items in cartitem) {
      for (const key in cartitem[items]) {
        totalcount += cartitem[items][key];
      }
    }
    return totalcount;
  }, [cartitem]);

  // ✅ Update Quantity
  const updateQuantity = useCallback(
    async (itemId, size, color, quantity) => {
      const key = `${size || ""}|${color || ""}`;
      let cartdata = structuredClone(cartitem);

      if (quantity <= 0) {
        if (cartdata[itemId] && cartdata[itemId][key]) {
          delete cartdata[itemId][key];
          if (Object.keys(cartdata[itemId]).length === 0) {
            delete cartdata[itemId];
          }
        }
        setCartitem(cartdata);
        localStorage.setItem("cartItems", JSON.stringify(cartdata));

        if (token) {
          try {
            await axios.post(
              backendUrl + "/api/cart/update",
              { itemId, size, color, quantity },
              { headers: { token } }
            );
          } catch (error) {
            handleApiError(error);
          }
        }
        toast.info("Item removed from cart", { autoClose: 1000 });
      } else {
        if (!cartdata[itemId]) cartdata[itemId] = {};
        cartdata[itemId][key] = quantity;
        setCartitem(cartdata);
        localStorage.setItem("cartItems", JSON.stringify(cartdata));

        if (token) {
          try {
            await axios.post(
              backendUrl + "/api/cart/update",
              { itemId, size, color, quantity },
              { headers: { token } }
            );
          } catch (error) {
            handleApiError(error);
          }
        }
      }
    },
    [cartitem, token, backendUrl]
  );

  // ✅ Calculate Total Amount
  const calculatetotalamount = useCallback(() => {
    let totalamount = 0;
    for (const items in cartitem) {
      const cartinfo = products.find((product) => product._id === items);
      for (const key in cartitem[items]) {
        if (cartinfo) {
          totalamount += cartinfo.price * cartitem[items][key];
        }
      }
    }
    return totalamount;
  }, [cartitem, products]);

  const getProductsData = useCallback(async () => {
    setIsLoadingProducts(true);
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setProducts(response.data.products);
        console.log(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoadingProducts(false);
    }
  }, [backendUrl]);

  const getUserCart = useCallback(
    async (token) => {
      setIsLoadingCart(true);
      try {
        const response = await axios.post(
          backendUrl + "/api/cart/get",
          {},
          { headers: { token } }
        );
        if (response.data.success) {
          setCartitem(response.data.cartData || {});
          localStorage.setItem(
            "cartItems",
            JSON.stringify(response.data.cartData || {})
          );
        }
      } catch (error) {
        handleApiError(error);
      } finally {
        setIsLoadingCart(false);
      }
    },
    [backendUrl]
  );

  const getProfileData = useCallback(async () => {
    if (!token) return;
    setIsLoadingProfile(true);
    try {
      const response = await axios.post(
        backendUrl + "/api/profile/getprofile",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setAddress(response.data.userprofiledet.address || null);
      } else {
        toast.error("Failed to fetch profile");
      }
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [token, backendUrl]);

  // -----------------------
  // Effects
  // -----------------------
  // Load token & cart from localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedCart = localStorage.getItem("cartItems");
    if (savedToken) setToken(savedToken);
    if (savedCart) setCartitem(JSON.parse(savedCart));
  }, []);

  // Fetch products once
  useEffect(() => {
    getProductsData();
  }, [getProductsData]);

  // Fetch profile
  useEffect(() => {
    getProfileData();
  }, [getProfileData]);

  // Fetch cart after login/logout
  useEffect(() => {
    if (token) getUserCart(token);
    else {
      setCartitem({});
      localStorage.setItem("cartItems", JSON.stringify({}));
    }
  }, [token, getUserCart]);

  // -----------------------
  // Context value
  // -----------------------
  const value = {
    currency,
    delivery_fee,
    products,
    isLoadingProducts,
    cartitem,
    isLoadingCart,
    addtocart,
    getcartcount,
    updateQuantity,
    calculatetotalamount,
    setCartitem,
    navigate,
    backendUrl,
    setToken,
    token,
    address,
    setAddress,
    updateAddress,
    isLoadingProfile,
    userDetails, // reactive via React Query
    isLoadingUser,
    queryClient, // optionally expose for invalidation
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
export { ShopContext };
