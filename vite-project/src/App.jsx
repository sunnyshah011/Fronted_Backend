// import { useState, useEffect } from "react";
// import axios from "axios";

// const App = () => {
//   const [province, setProvince] = useState("");
//   const [district, setDistrict] = useState("");
//   const [city, setCity] = useState("");

//   const [provinces, setProvinces] = useState([]);
//   const [districts, setDistricts] = useState([]);

//   // ✅ Fetch all provinces
//   const fetchProvinces = async () => {
//     try {
//       const res = await axios.get("/api/locations/provinces");
//       setProvinces(res.data);
//     } catch (err) {
//       console.error("Error fetching provinces:", err);
//     }
//   };

//   // ✅ Fetch districts of selected province
//   const fetchDistricts = async (prov) => {
//     try {
//       const res = await axios.get(`/api/locations/${prov}/districts`);
//       setDistricts(res.data);
//     } catch (err) {
//       console.error("Error fetching districts:", err);
//     }
//   };

//   useEffect(() => {
//     fetchProvinces();
//   }, []);

//   useEffect(() => {
//     if (province) fetchDistricts(province);
//   }, [province]);

//   // ✅ Add Province
//   const addProvince = async () => {
//     if (!province) return alert("Enter province name!");
//     try {
//       await axios.post("/api/admin/locations/province", { province });
//       alert("Province added!");
//       setProvince("");
//       fetchProvinces();
//     } catch (err) {
//       console.error("Error adding province:", err);
//       alert("Failed to add province.");
//     }
//   };

//   // ✅ Add District
//   const addDistrict = async () => {
//     if (!province || !district) return alert("Select province & enter district!");
//     try {
//       await axios.post(`/api/admin/locations/${province}/district`, { district });
//       alert("District added!");
//       setDistrict("");
//       fetchDistricts(province);
//     } catch (err) {
//       console.error("Error adding district:", err);
//       alert("Failed to add district.");
//     }
//   };

//   // ✅ Add City
//   const addCity = async () => {
//     if (!province || !district || !city) {
//       return alert("Select province, district & enter city!");
//     }
//     try {
//       await axios.post(`/api/admin/locations/${province}/${district}/city`, { city });
//       alert("City added!");
//       setCity("");
//     } catch (err) {
//       console.error("Error adding city:", err);
//       alert("Failed to add city.");
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
//       <h2 className="text-xl font-bold mb-4">Admin Panel – Manage Locations</h2>

//       {/* Province Form */}
//       <div className="mb-6">
//         <h3 className="font-semibold mb-2">Add Province</h3>
//         <input
//           type="text"
//           placeholder="Province Name"
//           value={province}
//           onChange={(e) => setProvince(e.target.value)}
//           className="border p-2 w-full mb-2"
//         />
//         <button
//           onClick={addProvince}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Add Province
//         </button>
//       </div>

//       {/* District Form */}
//       <div className="mb-6">
//         <h3 className="font-semibold mb-2">Add District</h3>
//         <select
//           value={province}
//           onChange={(e) => setProvince(e.target.value)}
//           className="border p-2 w-full mb-2"
//         >
//           <option value="">--Select Province--</option>
//           {provinces.map((prov) => (
//             <option key={prov} value={prov}>{prov}</option>
//           ))}
//         </select>

//         <input
//           type="text"
//           placeholder="District Name"
//           value={district}
//           onChange={(e) => setDistrict(e.target.value)}
//           className="border p-2 w-full mb-2"
//         />
//         <button
//           onClick={addDistrict}
//           className="bg-green-600 text-white px-4 py-2 rounded"
//         >
//           Add District
//         </button>
//       </div>

//       {/* City Form */}
//       <div>
//         <h3 className="font-semibold mb-2">Add City</h3>
//         <select
//           value={province}
//           onChange={(e) => setProvince(e.target.value)}
//           className="border p-2 w-full mb-2"
//         >
//           <option value="">--Select Province--</option>
//           {provinces.map((prov) => (
//             <option key={prov} value={prov}>{prov}</option>
//           ))}
//         </select>

//         <select
//           value={district}
//           onChange={(e) => setDistrict(e.target.value)}
//           className="border p-2 w-full mb-2"
//         >
//           <option value="">--Select District--</option>
//           {districts.map((dist) => (
//             <option key={dist} value={dist}>{dist}</option>
//           ))}
//         </select>

