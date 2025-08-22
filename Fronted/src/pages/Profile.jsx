import { useState } from 'react';

const provinces = ['Bagmati', 'Gandaki', 'Lumbini'];
const districts = ['Chitwan', 'Kathmandu', 'Pokhara'];
const cities = [
  'Bharatpur Metropolitan City ward no. - 01',
  'Lalitpur Sub-Metropolitan',
  'Pokhara Lekhnath Metropolitan'
];

const Profile = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    province: '',
    district: '',
    city: '',
    streetAddress: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add POST logic here
  };

  return (
    <div className='px-4'>
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


//fullname
//phone
//province
//district
//city
//street address