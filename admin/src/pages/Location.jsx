import { useState, useEffect } from "react";
import axios from "axios";
import { BackendUrl } from "../App";

const Location = ({ token }) => {
  const [view, setView] = useState("provinces"); // provinces | districts | cities
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  const [newName, setNewName] = useState("");
  const [editingItem, setEditingItem] = useState(null); // { type: "province"|"district"|"city", name: string }

  // ✅ Fetch provinces
  const fetchProvinces = async () => {
    const res = await axios.get(`${BackendUrl}/api/location/province`);
    setProvinces(res.data.provinces); // array of objects
  };

  // ✅ Fetch districts
  const fetchDistricts = async (provinceName) => {
    const res = await axios.get(
      `${BackendUrl}/api/location/${provinceName}/districts`
    );
    setDistricts(res.data.districts); // array of objects
  };

  // ✅ Fetch cities
  const fetchCities = async (provinceName, districtName) => {
    const res = await axios.get(
      `${BackendUrl}/api/location/${provinceName}/${districtName}/cities`
    );
    setCities(res.data.cities); // array of objects
  };

  /* ---------------- ADD ---------------- */
  const addProvince = async () => {
    await axios.post(
      `${BackendUrl}/api/location/province`,
      { province: newName },
      { headers: { token } }
    );
    setNewName("");
    fetchProvinces();
  };

  const addDistrict = async () => {
    await axios.post(
      `${BackendUrl}/api/location/${selectedProvince}/district`,
      { district: newName },
      { headers: { token } }
    );
    setNewName("");
    fetchDistricts(selectedProvince);
  };

  const addCity = async () => {
    await axios.post(
      `${BackendUrl}/api/location/${selectedProvince}/${selectedDistrict}/city`,
      { city: newName },
      { headers: { token } }
    );
    setNewName("");
    fetchCities(selectedProvince, selectedDistrict);
  };

  /* ---------------- EDIT ---------------- */
  const editItem = async () => {
    if (!editingItem) return;

    if (editingItem.type === "province") {
      await axios.put(
        `${BackendUrl}/api/location/province/${editingItem.name}`,
        { newName },
        { headers: { token } }
      );
      fetchProvinces();
    } else if (editingItem.type === "district") {
      await axios.put(
        `${BackendUrl}/api/location/${selectedProvince}/district/${editingItem.name}`,
        { newName },
        { headers: { token } }
      );
      fetchDistricts(selectedProvince);
    } else if (editingItem.type === "city") {
      await axios.put(
        `${BackendUrl}/api/location/${selectedProvince}/${selectedDistrict}/city/${editingItem.name}`,
        { newName },
        { headers: { token } }
      );
      fetchCities(selectedProvince, selectedDistrict);
    }

    setNewName("");
    setEditingItem(null);
  };

  /* ---------------- DELETE ---------------- */
  const deleteItem = async (type, name) => {
    if (type === "province") {
      await axios.delete(`${BackendUrl}/api/location/province/${name}`, {
        headers: { token },
      });
      fetchProvinces();
    } else if (type === "district") {
      await axios.delete(
        `${BackendUrl}/api/location/${selectedProvince}/district/${name}`,
        { headers: { token } }
      );
      fetchDistricts(selectedProvince);
    } else if (type === "city") {
      await axios.delete(
        `${BackendUrl}/api/location/${selectedProvince}/${selectedDistrict}/city/${name}`,
        { headers: { token } }
      );
      fetchCities(selectedProvince, selectedDistrict);
    }
  };

  // load provinces first
  useEffect(() => {
    fetchProvinces();
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Admin Panel – Manage Locations</h2>

      {/* ---------------- Provinces ---------------- */}
      {view === "provinces" && (
        <>
          <h3 className="font-semibold mb-2">Provinces</h3>
          <ul className="mb-4">
            {provinces.map((prov) => (
              <li
                key={prov._id}
                className="flex justify-between items-center p-2 border-b hover:bg-gray-50"
              >
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedProvince(prov.name);
                    fetchDistricts(prov.name);
                    setView("districts");
                  }}
                >
                  {prov.name}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setEditingItem({ type: "province", name: prov.name });
                      setNewName(prov.name);
                    }}
                    className="text-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteItem("province", prov.name)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <input
            type="text"
            placeholder="New Province"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          {editingItem ? (
            <button
              onClick={editItem}
              className="bg-yellow-600 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={addProvince}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Add Province
            </button>
          )}
        </>
      )}

      {/* ---------------- Districts ---------------- */}
      {view === "districts" && (
        <>
          <button
            onClick={() => setView("provinces")}
            className="text-blue-600 mb-2"
          >
            ← Back to Provinces
          </button>
          <h3 className="font-semibold mb-2">
            Districts in {selectedProvince}
          </h3>
          <ul className="mb-4">
            {districts.map((dist) => (
              <li
                key={dist.name}
                className="flex justify-between items-center p-2 border-b hover:bg-gray-50"
              >
                <span
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedDistrict(dist.name);
                    fetchCities(selectedProvince, dist.name);
                    setView("cities");
                  }}
                >
                  {dist.name}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setEditingItem({ type: "district", name: dist.name });
                      setNewName(dist.name);
                    }}
                    className="text-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteItem("district", dist.name)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <input
            type="text"
            placeholder="New District"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          {editingItem ? (
            <button
              onClick={editItem}
              className="bg-yellow-600 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={addDistrict}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Add District
            </button>
          )}
        </>
      )}

      {/* ---------------- Cities ---------------- */}
      {view === "cities" && (
        <>
          <button
            onClick={() => setView("districts")}
            className="text-blue-600 mb-2"
          >
            ← Back to Districts
          </button>
          <h3 className="font-semibold mb-2">
            Cities in {selectedDistrict}, {selectedProvince}
          </h3>
          <ul className="mb-4">
            {cities.map((c) => (
              <li
                key={c.name}
                className="flex justify-between items-center p-2 border-b hover:bg-gray-50"
              >
                <span>{c.name}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => {
                      setEditingItem({ type: "city", name: c.name });
                      setNewName(c.name);
                    }}
                    className="text-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteItem("city", c.name)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <input
            type="text"
            placeholder="New City"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border p-2 w-full mb-2"
          />
          {editingItem ? (
            <button
              onClick={editItem}
              className="bg-yellow-600 text-white px-4 py-2 rounded"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={addCity}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              Add City
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Location;
