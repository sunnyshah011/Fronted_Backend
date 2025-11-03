// import { createContext, useState, useEffect, useCallback } from "react";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useQuery, useQueryClient } from "@tanstack/react-query";

// const ShopContext = createContext();

// const ShopContextProvider = (props) => {
//   const currency = "Rs.";
//   const delivery_fee = 150;
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;
//   const navigate = useNavigate();
//   const queryClient = useQueryClient();

//   // State variables
//   const [cartitem, setCartitem] = useState({});
//   const [products, setProducts] = useState([]);
//   const [token, setToken] = useState(null);
//   const [address, setAddress] = useState(null);

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

//   const fetchCategories = async (backendUrl) => {
//     try {
//       const { data } = await axios.get(`${backendUrl}/api/categories`);
//       if (Array.isArray(data.categories)) {
//         return data.categories.slice(0, 5); // same as your previous logic
//       }
//       return [];
//     } catch (error) {
//       console.error("Error fetching categories:");
//       return [];
//     }
//   };

//   const {
//     data: categories = [],
//     isLoading,
//     isError,
//   } = useQuery({
//     queryKey: ["categories"],
//     queryFn: () => fetchCategories(backendUrl),
//     staleTime: 1000 * 60 * 10,
//     cacheTime: 1000 * 60 * 30,
//     refetchOnWindowFocus: false,
//     retry: 1,
//   });


//   // React Query: userDetails
//   const { data: userDetails, isLoading: isLoadingUser } = useQuery({
//     queryKey: ["userDetails", token],
//     queryFn: async () => {
//       const res = await axios.post(
//         `${backendUrl}/api/user/user-data`,
//         {},
//         { headers: { token } }
//       );
//       if (!res.data.success) throw new Error("Failed to fetch user data");
//       return res.data.message;
//     },
//     enabled: !!token, // only fetch if token exists
//     staleTime: 5 * 60 * 1000,
//     refetchOnWindowFocus: false,
//     onError: (error) => handleApiError(error),
//   });

//   // Functions
//   const updateAddress = useCallback((newAddress) => {
//     setAddress(newAddress);
//   }, []);

//   const addtocart = useCallback(
//     async (itemId, size, color, quantity = 1) => {
//       if (!size && !color) return toast.error("Select size/color");

//       if (!token) {
//         const existing = toast.isActive("login-toast");

//         if (existing) {
//           toast.update("login-toast", {
//             render: (
//               <div className="flex flex-col items-center animate-pulse">
//                 <p className="mb-2">
//                   Please login or register to add items to cart!
//                 </p>
//                 <button
//                   onClick={() => {
//                     navigate("/login");
//                     toast.dismiss("login-toast");
//                   }}
//                   className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
//                 >
//                   Go to Login
//                 </button>
//               </div>
//             ),
//             className: "custom-toast-center",
//           });
//         } else {
//           toast.info(
//             <div className="flex flex-col items-center">
//               <p className="mb-2">
//                 Please login or register to add items to cart!
//               </p>
//               <button
//                 onClick={() => {
//                   navigate("/register");
//                   toast.dismiss("login-toast");
//                 }}
//                 className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
//               >
//                 Go to Login
//               </button>
//             </div>,
//             {
//               toastId: "login-toast",
//               className: "custom-toast-center",
//               autoClose: true,
//               closeOnClick: false,
//               draggable: false,
//             }
//           );
//         }

//         return;
//       }

//       // 🧠 Get current cart quantity
//       const cartdata = structuredClone(cartitem);
//       const currentQty = cartdata[itemId]?.[size]?.[color] || 0;

//       // 🧠 Validate stock from products (must have 'products' available in context)
//       const product = products?.find((p) => p._id === itemId);
//       const variant = product?.variants?.find(
//         (v) => v.size === size && v.color === color
//       );
//       const maxStock = variant?.stock || 0;

//       // ✅ Prevent adding more than available stock
//       if (currentQty + quantity > maxStock) {
//         toast.error(`Only ${maxStock - currentQty} items left in stock`);
//         return;
//       }

//       // 🛒 Proceed to add
//       if (!cartdata[itemId]) cartdata[itemId] = {};
//       if (!cartdata[itemId][size]) cartdata[itemId][size] = {};
//       cartdata[itemId][size][color] = currentQty + quantity;

//       setCartitem(cartdata);
//       toast.success("Product added to cart!", {
//         className: "custom-toast-center",
//         autoClose: true,
//         closeOnClick: false,
//         draggable: false,
//       });

