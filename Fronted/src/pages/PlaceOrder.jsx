import { useContext, useState, useEffect } from "react";
import CartTotal from "../component/CartTotal";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

const Placeorder = () => {
  const [payment, setPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const queryClient = useQueryClient();

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

  const isFirstTime = !address || Object.keys(address).length === 0;

  // ✅ Fetch provinces/districts/cities
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

  // ✅ Load address if exists
  useEffect(() => {
    fetchProvinces();

    if (!isFirstTime) {
      const data = {
        fullName: address.name || address.fullName || "",
        phone: address.phone ? String(address.phone) : "",
        province: address.province || "",
        district: address.district || "",
        city: address.city || "",
        streetAddress: address.street || address.streetAddress || "",
      };
      setFormData(data);
      setOriginalData(data);
      setIsModified(false);

      if (address.province) fetchDistricts(address.province);
      if (address.province && address.district)
        fetchCities(address.province, address.district);
    }
  }, [address]);

  // ✅ Detect modifications
  const checkIfModified = (newData) => {
    const normalize = (val) => (val ? val.trim().replace(/\s+/g, " ") : "");
    if (!originalData || Object.keys(originalData).length === 0) return true;
    return (
      normalize(newData.fullName) !== normalize(originalData.fullName) ||
      normalize(newData.phone) !== normalize(originalData.phone) ||
      normalize(newData.province) !== normalize(originalData.province) ||
      normalize(newData.district) !== normalize(originalData.district) ||
      normalize(newData.city) !== normalize(originalData.city) ||
      normalize(newData.streetAddress) !== normalize(originalData.streetAddress)
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent leading/only spaces and convert everything safely to string
    let cleanedValue = String(value || "").replace(/^\s+/, "");
    if (cleanedValue.trim() === "") cleanedValue = "";

    let updatedForm = { ...formData, [name]: cleanedValue };

    if (name === "province") {
      updatedForm.district = "";
      updatedForm.city = "";
      setDistricts([]);
      setCities([]);
      fetchDistricts(cleanedValue);
    }

    if (name === "district") {
      updatedForm.city = "";
      setCities([]);
      fetchCities(updatedForm.province, cleanedValue);
    }

    setFormData(updatedForm);
    setIsModified(checkIfModified(updatedForm));
  };

  // ✅ Reset form
  const handleReset = () => {
    if (originalData && Object.keys(originalData).length > 0) {
      setFormData(originalData);
      setIsModified(false);
    }
  };

  // ✅ Save / Update Address
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isModified && !isFirstTime) {
      toast.info("No changes to save.", {
        className: "custom-toast-center",
        autoClose: 1000,
        pauseOnHover: false,
        closeOnClick: true,
        hideProgressBar: true,
      });
      return;
    }

    const payload = {
      name: formData.fullName.trim().replace(/\s+/g, " "),
      phone: formData.phone.trim(),
      province: formData.province.trim(),
      district: formData.district.trim(),
      city: formData.city.trim(),
      street: formData.streetAddress.trim().replace(/\s+/g, " "),
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
        toast.success(res.data.message || "Address saved", {
          className: "custom-toast-center",
          autoClose: 1000,
          pauseOnHover: false,
          closeOnClick: true,
          hideProgressBar: true,
        });

        setOriginalData(formData);
        setIsModified(false);
        updateAddress(payload);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save address");
    }
  };

  // ✅ Place Order (untouched)
  const handlePlaceOrder = async () => {
    if (!payment) {
      toast.error("Select payment method", {
        className: "custom-toast-center",
        draggable: false,
        autoClose: 1000,
      });
      return;
    }

    if (isModified) {
      toast.warning("Update address first", {
        className: "custom-toast-center",
        autoClose: 1000,
      });
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
              `Not enough stock for ${product.name} (${size} - ${color})`,
              {
                className: "custom-toast-center",
                autoClose: 1000,
              }
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
      toast.error("Cart is empty", {
        className: "custom-toast-center",
        autoClose: 1000,
      });
      return;
    }

    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.province ||
      !formData.district ||
      !formData.city ||
      !formData.streetAddress
    ) {
      setAddressError(true);
      window.scroll(0, 0);
      toast.error("Address is Empty", {
        className: "custom-toast-center",
        autoClose: 1000,
      });
      return;
    } else {
      setAddressError(false);
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
      setIsLoading(true);
      const res = await axios.post(`${backendUrl}/api/order/place`, payload, {
        headers: { token },
      });
      if (res.data.success) {
        setCartitem({});
        toast.success("Order placed!", {
          className: "custom-toast-center",
          autoClose: 1000,
        });

        // ✅ Refetch product stock for all ordered items
        for (const item of items) {
          const product = products.find((p) => p._id === item.productId);
          if (!product) continue;

          const categorySlug = product.subcategory?.category?.slug;
          const productSlug = product.slug;

          if (categorySlug && productSlug) {
            await queryClient.refetchQueries(["product", categorySlug, productSlug]);
          }
        }

        navigate("/order");
      } else {
        toast.error(res.data.message || "Failed to place order", {
          className: "custom-toast-center",
          autoClose: 1000,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order", {
        className: "custom-toast-center",
        autoClose: 1000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="p-4 flex flex-col md:flex-row gap-8 min-h-[50vh]">
      {/* ✅ Left: Address Section (updated like Profile) */}
      <div className="flex-1 bg-white shadow-sm rounded-xl p-5">
        <h2
          className={`text-xl sm:text-2xl font-semibold mb-6 ${addressError ? "text-red-600 animate-pulse" : "text-gray-900"
            }`}
        >
          Shipping Address
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Full Name & Phone */}
          {[
            { label: "Full Name", name: "fullName", type: "text" },
            { label: "Phone", name: "phone", type: "tel" },
          ].map(({ label, name, type }) => (
            <div className="mb-2" key={name}>
              <label className="block text-sm mb-1 font-medium text-gray-700">
                {label} *
              </label>
              <input
                type={type}
                name={name}
                value={formData[name] || ""}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 pl-3 py-2  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>
          ))}

          {/* Province, District, City */}
          {[
            { label: "Province", name: "province", options: provinces },
            { label: "District", name: "district", options: districts },
            { label: "City", name: "city", options: cities },
          ].map(({ label, name, options }) => (
            <div className="mb-2" key={name}>
              <label className="block  text-sm mb-1 font-medium text-gray-700">
                {label} *
              </label>
              <select
                name={name}
                value={formData[name] || ""}
                onChange={handleChange}
                className="w-full bg-white border border-gray-300 pl-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">{`Select ${label}`}</option>
                {options.map((val) => (
                  <option key={val._id || val.name} value={val.name}>
                    {val.name}
                  </option>
                ))}
              </select>
            </div>
          ))}

          {/* Street */}
          <div className="mb-2">
            <label className="block text-sm mb-1 font-medium text-gray-700">
              Street Address *
            </label>
            <input
              type="text"
              name="streetAddress"
              value={formData.streetAddress || ""}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 pl-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <button
              type="submit"
              className={`flex-1 py-3 rounded-lg text-white font-medium transition ${isFirstTime
                  ? "bg-blue-600 hover:bg-blue-700"
                  : isModified
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-gray-500 cursor-not-allowed"
                }`}
              disabled={!isModified && !isFirstTime}
            >
              {isFirstTime
                ? "Add Address"
                : isModified
                  ? "Update Address"
                  : "Saved"}
            </button>

            {!isFirstTime && isModified && (
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ✅ Right: Cart + Payment (unchanged) */}
      <div className="flex-1 space-y-6.5">
        {Object.keys(cartitem).length > 0 && (
          <div className="bg-white shadow-sm rounded-xl p-6 py-3">
            <h2 className="text-xl font-semibold mb-3">Products in Cart</h2>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {Object.keys(cartitem).map((productId) => {
                const productCart = cartitem[productId];
                const product = products.find((p) => p._id === productId);
                if (!product) return null;

                return Object.keys(productCart).map((size) => {
                  const colorData = productCart[size];
                  return Object.keys(colorData).map((color) => {
                    const quantity = colorData[color];
                    if (quantity <= 0) return null;

                    const variant = product.variants.find(
                      (v) => v.size === size && v.color === color
                    );
                    if (!variant) return null;

                    return (
                      <div
                        key={`${productId}-${size}-${color}`}
                        className="flex items-center gap-4 pb-2"
                      >
                        <img
                          src={product.images?.[0] || "/placeholder.png"}
                          alt={product.name}
                          className="w-14 sm:w-20 h-14 sm:h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                          <div className="flex flex-col gap-1 sm:gap-2 flex-wrap">
                            <p className="text-sm sm:text-[13px] font-medium text-gray-700 line-clamp-1">
                              {product.name}
                            </p>
                            <span className="text-[12px] font-semibold text-gray-900">
                              ₹ {variant.price} /-
                            </span>
                            <span className="px-2 py-0.5 text-[10px] border border-gray-200 bg-gray-50 rounded-md w-fit">
                              Size: {variant.size}
                            </span>
                            {variant.color && (
                              <span className="px-2 py-0.5 text-[10px] border border-gray-200 bg-gray-50 rounded-md w-fit">
                                Color: {variant.color}
                              </span>
                            )}
                            <span className="px-2 py-0.5 text-[10px] border border-gray-200 bg-gray-50 rounded-md w-fit">
                              Qty: {quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  });
                });
              })}
            </div>
          </div>
        )}

        <CartTotal />

        <div className="bg-white shadow-sm rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
          <div
            onClick={() => setPayment(!payment)}
            className={`flex items-center gap-3 border p-3 rounded-lg cursor-pointer ${payment ? "border-green-500 bg-green-50" : "border-gray-200"
              }`}
          >
            <div
              className={`w-4 h-4 rounded-full border ${payment ? "bg-green-500 border-green-500" : "border-gray-400"
                }`}
            ></div>
            <span>Cash on Delivery</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isModified || isLoading}
            className={`mt-4 w-full py-3 rounded-lg text-white ${isModified
                ? "bg-gray-400 cursor-not-allowed"
                : isLoading
                  ? "bg-gray-700"
                  : "bg-black hover:bg-gray-800"
              } flex items-center justify-center gap-2`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Processing...
              </>
            ) : isModified ? (
              "Update address first"
            ) : (
              "Place Order"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Placeorder;
