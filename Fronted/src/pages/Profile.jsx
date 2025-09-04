import { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { ShopContext } from "../Context/ShopContext";

const Profile = () => {
  const { backendUrl, token, address, updateAddress } = useContext(ShopContext);

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

  const [isModified, setIsModified] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const isFirstTime = !address || Object.keys(address).length === 0;

  // ✅ Fetch provinces
  const fetchProvinces = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/location/province`);
      setProvinces(res.data.provinces || []);
    } catch (err) {
      console.error("Error fetching provinces:", err);
    }
  };

  // ✅ Fetch districts
  const fetchDistricts = async (provinceName) => {
    if (!provinceName) return;
    try {
      const res = await axios.get(
        `${backendUrl}/api/location/${provinceName}/districts`
      );
      setDistricts(res.data.districts || []);
    } catch (err) {
      console.error("Error fetching districts:", err);
    }
  };

  // ✅ Fetch cities
  const fetchCities = async (provinceName, districtName) => {
    if (!provinceName || !districtName) return;
    try {
      const res = await axios.get(
        `${backendUrl}/api/location/${provinceName}/${districtName}/cities`
      );
      setCities(res.data.cities || []);
    } catch (err) {
      console.error("Error fetching cities:", err);
    }
  };

  // ✅ Load existing address into form
  useEffect(() => {
    if (!isFirstTime) {
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

      // preload dependent dropdowns
      if (address.province) fetchDistricts(address.province);
      if (address.province && address.district)
        fetchCities(address.province, address.district);
    }
  }, [address]);

  // ✅ Check modified status
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

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...formData, [name]: value };

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
    setIsModified(checkIfModified(updatedForm));
  };

  // ✅ Reset to original
  const handleReset = () => {
    if (originalData && Object.keys(originalData).length > 0) {
      setFormData(originalData);
      setIsModified(false);
    }
  };

  // ✅ Save address
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
        `${backendUrl}/api/profile/setaddress`,
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

        if (typeof updateAddress === "function") {
          updateAddress(payload);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to save address");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProvinces();
  }, []);

  return (
    <div className="px-4 mt-5 h-full pb-10">
      {/* ✅ Saved Address Preview */}
      {!isFirstTime && (
        <div className="max-w-xl mx-auto mt-6 p-6 mb-5 bg-gradient-to-br from-gray-50 to-white shadow-sm rounded-2xl border border-gray-200">
          <h3 className="text-xl font-semibold mb-5 text-gray-800 flex items-center gap-2">
            📍 Saved Delivery Address
          </h3>

          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>
                <strong>Name:</strong> {address.name}
              </span>
              <span>
                <strong>📞</strong> {address.phone}
              </span>
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
        className="max-w-xl mx-auto mt-6 p-6 bg-gradient-to-br from-gray-50 to-white shadow-sm rounded-2xl border border-gray-200"
      >
        <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
          📝 Profile Details
        </h2>

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
              value={formData[name] || ""}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              value={formData[name] || ""}
              onChange={handleChange}
              className="w-full bg-white border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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

        {/* Street Address */}
        <div className="mb-4">
          <label className="block mb-1 font-medium text-gray-700">
            Street Address *
          </label>
          <input
            type="text"
            name="streetAddress"
            value={formData.streetAddress || ""}
            onChange={handleChange}
            placeholder="Enter street address"
            className="w-full bg-white border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            type="submit"
            className={`flex-1 py-3 rounded-lg text-white font-medium transition ${
              isFirstTime
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
  );
};

export default Profile;