//       // ✅ Update backend
//       if (token) {
//         try {
//           await axios.post(
//             `${backendUrl}/api/cart/add`,
//             { itemId, size, color, quantity },
//             { headers: { token } }
//           );
//           queryClient.invalidateQueries(["cart", token]); // refresh cart query
//         } catch (error) {
//           handleApiError(error);
//         }
//       }
//     },
//     [cartitem, products, token, backendUrl, navigate, queryClient]
//   );

//   // ✅ Get Cart Count
//   const getcartcount = useCallback(() => {
//     let totalcount = 0;
//     for (const productId in cartitem) {
//       for (const size in cartitem[productId]) {
//         for (const color in cartitem[productId][size]) {
//           totalcount += cartitem[productId][size][color];
//         }
//       }
//     }
//     return totalcount;
//   }, [cartitem]);

//   // ✅ Update Quantity
//   const updateQuantity = useCallback(
//     async (itemId, size, color, quantity) => {
//       const cartdata = structuredClone(cartitem);
//       if (!cartdata[itemId]) return;

//       if (quantity <= 0) {
//         delete cartdata[itemId][size][color];
//         if (Object.keys(cartdata[itemId][size]).length === 0)
//           delete cartdata[itemId][size];
//         if (Object.keys(cartdata[itemId]).length === 0) delete cartdata[itemId];
//         toast.info("Item removed from cart", {
//           className: "custom-toast-center",
//           closeOnClick: false,
//           draggable: false,
//           autoClose: 1000,
//         });
//       } else {
//         if (!cartdata[itemId][size]) cartdata[itemId][size] = {};
//         cartdata[itemId][size][color] = quantity;
//         toast.success("Cart Updated!!", {
//           className: "custom-toast-center",
//           closeOnClick: false,
//           draggable: false,
//           autoClose: 1000,
//         });
//       }

//       setCartitem(cartdata);

//       if (token) {
//         try {
//           await axios.post(
//             `${backendUrl}/api/cart/update`,
//             { itemId, size, color, quantity },
//             { headers: { token } }
//           );
//           queryClient.invalidateQueries(["cart", token]);
//         } catch (error) {
//           handleApiError(error);
//         }
//       }
//     },
//     [cartitem, token, backendUrl, queryClient]
//   );

//   // ✅ Calculate total amount
//   const calculatetotalamount = useCallback(() => {
//     let total = 0;
//     for (const productId in cartitem) {
//       const product = products.find((p) => p._id === productId);
//       if (!product) continue;
//       for (const size in cartitem[productId]) {
//         for (const color in cartitem[productId][size]) {
//           const qty = cartitem[productId][size][color];
//           const variant = product.variants.find(
//             (v) => v.size === size && v.color === color
//           );
//           if (variant) total += variant.price * qty;
//         }
//       }
//     }
//     return total;
//   }, [cartitem, products]);

//   // ✅ Fetching Products (TanStack Query)
//   const { data: productsData, isLoading: isLoadingProductsQuery } = useQuery({
//     queryKey: ["products"],
//     queryFn: async () => {
//       const response = await axios.get(`${backendUrl}/api/product/list`);
//       if (!response.data.success) throw new Error(response.data.message);
//       return response.data.products;
//     },
//     staleTime: 5 * 60 * 1000,
//     refetchOnWindowFocus: false,
//     onError: (error) => handleApiError(error),
//   });

//   useEffect(() => {
//     if (productsData) setProducts(productsData);
//   }, [productsData]);

//   // ✅ Fetch User Cart
//   const {
//     data: cartDataQuery,
//     isLoading: isLoadingCartQuery,
//     refetch: refetchCartQuery,
//   } = useQuery({
//     queryKey: ["cart", token],
//     queryFn: async () => {
//       if (!token) return {};
//       const response = await axios.post(
//         `${backendUrl}/api/cart/get`,
//         {},
//         { headers: { token } }
//       );
//       if (!response.data.success) throw new Error("Failed to fetch cart");
//       return response.data.cartData || {};
//     },
//     enabled: !!token,
//     refetchOnWindowFocus: false,
//     onError: (error) => handleApiError(error),
//   });

//   useEffect(() => {
//     if (cartDataQuery) {
//       setCartitem(cartDataQuery);
//     }
//   }, [cartDataQuery]);

