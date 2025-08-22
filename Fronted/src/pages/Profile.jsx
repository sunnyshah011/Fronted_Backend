import { useState, useContext } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { ShopContext } from "../Context/ShopContext";
import { useEffect } from "react";

const provinces = ["Bagmati", "Gandaki", "Lumbini"];
const districts = ["Chitwan", "Kathmandu", "Pokhara"];
const cities = [
  "Bharatpur Metropolitan City ward no. - 01",
  "Lalitpur Sub-Metropolitan",
  "Pokhara Lekhnath Metropolitan",
];

const Profile = () => {
  const { backendUrl, token, address } = useContext(ShopContext);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    province: "",
    district: "",
    city: "",
    streetAddress: "",
  });

  const handleChange = async (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: formData.fullName, // backend expects "name"
      phone: formData.phone,
      province: formData.province,
      district: formData.district,
      city: formData.city,
      street: formData.streetAddress, // backend expects "street"
    };
    try {
      const response = await axios.post(
        backendUrl + "/api/profile/setaddress",
        payload,
        { headers: { token } }
      );
      if (response.data.success) {
        console.log(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
  if (address) {
    setFormData({
      fullName: address.name || "",
      phone: address.phone || "",
      province: address.province || "",
      district: address.district || "",
      city: address.city || "",
      streetAddress: address.street || "",
    });
  }
}, [address]);

  return (
    <div className="px-4 h-screen">
      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto mt-25 p-4 bg-white shadow-md rounded-md"
      >
        <h2 className="text-lg font-semibold mb-4">PROFILE</h2>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Full Name *</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full bg-gray-200 p-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Phone *</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full bg-gray-200 p-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">Province *</label>
          <select
            name="province"
            value={formData.province}
            onChange={handleChange}
            className="w-full bg-gray-200 p-2 rounded"
            required
          >
            <option value="">Select Province</option>
            {provinces.map((prov) => (
              <option key={prov} value={prov}>
                {prov}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">District *</label>
          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
            className="w-full bg-gray-200 p-2 rounded"
            required
          >
            <option value="">Select District</option>
            {districts.map((dist) => (
              <option key={dist} value={dist}>
                {dist}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-medium">City *</label>
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full bg-gray-200 p-2 rounded"
            required
          >
            <option value="">Select City</option>
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

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

        <button
          type="submit"
          className="bg-black hover:bg-gray-800 text-white mt-8 py-2 px-4 w-full rounded mx-auto block"
        >
          Add Address
        </button>
      </form>
    </div>
  );
};

export default Profile;
