import { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { ShopContext } from "../Context/ShopContext";

const provinces = ["Bagmati", "Gandaki", "Lumbini"];
const districts = ["Chitwan", "Kathmandu", "Pokhara"];
const cities = [
  "Bharatpur Metropolitan City ward no. - 01",
  "Lalitpur Sub-Metropolitan",
  "Pokhara Lekhnath Metropolitan",
];

const Profile = () => {
  const { backendUrl, token, address, updateAddress } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    province: "",
    district: "",
    city: "",
    streetAddress: "",
  });

  const [isModified, setIsModified] = useState(false);
  const [originalData, setOriginalData] = useState({}); // prevent null crash

  // ✅ Check if it's the user's first address
  const isFirstTime = !address || Object.keys(address).length === 0;

  useEffect(() => {
    if (address && Object.keys(address).length > 0) {
      const updatedForm = {
        fullName: address.name || "",
        phone: address.phone || "",
        province: address.province || "",
        district: address.district || "",
        city: address.city || "",
        streetAddress: address.street || "",
      };
      setFormData(updatedForm);
      setOriginalData(updatedForm);
      setIsModified(false);
    }
  }, [address]);

  const checkIfModified = (newData) => {
    if (!originalData || Object.keys(originalData).length === 0) return true;
    return (
      newData.fullName !== originalData.fullName ||
      newData.phone !== originalData.phone ||
      newData.province !== originalData.province ||
      newData.district !== originalData.district ||
      newData.city !== originalData.city ||
      newData.streetAddress !== originalData.streetAddress
    );
  };

  const handleChange = (e) => {
    const updatedForm = { ...formData, [e.target.name]: e.target.value };
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
        toast.success(response.data.message, {
          className: "custom-toast-center",
          autoClose: 1000,
          pauseOnHover: false,
          closeOnClick: true,
          hideProgressBar: true,
        });

        setOriginalData(formData);
        setIsModified(false);

        // Update context with new address
        if (typeof updateAddress === "function") {
          const newAddress = {
            name: payload.name,
            phone: payload.phone,
            province: payload.province,
            district: payload.district,
            city: payload.city,
            street: payload.street,
          };
          updateAddress(newAddress);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to save address");
    }
  };

  return (
    <div className="px-4 mt-20 h-full pb-10">
      {/* ✅ Address Preview */}
      {address && Object.keys(address).length > 0 && (
        <div className="max-w-xl mx-auto mt-10 p-5 mb-8 bg-white shadow-md rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">
            📍 Saved Delivery Address
          </h3>

          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span><strong>Name:</strong> {address.name}</span>
              <span><strong>📞</strong> {address.phone}</span>
            </div>
            <div>
              <strong>Province:</strong> {address.province}
            </div>
            <div>
              <strong>District:</strong> {address.district}
            </div>
            <div>
              <strong>City:</strong> {address.city}
            </div>
            <div>
              <strong>Street:</strong> {address.street}
            </div>
          </div>
        </div>
      )}


      {/* ✅ Address Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto p-4 bg-white shadow-md rounded-md"
      >
        <h2 className="text-lg font-semibold mb-4">PROFILE</h2>

        {/* Input Fields */}
        {[
          { label: "Full Name", name: "fullName", type: "text" },
          { label: "Phone", name: "phone", type: "tel" },
        ].map(({ label, name, type }) => (
          <div className="mb-4" key={name}>
            <label className="block mb-1 font-medium">{label} *</label>
            <input
              type={type}
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full bg-gray-200 p-2 rounded"
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
            <label className="block mb-1 font-medium">{label} *</label>
            <select
              name={name}
              value={formData[name]}
              onChange={handleChange}
              className="w-full bg-gray-200 p-2 rounded"
              required
            >
              <option value="">Select {label}</option>
              {options.map((val) => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
        ))}

        {/* Street Address Field */}
        <div className="mb-4">
          <label className="block mb-1 font-medium">Street Address *</label>
          <input
            type="text"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleChange}
            placeholder="Enter street address"
            className="w-full bg-gray-200 p-2 rounded"
            required
          />
        </div>

        {/* ✅ Buttons */}
        <div className="flex gap-4 mt-8">
          <button
            type="submit"
            className={`flex-1 ${isModified ? "bg-blue-600" : "bg-black"
              } hover:bg-gray-800 text-white py-2 px-4 rounded`}
          >
            {isFirstTime ? "Add Address" : isModified ? "Update Address" : "Saved"}
          </button>

          {!isFirstTime && isModified && (
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Profile;