//   // ✅ Fetch Profile Data
//   const {
//     data: profileData,
//     isLoading: isLoadingProfileQuery,
//     refetch: refetchProfileQuery,
//   } = useQuery({
//     queryKey: ["profile", token],
//     queryFn: async () => {
//       if (!token) return {};
//       const response = await axios.post(
//         `${backendUrl}/api/profile/getprofile`,
//         {},
//         { headers: { token } }
//       );
//       if (!response.data.success) throw new Error("Failed to fetch profile");
//       return response.data.userprofiledet || {};
//     },
//     enabled: !!token,
//     refetchOnWindowFocus: false,
//     onError: (error) => handleApiError(error),
//   });

//   useEffect(() => {
//     if (profileData?.address) setAddress(profileData.address);
//   }, [profileData]);

//   // Load token & cart from localStorage
//   useEffect(() => {
//     const savedToken = localStorage.getItem("token");
//     if (savedToken) setToken(savedToken);
//     else queryClient.clear();
//   }, []);


//   // Context value
//   const value = {
//     isError,
//     isLoading,
//     categories,
//     currency,
//     delivery_fee,
//     products,
//     cartitem,
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
//     userDetails,
//     isLoadingUser,
//     queryClient,
//     refetchCartQuery,
//     refetchProfileQuery,
//     isLoadingProducts: isLoadingProductsQuery,
//     isLoadingCart: isLoadingCartQuery,
//     isLoadingProfile: isLoadingProfileQuery,
//   };

//   return (
//     <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
//   );
// };

// export default ShopContextProvider;
// export { ShopContext };


