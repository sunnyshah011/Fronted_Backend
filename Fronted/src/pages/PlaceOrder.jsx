// import { useContext, useState, useEffect } from "react";
// import CartTotal from "../component/CartTotal";
// import { ShopContext } from "../Context/ShopContext";
// import axios from "axios";
// import { toast } from "react-toastify";

// const Placeorder = () => {
//   const [payment, setPayment] = useState(false);
//   const {
//     navigate,
//     backendUrl,
//     token,
//     updateAddress,
//     address,
//     cartitem,
//     setCartitem,
//     calculatetotalamount,
//     delivery_fee,
//     products,
//   } = useContext(ShopContext);

//   const [provinces, setProvinces] = useState([]);
//   const [districts, setDistricts] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [formData, setFormData] = useState({
//     fullName: "",
//     phone: "",
//     province: "",
//     district: "",
//     city: "",
//     streetAddress: "",
//   });
//   const [originalData, setOriginalData] = useState({});
//   const [isModified, setIsModified] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);

//   // Fetch locations
//   const fetchProvinces = async () => {
//     try {
//       const res = await axios.get(`${backendUrl}/api/location/province`);
//       setProvinces(res.data.provinces || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchDistricts = async (province) => {
//     if (!province) return;
//     try {
//       const res = await axios.get(
//         `${backendUrl}/api/location/${province}/districts`
//       );
//       setDistricts(res.data.districts || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchCities = async (province, district) => {
//     if (!province || !district) return;
//     try {
//       const res = await axios.get(
//         `${backendUrl}/api/location/${province}/${district}/cities`
//       );
//       setCities(res.data.cities || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchProvinces();

//     if (address && Object.keys(address).length > 0) {
//       const data = {
//         fullName: address.fullName || address.name || "",
//         phone: address.phone ? String(address.phone) : "",
//         province: address.province || "",
//         district: address.district || "",
//         city: address.city || "",
//         streetAddress: address.streetAddress || address.street || "",
//       };
//       setFormData(data);
//       setOriginalData(data);
//       setIsModified(false);

//       if (address.province) fetchDistricts(address.province);
//       if (address.province && address.district)
//         fetchCities(address.province, address.district);
//     } else {
//       setIsEditing(true);
//     }
//   }, [address]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     const updatedForm = { ...formData, [name]: value };

//     if (name === "province") {
//       updatedForm.district = "";
//       updatedForm.city = "";
//       setDistricts([]);
//       setCities([]);
//       fetchDistricts(value);
//     }

//     if (name === "district") {
//       updatedForm.city = "";
//       setCities([]);
//       fetchCities(updatedForm.province, value);
//     }

//     setFormData(updatedForm);
//     setIsModified(JSON.stringify(updatedForm) !== JSON.stringify(originalData));
//   };

//   const handleReset = () => {
//     setFormData(originalData);
//     setIsModified(false);
//     setIsEditing(false);
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     if (!isModified) return;

//     const payload = {
//       name: formData.fullName,
//       phone: Number(formData.phone),
//       province: formData.province,
//       district: formData.district,
//       city: formData.city,
//       street: formData.streetAddress,
//     };

//     try {
//       const res = await axios.post(
//         `${backendUrl}/api/profile/setaddress`,
//         payload,
//         {
//           headers: { token },
//         }
//       );
//       if (res.data.success) {
//         toast.success("Address updated!");
//         setOriginalData(formData);
//         setIsModified(false);
//         setIsEditing(false);
//         updateAddress(payload);
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to update address");
//     }
//   };

//   const handlePlaceOrder = async () => {
//     if (!payment) {
//       toast.error("Select payment method");
//       return;
//     }

//     if (isModified) {
//       toast.warning("Update address first");
//       return;
//     }

//     const items = [];

//     // ✅ Handle color + size nested structure
//     for (const productId in cartitem) {
//       const productCart = cartitem[productId];

//       for (const size in productCart) {
//         const colorData = productCart[size];

//         for (const color in colorData) {
//           const quantity = colorData[color];
//           if (quantity <= 0) continue;

//           const product = products.find((p) => p._id === productId);
//           if (!product) continue;

//           const variant = product.variants.find(
//             (v) => v.size === size && v.color === color
//           );
//           if (!variant) continue;

//           if (quantity > variant.stock) {
//             toast.error(
//               `Not enough stock for ${product.name} (${size} - ${color})`
//             );
//             return;
//           }

//           items.push({
//             productId: product._id,
//             size: variant.size,
//             color: variant.color,
//             quantity,
//             price: variant.price,
//           });
//         }
//       }
//     }

//     if (items.length === 0) {
//       toast.error("Cart is empty");
//       return;
//     }

//     const payload = {
//       items,
//       amount: calculatetotalamount() + delivery_fee,
//       address: {
//         fullName: formData.fullName,
//         phone: Number(formData.phone),
//         province: formData.province,
//         district: formData.district,
//         city: formData.city,
//         streetAddress: formData.streetAddress,
//       },
//     };

