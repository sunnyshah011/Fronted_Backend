// PaymentMethod.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { BackendUrl } from "../App";

const PaymentMethod = ({ token }) => {
  const [methods, setMethods] = useState([]);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch payment methods
  const fetchMethods = async () => {
    try {
      const res = await axios.get(`${BackendUrl}/api/paymentmethods`, {
        headers: { token },
      });
      setMethods(res.data.methods || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch payment methods");
      setMethods([]);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  // Handle Add / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || (!image && !editingId)) {
      toast.error("Name and Image are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("title", title);
    formData.append("accountNumber", accountNumber);
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      if (editingId) {
        const res = await axios.put(
          `${BackendUrl}/api/paymentmethods/${editingId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data", token } }
        );
        toast.success(res.data.message || "Updated successfully");
      } else {
        const res = await axios.post(
          `${BackendUrl}/api/paymentmethods`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data", token },
          }
        );
        toast.success(res.data.message || "Added successfully");
      }
      setName("");
      setTitle("");
      setAccountNumber("");
      setImage(null);
      setEditingId(null);
      fetchMethods();
    } catch (err) {
      console.error(err);
      toast.error("Failed to save payment method");
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this method?")) return;
    try {
      const res = await axios.delete(`${BackendUrl}/api/paymentmethods/${id}`, {
        headers: { token },
      });
      toast.success(res.data.message || "Deleted successfully");
      fetchMethods();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  };

  // Edit
  const handleEdit = (method) => {
    setEditingId(method._id);
    setName(method.name || "");
    setTitle(method.title || "");
    setAccountNumber(method.accountNumber || "");
    setImage(null); // re-upload optional
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">
        {editingId ? "Edit Payment Method" : "Add Payment Method"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Account Number
          </label>
          <input
            type="number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image *</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full"
            required={!editingId}
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editingId ? "Update" : "Add"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setName("");
                setTitle("");
                setAccountNumber("");
                setImage(null);
              }}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="text-xl font-semibold mb-2">Existing Payment Methods</h2>
      {methods.length > 0 ? (
        <div className="space-y-4">
          {methods.map((m) => (
            <div
              key={m._id}
              className="flex items-center justify-between border p-3 rounded"
            >
              <div className="flex items-center gap-4">
                <img
                  src={`${BackendUrl.replace("/api", "")}/${m.image}`}
                  alt={m.name}
                  className="w-12 h-12 object-contain rounded border"
                />
                <div>
                  <p className="font-medium">{m.name}</p>
                  {m.title && (
                    <p className="text-sm text-gray-600">{m.title}</p>
                  )}
                  {m.accountNumber && (
                    <p className="text-sm text-gray-600">{m.accountNumber}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(m)}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(m._id)}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No payment methods found.</p>
      )}
    </div>
  );
};

export default PaymentMethod;