//         <input
//           type="text"
//           placeholder="City Name"
//           value={city}
//           onChange={(e) => setCity(e.target.value)}
//           className="border p-2 w-full mb-2"
//         />
//         <button
//           onClick={addCity}
//           className="bg-purple-600 text-white px-4 py-2 rounded"
//         >
//           Add City
//         </button>
//       </div>
//     </div>
//   );
// };

// export default App;


/////wihtout db .................................................
// import { useState, useEffect } from "react";


// const App = () => {
//   const [province, setProvince] = useState("");
//   const [district, setDistrict] = useState("");
//   const [city, setCity] = useState("");

//   // ✅ Dummy Data (instead of DB)
//   const [provinces, setProvinces] = useState(["Bagmati", "Gandaki"]);
//   const [districts, setDistricts] = useState(["Kathmandu", "Pokhara"]);
//   const [cities, setCities] = useState([
//     "Lalitpur Sub-Metropolitan",
//     "Pokhara Metropolitan",
//   ]);

//   // ✅ Add Province
//   const addProvince = async () => {
//     if (!province) return alert("Enter province name!");
//     try {
//       setProvinces([...provinces, province]); // mock DB insert
//       alert("Province added!");
//       setProvince("");
//     } catch (err) {
//       console.error("Error adding province:", err);
//     }
//   };

//   // ✅ Add District
//   const addDistrict = async () => {
//     if (!district || !province) return alert("Select province & enter district!");
//     try {
//       setDistricts([...districts, district]); // mock DB insert
//       alert(`District added under ${province}!`);
//       setDistrict("");
//     } catch (err) {
//       console.error("Error adding district:", err);
//     }
//   };

//   // ✅ Add City
//   const addCity = async () => {
//     if (!city || !district) return alert("Select district & enter city!");
//     try {
//       setCities([...cities, city]); // mock DB insert
//       alert(`City added under ${district}!`);
//       setCity("");
//     } catch (err) {
//       console.error("Error adding city:", err);
//     }
//   };

//   return (
//     <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
//       <h2 className="text-xl font-bold mb-4">Admin Panel – Manage Locations</h2>

//       {/* Province Form */}
//       <div className="mb-6">
//         <h3 className="font-semibold mb-2">Add Province</h3>
//         <input
//           type="text"
//           placeholder="Province Name"
//           value={province}
//           onChange={(e) => setProvince(e.target.value)}
//           className="border p-2 w-full mb-2"
//         />
//         <button
//           onClick={addProvince}
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Add Province
//         </button>

//         {/* Show Provinces */}
//         <ul className="mt-2 list-disc ml-5 text-sm">
//           {provinces.map((p, i) => (
//             <li key={i}>{p}</li>
//           ))}
//         </ul>
//       </div>

//       {/* District Form */}
//       <div className="mb-6">
//         <h3 className="font-semibold mb-2">Add District</h3>
//         <select
//           value={province}
//           onChange={(e) => setProvince(e.target.value)}
//           className="border p-2 w-full mb-2"
//         >
//           <option value="">--Select Province--</option>
//           {provinces.map((prov, i) => (
//             <option key={i} value={prov}>
//               {prov}
//             </option>
//           ))}
//         </select>

//         <input
//           type="text"
//           placeholder="District Name"
//           value={district}
//           onChange={(e) => setDistrict(e.target.value)}
//           className="border p-2 w-full mb-2"
//         />
//         <button
//           onClick={addDistrict}
//           className="bg-green-600 text-white px-4 py-2 rounded"
//         >
//           Add District
//         </button>

//         {/* Show Districts */}
//         <ul className="mt-2 list-disc ml-5 text-sm">
//           {districts.map((d, i) => (
//             <li key={i}>{d}</li>
//           ))}
//         </ul>
//       </div>

//       {/* City Form */}
//       <div>
//         <h3 className="font-semibold mb-2">Add City</h3>
//         <select
//           value={district}
//           onChange={(e) => setDistrict(e.target.value)}
//           className="border p-2 w-full mb-2"
//         >
//           <option value="">--Select District--</option>
//           {districts.map((dist, i) => (
//             <option key={i} value={dist}>
//               {dist}
//             </option>
//           ))}
//         </select>

//         <input
//           type="text"
//           placeholder="City Name"
//           value={city}
//           onChange={(e) => setCity(e.target.value)}
//           className="border p-2 w-full mb-2"
//         />
//         <button
//           onClick={addCity}
//           className="bg-purple-600 text-white px-4 py-2 rounded"
//         >
//           Add City
//         </button>

