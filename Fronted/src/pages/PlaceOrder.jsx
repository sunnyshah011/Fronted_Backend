import { useContext, useState, useEffect } from "react";
import CartTotal from "../component/CartTotal";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const provinces = ["Bagmati", "Gandaki", "Lumbini"];
const districts = ["Chitwan", "Kathmandu", "Pokhara"];
const cities = [
  "Bharatpur Metropolitan City ward no. - 01",
  "Lalitpur Sub-Metropolitan",
  "Pokhara Lekhnath Metropolitan",
];

const Placeorder = () => {
  const [payment, setpayment] = useState(false);
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

  useEffect(() => {
    window.scrollTo(0, 0);
    if (address && Object.keys(address).length > 0) {
      const data = {
        fullName: address.name || "",
        phone: address.phone || "",
        province: address.province || "",
        district: address.district || "",
        city: address.city || "",
        streetAddress: address.street || "",
      };
      setFormData(data);
      setOriginalData(data);
      setIsModified(false);
    }
  }, [address]);

  const checkIfModified = (newData) =>
    newData.fullName !== originalData.fullName ||
    newData.phone !== originalData.phone ||
    newData.province !== originalData.province ||
    newData.district !== originalData.district ||
    newData.city !== originalData.city ||
    newData.streetAddress !== originalData.streetAddress;

  const handleChange = (e) => {
    const updatedForm = { ...formData, [e.target.name]: e.target.value };
    setFormData(updatedForm);
    setIsModified(checkIfModified(updatedForm));
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
      phone: formData.phone,
      province: formData.province,
      district: formData.district,
      city: formData.city,
      street: formData.streetAddress,
    };

    try {
      const response = await axios.post(
        backendUrl + "/api/profile/setaddress",
        payload,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Address updated successfully!", {
          autoClose: 1000,
          hideProgressBar: true,
        });

        setOriginalData(formData);
        setIsModified(false);
        setIsEditing(false);
        updateAddress(payload);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update address");
    }
  };

  // 🔑 Place Order Function
  const handlePlaceOrder = async () => {
    if (!payment) {
      toast.error("Please select a payment method", {
        autoClose: 1000,
        hideProgressBar: true,
      });
      return;
    }

    try {
      let orderitems = [];
      for (const items in cartitem) {
        for (const item in cartitem[items]) {
          if (cartitem[items][item] > 0) {
            const itemInfo = structuredClone(
              products.find((product) => product._id === items)
            );
            if (itemInfo) {
              itemInfo.size = item;
              itemInfo.quantity = cartitem[items][item];
              orderitems.push(itemInfo);
            }
          }
        }
      }

      const payload = {
        items: orderitems,
        amount: calculatetotalamount() + delivery_fee,
        address: formData,
      };

      const response = await axios.post(
        backendUrl + "/api/order/place",
        payload,
        { headers: { token } }
      );
      if (response.data.success) {
        localStorage.setItem("cartItems", JSON.stringify({}));
        setCartitem({});
        toast.success("Order placed successfully!", { autoClose: 1000 });
        navigate("/order");
      } else {
        toast.error(response.data.message || "Failed to place order");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="p-4 mt-5 flex flex-col sm:flex-row gap-8 pt-5 sm:pt-14 min-h-[80vh] ">
      {/* left side */}
      <form
        onSubmit={handleUpdate}
        className="flex-1 bg-white shadow-sm rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Shipping Address
          </h2>
          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="text-blue-600 text-sm hover:underline"
            >
              Edit
            </button>
          )}
        </div>

        {/* Input Fields */}
        {[
          { label: "Full Name", name: "fullName", type: "text" },
          { label: "Phone", name: "phone", type: "tel" },
        ].map(({ label, name, type }) => (
          <div className="mb-4" key={name}>
            <label className="block mb-1 font-medium text-gray-700">
              {label} *
            </label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-3 rounded-lg border ${
                isEditing
                  ? "bg-gray-50 border-gray-300 focus:ring-2 focus:ring-blue-500"
                  : "bg-gray-100 border-gray-200 cursor-not-allowed"
              }`}
              required
            />
          </div>
        ))}

        {/* Select Dropdowns */}
        {[
          { label: "Province", name: "province", options: provinces },
          { label: "District", name: "district", options: districts },
          { label: "City", name: "city", options: cities },
        ].map(({ label, name, options }) => (
          <div className="mb-4" key={name}>
            <label className="block mb-1 font-medium text-gray-700">
              {label} *
            </label>
            <select
              name={name}
              value={formData[name]}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full p-3 rounded-lg border ${
                isEditing
                  ? "bg-gray-50 border-gray-300 focus:ring-2 focus:ring-blue-500"
                  : "bg-gray-100 border-gray-200 cursor-not-allowed"
              }`}
              required
            >
              <option value="">Select {label}</option>
              {options.map((val) => (
                <option key={val} value={val}>
                  {val}
                </option>
              ))}
            </select>
          </div>
        ))}

        {/* Street Address Field */}
        <div className="mb-6">
          <label className="block mb-1 font-medium text-gray-700">
            Street Address *
          </label>
          <input
            type="text"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleChange}
            disabled={!isEditing}
            placeholder="Enter street address"
            className={`w-full p-3 rounded-lg border ${
              isEditing
                ? "bg-gray-50 border-gray-300 focus:ring-2 focus:ring-blue-500"
                : "bg-gray-100 border-gray-200 cursor-not-allowed"
            }`}
            required
          />
        </div>

        {/* Update / Cancel Buttons */}
        {isEditing && (
          <div className="flex gap-4 mt-8">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium"
            >
              Update
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2.5 rounded-lg font-medium"
            >
              Cancel
            </button>
          </div>
        )}
      </form>

      {/* right side */}
      <div className="flex-1 space-y-6">
        <div className="bg-white shadow-sm rounded-xl p-6 ">
          <CartTotal />
        </div>

        <div className="bg-white shadow-sm rounded-xl p-6 ">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Payment Method
          </h2>

          <div
            onClick={() => setpayment(!payment)}
            className={`flex items-center gap-3 border p-3 rounded-lg cursor-pointer transition ${
              payment
                ? "border-green-500 bg-green-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full border ${
                payment ? "bg-green-500 border-green-500" : "border-gray-400"
              }`}
            ></div>
            <span className="text-gray-700 font-medium">Cash on Delivery</span>
          </div>

          <div className="w-full text-end mt-8">
            <button
              onClick={handlePlaceOrder}
              className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-medium"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Placeorder;