import { createContext, useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "Rs.";
  const delivery_fee = 150;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [cartitem, setCartitem] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(null);
  const [address, setAddress] = useState(null);

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

  const fetchCategories = async (backendUrl) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/categories`);
      if (Array.isArray(data.categories)) {
        return data.categories.slice(0, 5);
      }
      return [];
    } catch (error) {
      console.error("Error fetching categories:");
      return [];
    }
  };

  const {
    data: categories = [],
    isLoading,
    isError,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => fetchCategories(backendUrl),
    enabled: !!backendUrl,
    staleTime: 1000 * 60 * 10,
    cacheTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  // ✅ FIX: ensure refetch triggers render after mount
  useEffect(() => {
    if (!backendUrl) return;
    const timer = setTimeout(() => {
      refetchCategories({ cancelRefetch: false });
    }, 100);
    return () => clearTimeout(timer);
  }, [backendUrl, refetchCategories]);

  const { data: userDetails, isLoading: isLoadingUser } = useQuery({
    queryKey: ["userDetails", token],
    queryFn: async () => {
      const res = await axios.post(
        `${backendUrl}/api/user/user-data`,
        {},
        { headers: { token } }
      );
      if (!res.data.success) throw new Error("Failed to fetch user data");
      return res.data.message;
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    onError: (error) => handleApiError(error),
  });

  const updateAddress = useCallback((newAddress) => {
    setAddress(newAddress);
  }, []);

  const addtocart = useCallback(
    async (itemId, size, color, quantity = 1) => {

     

      if (!token) {
        const existing = toast.isActive("login-toast");

        if (existing) {
          toast.update("login-toast", {
            render: (
              <div className="flex flex-col items-center animate-pulse">
                <p className="mb-2">
                  Please login or register to add items to cart!
                </p>
                <button
                  onClick={() => {
                    navigate("/login");
                    toast.dismiss("login-toast");
                  }}
                  className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
                >
                  Go to Login
                </button>
              </div>
            ),
            className: "custom-toast-center",
          });
        } else {
          toast.info(
            <div className="flex flex-col items-center">
              <p className="mb-2">
                Please login or register to add items to cart!
              </p>
              <button
                onClick={() => {
                  navigate("/register");
                  toast.dismiss("login-toast");
                }}
                className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700"
              >
                Go to Login
              </button>
            </div>,
            {
              toastId: "login-toast",
              className: "custom-toast-center",
              autoClose: true,
              closeOnClick: false,
              draggable: false,
            }
          );
        }

        return;
      }

       if (!size && !color) return toast.error("Select size & color");

      const cartdata = structuredClone(cartitem);
      const currentQty = cartdata[itemId]?.[size]?.[color] || 0;

      const product = products?.find((p) => p._id === itemId);
      const variant = product?.variants?.find(
        (v) => v.size === size && v.color === color
      );
      const maxStock = variant?.stock || 0;

      if (currentQty + quantity > maxStock) {
        toast.error(`Only ${maxStock - currentQty} items left in stock`);
        return;
      }

      if (!cartdata[itemId]) cartdata[itemId] = {};
      if (!cartdata[itemId][size]) cartdata[itemId][size] = {};
      cartdata[itemId][size][color] = currentQty + quantity;

      setCartitem(cartdata);
      toast.success("Product added to cart!", {
        className: "custom-toast-center",
        autoClose: true,
        closeOnClick: false,
        draggable: false,
      });

      if (token) {
        try {
          await axios.post(
            `${backendUrl}/api/cart/add`,
            { itemId, size, color, quantity },
            { headers: { token } }
          );
          queryClient.invalidateQueries(["cart", token]);
        } catch (error) {
          handleApiError(error);
        }
      }
    },
    [cartitem, products, token, backendUrl, navigate, queryClient]
  );


  
  const getcartcount = useCallback(() => {
    let totalcount = 0;
    for (const productId in cartitem) {
      for (const size in cartitem[productId]) {
        for (const color in cartitem[productId][size]) {
          totalcount += cartitem[productId][size][color];
        }
      }
    }
    return totalcount;
  }, [cartitem]);

  const updateQuantity = useCallback(
    async (itemId, size, color, quantity) => {
      const cartdata = structuredClone(cartitem);
      if (!cartdata[itemId]) return;

      if (quantity <= 0) {
        delete cartdata[itemId][size][color];
        if (Object.keys(cartdata[itemId][size]).length === 0)
          delete cartdata[itemId][size];
        if (Object.keys(cartdata[itemId]).length === 0) delete cartdata[itemId];
        toast.info("Item removed from cart", {
          className: "custom-toast-center",
          closeOnClick: false,
          draggable: false,
          autoClose: 1000,
        });
      } else {
        if (!cartdata[itemId][size]) cartdata[itemId][size] = {};
        cartdata[itemId][size][color] = quantity;
        toast.success("Cart Updated!!", {
          className: "custom-toast-center",
          closeOnClick: false,
          draggable: false,
          autoClose: 1000,
        });
      }

      setCartitem(cartdata);

      if (token) {
        try {
          await axios.post(
            `${backendUrl}/api/cart/update`,
            { itemId, size, color, quantity },
            { headers: { token } }
          );
          queryClient.invalidateQueries(["cart", token]);
        } catch (error) {
          handleApiError(error);
        }
      }
    },
    [cartitem, token, backendUrl, queryClient]
  );

  const calculatetotalamount = useCallback(() => {
    let total = 0;
    for (const productId in cartitem) {
      const product = products.find((p) => p._id === productId);
      if (!product) continue;
      for (const size in cartitem[productId]) {
        for (const color in cartitem[productId][size]) {
          const qty = cartitem[productId][size][color];
          const variant = product.variants.find(
            (v) => v.size === size && v.color === color
          );
          if (variant) total += variant.price * qty;
        }
      }
    }
    return total;
  }, [cartitem, products]);

  const { data: productsData } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      if (!response.data.success) throw new Error(response.data.message);
      return response.data.products;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    onError: (error) => handleApiError(error),
  });

  useEffect(() => {
    if (productsData) setProducts(productsData);
  }, [productsData]);

  const { data: cartDataQuery } = useQuery({
    queryKey: ["cart", token],
    queryFn: async () => {
      if (!token) return {};
      const response = await axios.post(
        `${backendUrl}/api/cart/get`,
        {},
        { headers: { token } }
      );
      if (!response.data.success) throw new Error("Failed to fetch cart");
      return response.data.cartData || {};
    },
    enabled: !!token,
    refetchOnWindowFocus: false,
    onError: (error) => handleApiError(error),
  });

  useEffect(() => {
    if (cartDataQuery) {
      setCartitem(cartDataQuery);
    }
  }, [cartDataQuery]);

  const { data: profileData } = useQuery({
    queryKey: ["profile", token],
    queryFn: async () => {
      if (!token) return {};
      const response = await axios.post(
        `${backendUrl}/api/profile/getprofile`,
        {},
        { headers: { token } }
      );
      if (!response.data.success) throw new Error("Failed to fetch profile");
      return response.data.userprofiledet || {};
    },
    enabled: !!token,
    refetchOnWindowFocus: false,
    onError: (error) => handleApiError(error),
  });

  useEffect(() => {
    if (profileData?.address) setAddress(profileData.address);
  }, [profileData]);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) setToken(savedToken);
    else queryClient.clear();
  }, []);

  const value = useMemo(
    () => ({
      isError,
      isLoading,
      categories,
      currency,
      delivery_fee,
      products,
      cartitem,
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
      userDetails,
      isLoadingUser,
      queryClient,
    }),
    [
      isError,
      isLoading,
      categories,
      products,
      cartitem,
      token,
      address,
      userDetails,
      isLoadingUser,
    ]
  );

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
export { ShopContext };