//         {/* Show Cities */}
//         <ul className="mt-2 list-disc ml-5 text-sm">
//           {cities.map((c, i) => (
//             <li key={i}>{c}</li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default App;


import { useState } from "react";

const AdminPanel = () => {
  const [provinces, setProvinces] = useState([
    {
      name: "Bagmati",
      districts: [
        { name: "Kathmandu", cities: ["Kirtipur", "Lalitpur"] },
        { name: "Chitwan", cities: ["Bharatpur"] },
      ],
    },
    {
      name: "Gandaki",
      districts: [{ name: "Pokhara", cities: ["Lekhnath", "Pokhara Metro"] }],
    },
  ]);

  const [provinceName, setProvinceName] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");

  const [districtName, setDistrictName] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [cityName, setCityName] = useState("");

  // Add Province
  const addProvince = () => {
    if (!provinceName) return alert("Enter province name!");
    setProvinces([...provinces, { name: provinceName, districts: [] }]);
    setProvinceName("");
  };

  // Add District
  const addDistrict = () => {
    if (!selectedProvince || !districtName)
      return alert("Select province & enter district!");
    setProvinces(
      provinces.map((prov) =>
        prov.name === selectedProvince
          ? {
              ...prov,
              districts: [...prov.districts, { name: districtName, cities: [] }],
            }
          : prov
      )
    );
    setDistrictName("");
  };

  // Add City
  const addCity = () => {
    if (!selectedProvince || !selectedDistrict || !cityName)
      return alert("Select district & enter city!");
    setProvinces(
      provinces.map((prov) =>
        prov.name === selectedProvince
          ? {
              ...prov,
              districts: prov.districts.map((dist) =>
                dist.name === selectedDistrict
                  ? { ...dist, cities: [...dist.cities, cityName] }
                  : dist
              ),
            }
          : prov
      )
    );
    setCityName("");
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow space-y-8">
      <h2 className="text-2xl font-bold">Admin Panel – Manage Locations</h2>

      {/* Province Form */}
      <div>
        <h3 className="font-semibold mb-2">Add Province</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Province Name"
            value={provinceName}
            onChange={(e) => setProvinceName(e.target.value)}
            className="border p-2 w-full rounded"
          />
          <button
            onClick={addProvince}
            className="bg-blue-600 text-white px-4 rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* District Form */}
      <div>
        <h3 className="font-semibold mb-2">Add District</h3>
        <select
          value={selectedProvince}
          onChange={(e) => {
            setSelectedProvince(e.target.value);
            setSelectedDistrict(""); // reset district
          }}
          className="border p-2 w-full mb-2 rounded"
        >
          <option value="">--Select Province--</option>
          {provinces.map((prov, i) => (
            <option key={i} value={prov.name}>
              {prov.name}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="District Name"
            value={districtName}
            onChange={(e) => setDistrictName(e.target.value)}
            className="border p-2 w-full rounded"
          />
          <button
            onClick={addDistrict}
            className="bg-green-600 text-white px-4 rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* City Form */}
      <div>
        <h3 className="font-semibold mb-2">Add City</h3>
        {/* Province Select */}
        <select
          value={selectedProvince}
          onChange={(e) => {
            setSelectedProvince(e.target.value);
            setSelectedDistrict("");
          }}
          className="border p-2 w-full mb-2 rounded"
        >
          <option value="">--Select Province--</option>
          {provinces.map((prov, i) => (
            <option key={i} value={prov.name}>
              {prov.name}
            </option>
          ))}
        </select>

        {/* District Select */}
        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        >
          <option value="">--Select District--</option>
          {provinces
            .find((p) => p.name === selectedProvince)
            ?.districts.map((dist, i) => (
              <option key={i} value={dist.name}>
                {dist.name}
              </option>
            ))}
        </select>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="City Name"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            className="border p-2 w-full rounded"
          />
          <button
            onClick={addCity}
            className="bg-purple-600 text-white px-4 rounded"
          >
            Add
          </button>
        </div>
      </div>

      {/* Show Hierarchy */}
      <div>
        <h3 className="font-semibold mb-2">Current Locations</h3>
        <ul className="list-disc ml-5 space-y-1">
          {provinces.map((prov, i) => (
            <li key={i}>
              <strong>{prov.name}</strong>
              <ul className="ml-5 list-circle">
                {prov.districts.map((dist, j) => (
                  <li key={j}>
                    {dist.name}
                    <ul className="ml-5 list-square text-sm text-gray-600">
                      {dist.cities.map((c, k) => (
                        <li key={k}>{c}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;