//     try {
//       const res = await axios.post(`${backendUrl}/api/order/place`, payload, {
//         headers: { token },
//       });
//       if (res.data.success) {
//         setCartitem({});
//         localStorage.setItem("cartItems", JSON.stringify({}));
//         toast.success("Order placed!");
//         navigate("/order");
//       } else {
//         toast.error(res.data.message || "Failed to place order");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to place order");
//     }
//   };

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   return (
//     <div className="p-4 mt-5 flex flex-col sm:flex-row gap-8 min-h-[80vh]">
//       {/* Left: Address Form */}
//       <form
//         onSubmit={handleUpdate}
//         className="flex-1 bg-white shadow-sm rounded-xl p-6"
//       >
//         <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
//         {[
//           "fullName",
//           "phone",
//           "province",
//           "district",
//           "city",
//           "streetAddress",
//         ].map((field) => (
//           <div className="mb-4" key={field}>
//             <label className="block mb-1 font-medium text-gray-700">
//               {field} *
//             </label>
//             {["province", "district", "city"].includes(field) ? (
//               <select
//                 name={field}
//                 value={formData[field]}
//                 onChange={handleChange}
//                 disabled={!isEditing}
//                 className="w-full p-3 border rounded-lg"
//               >
//                 <option value="">Select {field}</option>
//                 {(field === "province"
//                   ? provinces
//                   : field === "district"
//                   ? districts
//                   : cities
//                 ).map((val) => (
//                   <option key={val._id || val.name} value={val.name}>
//                     {val.name}
//                   </option>
//                 ))}
//               </select>
//             ) : (
//               <input
//                 type={field === "phone" ? "tel" : "text"}
//                 name={field}
//                 value={formData[field]}
//                 onChange={handleChange}
//                 disabled={!isEditing}
//                 className="w-full p-3 border rounded-lg"
//               />
//             )}
//           </div>
//         ))}
//         {isEditing && (
//           <div className="flex gap-4 mt-4">
//             <button
//               type="submit"
//               className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
//             >
//               Update
//             </button>
//             <button
//               type="button"
//               onClick={handleReset}
//               className="flex-1 bg-gray-200 py-2 rounded-lg"
//             >
//               Cancel
//             </button>
//           </div>
//         )}
//       </form>

//       {/* Right: Cart + Payment */}
//       <div className="flex-1 space-y-6">
//         <CartTotal />
//         <div className="bg-white shadow-sm rounded-xl p-6">
//           <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
//           <div
//             onClick={() => setPayment(!payment)}
//             className={`flex items-center gap-3 border p-3 rounded-lg cursor-pointer ${
//               payment ? "border-green-500 bg-green-50" : "border-gray-200"
//             }`}
//           >
//             <div
//               className={`w-4 h-4 rounded-full border ${
//                 payment ? "bg-green-500 border-green-500" : "border-gray-400"
//               }`}
//             ></div>
//             <span>Cash on Delivery</span>
//           </div>
//           <button
//             onClick={handlePlaceOrder}
//             disabled={isModified}
//             className="mt-4 w-full py-3 bg-black text-white rounded-lg"
//           >
//             {isModified ? "Update address first" : "Place Order"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Placeorder;

import { useContext, useState, useEffect } from "react";
import CartTotal from "../component/CartTotal";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Placeorder = () => {
  const [payment, setPayment] = useState(false);
  const {
    navigate,
    backendUrl,
    token,
    updateAddress,
    address,
    cartitem,
    setCartitem,
    calculatetotalamount,
    delivery_fee,
    products,
  } = useContext(ShopContext);

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    province: "",
    district: "",
    city: "",
    streetAddress: "",
  });
  const [originalData, setOriginalData] = useState({});
  const [isModified, setIsModified] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch locations
  const fetchProvinces = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/location/province`);
      setProvinces(res.data.provinces || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDistricts = async (province) => {
    if (!province) return;
    try {
      const res = await axios.get(
        `${backendUrl}/api/location/${province}/districts`
      );
      setDistricts(res.data.districts || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCities = async (province, district) => {
    if (!province || !district) return;
    try {
      const res = await axios.get(
        `${backendUrl}/api/location/${province}/${district}/cities`
      );
      setCities(res.data.cities || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProvinces();

    if (address && Object.keys(address).length > 0) {
      const data = {
        fullName: address.fullName || address.name || "",
        phone: address.phone ? String(address.phone) : "",
        province: address.province || "",
        district: address.district || "",
        city: address.city || "",
        streetAddress: address.streetAddress || address.street || "",
      };
      setFormData(data);
      setOriginalData(data);
      setIsModified(false);
      setIsEditing(false); // reset editing after address loads

      if (address.province) fetchDistricts(address.province);
      if (address.province && address.district)
        fetchCities(address.province, address.district);
    } else {
      setIsEditing(true); // if no address, enable editing
    }
  }, [address]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...formData, [name]: value };

    if (name === "province") {
      updatedForm.district = "";
      updatedForm.city = "";
      setDistricts([]);
      setCities([]);
      fetchDistricts(value);
    }

    if (name === "district") {
      updatedForm.city = "";
      setCities([]);
      fetchCities(updatedForm.province, value);
    }

    setFormData(updatedForm);
    setIsModified(JSON.stringify(updatedForm) !== JSON.stringify(originalData));
  };

  const handleReset = () => {
    setFormData(originalData);
    setIsModified(false);
    setIsEditing(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!isModified) return;

    const payload = {
      name: formData.fullName,
      phone: Number(formData.phone),
      province: formData.province,
      district: formData.district,
      city: formData.city,
      street: formData.streetAddress,
    };

    try {
      const res = await axios.post(
        `${backendUrl}/api/profile/setaddress`,
        payload,
        {
          headers: { token },
        }
      );
      if (res.data.success) {
        toast.success("Address updated!");
        setOriginalData(formData);
        setIsModified(false);
        setIsEditing(false);
        updateAddress(payload);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update address");
    }
  };

  const handlePlaceOrder = async () => {
    if (!payment) {
      toast.error("Select payment method");
      return;
    }

    if (isModified) {
      toast.warning("Update address first");
      return;
    }

    const items = [];

    for (const productId in cartitem) {
      const productCart = cartitem[productId];
      for (const size in productCart) {
        const colorData = productCart[size];
        for (const color in colorData) {
          const quantity = colorData[color];
          if (quantity <= 0) continue;

          const product = products.find((p) => p._id === productId);
          if (!product) continue;

          const variant = product.variants.find(
            (v) => v.size === size && v.color === color
          );
          if (!variant) continue;

          if (quantity > variant.stock) {
            toast.error(
              `Not enough stock for ${product.name} (${size} - ${color})`
            );
            return;
          }

          items.push({
            productId: product._id,
            size: variant.size,
            color: variant.color,
            quantity,
            price: variant.price,
          });
        }
      }
    }

    if (items.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    const payload = {
      items,
      amount: calculatetotalamount() + delivery_fee,
      address: {
        fullName: formData.fullName,
        phone: Number(formData.phone),
        province: formData.province,
        district: formData.district,
        city: formData.city,
        streetAddress: formData.streetAddress,
      },
    };

    try {
      const res = await axios.post(`${backendUrl}/api/order/place`, payload, {
        headers: { token },
      });
      if (res.data.success) {
        setCartitem({});
        localStorage.setItem("cartItems", JSON.stringify({}));
        toast.success("Order placed!");
        navigate("/order");
      } else {
        toast.error(res.data.message || "Failed to place order");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="p-4 mt-5 flex flex-col sm:flex-row gap-8 min-h-[80vh]">
      {/* Left: Address Form */}
      <form
        onSubmit={handleUpdate}
        className="flex-1 bg-white shadow-sm rounded-xl p-6"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Shipping Address</h2>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-sm bg-gray-200 px-3 py-1 rounded-lg hover:bg-gray-300"
            >
              Edit
            </button>
          )}
        </div>

        {[
          "fullName",
          "phone",
          "province",
          "district",
          "city",
          "streetAddress",
        ].map((field) => (
          <div className="mb-4" key={field}>
            <label className="block mb-1 font-medium text-gray-700">
              {field} *
            </label>
            {["province", "district", "city"].includes(field) ? (
              <select
                name={field}
                value={formData[field]}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-3 border rounded-lg"
              >
                <option value="">Select {field}</option>
                {(field === "province"
                  ? provinces
                  : field === "district"
                  ? districts
                  : cities
                ).map((val) => (
                  <option key={val._id || val.name} value={val.name}>
                    {val.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field === "phone" ? "tel" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full p-3 border rounded-lg"
              />
            )}
          </div>
        ))}

        {isEditing && (
          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg"
            >
              Update
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 bg-gray-200 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        )}
      </form>

      {/* Right: Cart + Payment */}
      <div className="flex-1 space-y-6">
        <CartTotal />
        <div className="bg-white shadow-sm rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <div
            onClick={() => setPayment(!payment)}
            className={`flex items-center gap-3 border p-3 rounded-lg cursor-pointer ${
              payment ? "border-green-500 bg-green-50" : "border-gray-200"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border ${
                payment ? "bg-green-500 border-green-500" : "border-gray-400"
              }`}
            ></div>
            <span>Cash on Delivery</span>
          </div>
          <button
            onClick={handlePlaceOrder}
            disabled={isModified}
            className="mt-4 w-full py-3 bg-black text-white rounded-lg"
          >
            {isModified ? "Update address first" : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Placeorder;
