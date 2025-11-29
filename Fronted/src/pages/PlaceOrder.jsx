import { useContext, useState, useEffect } from "react";
import CartTotal from "../component/CartTotal";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { FiTruck } from "react-icons/fi";


const Placeorder = () => {
  // ──────────────── EXISTING STATES ────────────────
  const [isLoading, setIsLoading] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const queryClient = useQueryClient();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [paymentOne, setPaymentOne] = useState(false);
  const [paymentTwo, setPaymentTwo] = useState(false);
  const [selectedOnlineMethod, setSelectedOnlineMethod] = useState(null);
  const [qrView, setQrView] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

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

  


  // ──────────────── FETCH PRODUCTS FOR DELIVERY FEE LOGIC ────────────────
const [fetchedProducts, setFetchedProducts] = useState([]);
const [loadingDeliveryProducts, setLoadingDeliveryProducts] = useState(true);

useEffect(() => {
  const fetchProducts = async () => {
    setLoadingDeliveryProducts(true);
    try {
      const productIds = Object.keys(cartitem);

      if (productIds.length === 0) {
        setFetchedProducts([]);
        setLoadingDeliveryProducts(false);
        return;
      }

      const results = await Promise.all(
        productIds.map(async (id) => {
          const res = await fetch(`${backendUrl}/api/product/single/${id}`);
          if (!res.ok) throw new Error("Failed to fetch product");
          const data = await res.json();
          return data.product;
        })
      );

      setFetchedProducts(results);
    } catch (error) {
      console.error("Product fetch error:", error);
      setFetchedProducts([]);
    } finally {
      setLoadingDeliveryProducts(false);
    }
  };

  fetchProducts();
}, [cartitem, backendUrl]);

// ──────────────── CALCULATE DELIVERY FEE ONLY ────────────────
const calculateDeliveryFee = () => {
  if (!fetchedProducts || fetchedProducts.length === 0) return 150;

  const activeProducts = fetchedProducts.filter(
    (p) => cartitem[p._id]
  );

  // FREE DELIVERY IF ANY PRODUCT IS COMBO SET
  const deliveryApplicable = !activeProducts.some(
    (p) => p.subcategory?.category?.name === "Combo Set"
  );

  return deliveryApplicable ? 150 : 0;
};




  // ──────────────── RESPONSIVE STEP LOGIC ────────────────
  const [step, setStep] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // run on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // const handleNextStep = () => {
  //   if (isModified) {
  //     toast.warn("Please save your address before continuing");
  //     return;
  //   }
  //   setStep(2);
  // };

  const handleNextStep = () => {
    // If address form is modified but not saved
    if (isModified) {
      toast.warn("Please save your address before continuing");
      return;
    }

    // Check if user has ANY saved address
    if (
      !formData.fullName ||
      !formData.phone ||
      !formData.province ||
      !formData.district ||
      !formData.city ||
      !formData.streetAddress
    ) {
      setAddressError(true);
      toast.error("Address is required before proceeding", {
        className: "custom-toast-center",
        autoClose: 1000,
      });

      // Scroll to address section
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // If address exists → go to payment
    setAddressError(false);
    setStep(2);
  };


  const handleBackStep = () => setStep(1);

  // ──────────────── FETCH PAYMENT METHODS ────────────────
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/paymentmethods`);
        if (res.data.success) setPaymentMethods(res.data.methods || []);
        else
          toast.error("Failed to load payment methods", {
            className: "custom-toast-center",
            autoClose: 1000,
          });
      } catch (err) {
        console.error("Error fetching payment methods:", err);
        toast.error("Error fetching payment methods", {
          className: "custom-toast-center",
          autoClose: 1000,
        });
      }
    };
    fetchPaymentMethods();
  }, [backendUrl]);

  // ──────────────── LOCATION + ADDRESS STATES ────────────────
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
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
    }
  }, [address]);

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

    let cleanedValue = String(value || "");
    // optional: trim leading spaces for UX
    if (cleanedValue.startsWith(" "))
      cleanedValue = cleanedValue.replace(/^\s+/, "");

    let updatedForm = { ...formData, [name]: cleanedValue };

    if (name === "province") {
      updatedForm.district = "";
      updatedForm.city = "";
      setDistricts([]);
      fetchDistricts(cleanedValue);
    }

    if (name === "district") {
      updatedForm.city = "";
    }

    setFormData(updatedForm);
    setIsModified(checkIfModified(updatedForm));
  };

  const handleReset = () => {
    if (originalData && Object.keys(originalData).length > 0) {
      setFormData(originalData);
      setIsModified(false);
    }
  };

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
        { headers: { token } }
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

  // ──────────────── PLACE ORDER (same as before) ────────────────
  const handlePlaceOrder = async () => {
    if (!paymentOne && !paymentTwo) {
      toast.error("Select payment method", {
        className: "custom-toast-center",
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

    if (paymentTwo && !selectedOnlineMethod) {
      toast.warn(
        "Please select an online payment method (eSewa, Bank-Transfer, etc.)"
      );
      return;
    }

    // find selected online payment method
    const selectedMethod = paymentMethods.find(
      (m) => m._id === selectedOnlineMethod
    );

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
      // amount: calculatetotalamount() + delivery_fee,
      amount: calculatetotalamount() + calculateDeliveryFee(),
      address: {
        fullName: formData.fullName,
        phone: Number(formData.phone),
        province: formData.province,
        district: formData.district,
        city: formData.city,
        streetAddress: formData.streetAddress,
      },
      // paymentMethod: paymentOne
      //   ? "Cash On Delivery"
      //   : selectedMethod?.name || "Online",
      paymentMethod: selectedMethod?.name,
      paymentMethodId: selectedOnlineMethod || null,
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

        // Refetch product stock if necessary
        for (const item of items) {
          const product = products.find((p) => p._id === item.productId);
          if (!product) continue;

          const categorySlug = product.subcategory?.category?.slug;
          const productSlug = product.slug;

          if (categorySlug && productSlug) {
            await queryClient.refetchQueries([
              "product",
              categorySlug,
              productSlug,
            ]);
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
    // window.scrollTo(0, 0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  // ──────────────── RENDER SECTIONS ────────────────

  const AddressSection = (
    <div className="flex-1 bg-white shadow-sm rounded-xl p-5">
      <h2
        className={`text-2xl sm:text-2xl font-medium mb-6 ${addressError ? "text-red-600 animate-pulse" : "text-gray-900"
          }`}
      >
        Shipping Address
      </h2>

      <form onSubmit={handleSubmit}>
        {[
          { label: "Full Name", name: "fullName", type: "text" },
          { label: "Phone", name: "phone", type: "tel" },
        ].map(({ label, name, type }) => (
          <div className="mb-3" key={name}>
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

        {[
          { label: "Province", name: "province", options: provinces },
          { label: "District", name: "district", options: districts },
        ].map(({ label, name, options }) => (
          <div className="mb-3" key={name}>
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

        <div className="mb-3">
          <label className="block text-sm mb-1 font-medium text-gray-700">
            City/Municipality *
          </label>
          <input
            type="text"
            name="city"
            value={formData.city || ""}
            onChange={handleChange}
            placeholder="Enter your city"
            className="w-full bg-white border border-gray-300 pl-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

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

      {isMobile && (
        <button
          onClick={handleNextStep}
          className="mt-5 w-full bg-black text-white py-3 rounded-lg"
        >
          Continue to Payment →
        </button>
      )}
    </div>
  );

  const PaymentSection = (
    <div className="flex-1 space-y-6.5">
      {isMobile && (
        <button
          onClick={handleBackStep}
          className="text-blue-600 hover:underline"
        >
          ← Back to Address
        </button>
      )}

      {/* Products in cart: moved above CartTotal */}
      {Object.keys(cartitem).length > 0 && (
        <div className="bg-white shadow-sm rounded-xl p-6 py-3">
          <h2 className="text-xl font-medium mb-3">Products in Cart</h2>
          <div className="space-y-2 max-h-50 overflow-y-auto">
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

      {/* Cart total */}
      <CartTotal />

      {/* Payment Method Section */}
      <div className="bg-white shadow-sm rounded-xl p-6">
        <h2 className="text-xl font-medium mb-4">Payment Method</h2>
        <div className="flex flex-col gap-2">
          {/* Cash on Delivery */}
          <div
            onClick={() => {
              setPaymentOne(!paymentOne);
              setPaymentTwo(false);
              // Automatically select the first COD method
              if (paymentMethods.length > 0) {
                setSelectedOnlineMethod(paymentMethods[0]._id);
              }
              // setSelectedOnlineMethod(null);
            }}
            className={`flex items-center gap-3 border p-3 rounded-lg cursor-pointer ${paymentOne ? "border-green-500 bg-green-50" : "border-gray-200"
              }`}
          >
            <div
              className={`min-w-4.5 min-h-4.5 rounded-full border ${paymentOne ? "bg-green-500 border-green-500" : "border-gray-400"
                }`}
            ></div>
            <div>
              <div>
                <FiTruck size={24} className="text-black inline pr-2" />
                <span className="text-[18px]">QR Payment</span>
              </div>

              {/* <p className="text-[10px] text-red-800">
                Note: You have to pay Rs. 150 in advance for the courier charge.
                You can pay the remaining amount after you receive your package.
              </p> */}
            </div>
          </div>

          {/* COD payment methods (same UI as Online Payment) */}
          {paymentOne && (
            <div className="ml-3 mt-1 flex max-[1250px]:flex-col gap-2">
              {isLoading ? (
                <p className="text-gray-500 text-sm italic">
                  Loading payment methods...
                </p>
              ) : (
                paymentMethods.slice(0, 1).map((method) => {
                  const imgUrl = method.image?.startsWith("http")
                    ? method.image
                    : `${backendUrl.replace("/api", "")}/${method.image}`;

                  return (
                    <div
                      key={method._id}
                      onClick={() => setSelectedOnlineMethod(method._id)}
                      className={`border p-2 rounded-lg cursor-pointer flex flex-row items-center gap-4 transition relative ${selectedOnlineMethod === method._id
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200"
                        }`}
                    >
                      <img
                        src={imgUrl}
                        alt={method.name}
                        className="w-15 h-15 rounded-md object-contain border border-gray-400"
                      />

                      <div className="flex flex-col items-start gap-1 flex-1 pr-3">
                        <span className="font-medium text-gray-800">
                          {method.name}
                        </span>

                        {method.accountNumber && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="truncate">
                              {method.accountNumber}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(
                                  method.accountNumber
                                );
                                setCopiedId(method._id);
                                setTimeout(() => setCopiedId(null), 1500);
                              }}
                              className="text-blue-600 hover:underline pl-1"
                            >
                              {copiedId === method._id ? "Copied!" : "Copy"}
                            </button>
                          </div>
                        )}
                        {method.image && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setQrView(imgUrl);
                              setIsModalOpen(true);
                              document.body.style.overflow = "hidden";
                            }}
                            className="text-blue-600 hover:underline text-sm mt-1"
                          >
                            View QR
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}





          {/* Online Payment */}
          {/* <div
            onClick={() => {
              setPaymentTwo(!paymentTwo);
              setPaymentOne(false);
              setSelectedOnlineMethod(null);
            }}
            className={`flex items-center gap-3 border p-3 rounded-lg cursor-pointer ${paymentTwo ? "border-blue-500 bg-blue-50" : "border-gray-200"
              }`}
          >
            <div
              className={`min-w-4.5 min-h-4.5 rounded-full border ${paymentTwo ? "bg-blue-500 border-blue-500" : "border-gray-400"
                }`}
            ></div>
            <div>
              <FaMoneyBillWave size={24} className="text-green-600 inline pr-2" />
              <span className="text-[18px]">Online Payment</span>
            </div>
          </div> */}
          {/* Online payment methods */}
          {/* {paymentTwo && (
            <div className="ml-3 mt-1 flex max-[1250px]:flex-col gap-2">
              {isLoading ? (
                <p className="text-gray-500 text-sm italic">
                  Loading payment methods...
                </p>
              ) : (
                paymentMethods.slice(1, 3).map((method) => {
                  const imgUrl = method.image?.startsWith("http")
                    ? method.image
                    : `${backendUrl.replace("/api", "")}/${method.image}`;

                  return (
                    <div
                      key={method._id}
                      onClick={() => setSelectedOnlineMethod(method._id)}
                      className={`border p-2 rounded-lg cursor-pointer flex flex-row items-center gap-4 transition relative ${selectedOnlineMethod === method._id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                        }`}
                    >
                      <img
                        src={imgUrl}
                        alt={method.name}
                        className="w-15 h-15 rounded-md object-contain border border-gray-400"
                      />

                      <div className="flex flex-col items-start gap-1 flex-1 pr-3">
                        <span className="font-medium text-gray-800">
                          {method.name}
                        </span>

                        {method.accountNumber && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="truncate">
                              {method.accountNumber}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigator.clipboard.writeText(
                                  method.accountNumber
                                );
                                setCopiedId(method._id);
                                setTimeout(() => setCopiedId(null), 1500);
                              }}
                              className="text-blue-600 hover:underline pl-1"
                            >
                              {copiedId === method._id ? "Copied!" : "Copy"}
                            </button>
                          </div>
                        )}

                        {method.image && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setQrView(imgUrl);
                              setIsModalOpen(true);
                              document.body.style.overflow = "hidden";
                            }}
                            className="text-blue-600 hover:underline text-sm mt-1"
                          >
                            View QR
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )} */}

        </div>



        {/* QR Modal */}
        {isModalOpen && qrView && (
          <div
            onClick={() => {
              setQrView(null);
              setIsModalOpen(false);
              document.body.style.overflow = "auto";
            }}
            className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 cursor-pointer"
          >
            <div
              className="relative bg-white p-4 rounded-xl shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={qrView}
                alt="QR Code"
                className="max-w-[70vw] max-h-[80vh] rounded-lg object-contain"
              />
              <div className="flex justify-center gap-4 mt-3">
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    try {
                      const response = await fetch(qrView, { mode: "cors" });
                      const blob = await response.blob();
                      const url = URL.createObjectURL(blob);

                      const link = document.createElement("a");
                      link.href = url;
                      link.download = "qr-code.jpg";
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);

                      URL.revokeObjectURL(url);
                      toast.success("Image saved!", { autoClose: 1000 });
                    } catch (err) {
                      console.error("Failed to download image:", err);
                      toast.error("Failed to save image", { autoClose: 1000 });
                    }
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Save Image
                </button>
                <button
                  onClick={() => {
                    setQrView(null);
                    setIsModalOpen(false);
                    document.body.style.overflow = "auto";
                  }}
                  className="bg-gray-300 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

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
  );

  return (
    <div className="p-4 min-h-[70vh]">
      {isMobile ? (
        step === 1 ? (
          AddressSection
        ) : (
          PaymentSection
        )
      ) : (
        <div className="flex md:flex-row gap-8">
          {[AddressSection, PaymentSection]}
        </div>
      )}
    </div>
  );
};

export default Placeorder;
