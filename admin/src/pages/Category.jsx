import { useEffect, useState } from "react";
import axios from "axios";
import { BackendUrl } from "../App.jsx";

export default function CategoryManager({ token }) {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [newCategory, setNewCategory] = useState("");
  const [newCategoryImage, setNewCategoryImage] = useState(null);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryImage, setEditCategoryImage] = useState(null);

  const [newSubcategory, setNewSubcategory] = useState("");
  const [editSubcategoryId, setEditSubcategoryId] = useState(null);

  // Fetch categories
  const loadCategories = async () => {
    const res = await axios.get(BackendUrl + "/api/categories");
    setCategories(res.data.categories || []);
  };

  const loadSubcategories = async (categoryId) => {
    try {
      const res = await axios.get(
        `${BackendUrl}/api/subcategories/category/${categoryId}`
      );
      setSubcategories(res.data.subcategories || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // ---------------- CATEGORY ACTIONS ----------------
  const handleAddCategory = async () => {
    if (!newCategory.trim() || !newCategoryImage) return;

    const formData = new FormData();
    formData.append("name", newCategory);
    formData.append("image", newCategoryImage);

    await axios.post(BackendUrl + "/api/categories", formData, {
      headers: {
        token,
        "Content-Type": "multipart/form-data",
      },
    });

    setNewCategory("");
    setNewCategoryImage(null);
    loadCategories();
  };

  const handleEditCategory = async () => {
    if (!editCategoryId || !editCategoryName.trim()) return;

    const formData = new FormData();
    formData.append("name", editCategoryName);
    if (editCategoryImage) {
      formData.append("image", editCategoryImage);
    }

    await axios.put(BackendUrl + `/api/categories/${editCategoryId}`, formData, {
      headers: {
        token,
        "Content-Type": "multipart/form-data",
      },
    });

    setEditCategoryId(null);
    setEditCategoryName("");
    setEditCategoryImage(null);
    loadCategories();
  };

  const handleDeleteCategory = async (id) => {
    await axios.delete(BackendUrl + `/api/categories/${id}`, {
      headers: { token },
    });
    if (selectedCategory === id) {
      setSelectedCategory(null);
      setSubcategories([]);
    }
    loadCategories();
  };

  // ---------------- SUBCATEGORY ACTIONS ----------------
  const handleAddSubcategory = async () => {
    if (!newSubcategory.trim() || !selectedCategory) return;
    await axios.post(
      BackendUrl + "/api/subcategories",
      {
        name: newSubcategory,
        category: selectedCategory,
      },
      { headers: { token } }
    );
    setNewSubcategory("");
    loadSubcategories(selectedCategory);
  };

  const handleEditSubcategory = async (id, name) => {
    await axios.put(
      BackendUrl + `/api/subcategories/${id}`,
      { name },
      { headers: { token } }
    );
    setEditSubcategoryId(null);
    loadSubcategories(selectedCategory);
  };

  const handleDeleteSubcategory = async (id) => {
    await axios.delete(BackendUrl + `/api/subcategories/${id}`, {
      headers: { token },
    });
    loadSubcategories(selectedCategory);
  };

  return (
    <div className="p-6 grid grid-cols-1 gap-6">
      {/* --------- CATEGORIES --------- */}
      <div className="border rounded-xl p-4 shadow">
        <h2 className="text-xl font-bold mb-4">Categories</h2>

        <div className="flex gap-2 mb-4">
          <input
            className="border p-2 flex-1 rounded"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Add category..."
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setNewCategoryImage(e.target.files[0])}
            className="border p-2 rounded"
          />
          <button
            onClick={handleAddCategory}
            className="bg-blue-500 text-white px-4 rounded"
          >
            Add
          </button>
        </div>

        <ul>
          {categories.map((c) => (
            <li key={c._id} className="flex justify-between items-center mb-2">
              {editCategoryId === c._id ? (
                <div className="flex gap-2 items-center flex-wrap">
                  <input
                    className="border p-1"
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEditCategoryImage(e.target.files[0])}
                  />
                  <button
                    onClick={handleEditCategory}
                    className="bg-green-500 text-white px-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditCategoryId(null);
                      setEditCategoryName("");
                      setEditCategoryImage(null);
                    }}
                    className="bg-gray-400 text-white px-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span
                    className={`cursor-pointer ${
                      selectedCategory === c._id ? "font-bold" : ""
                    }`}
                    onClick={() => {
                      setSelectedCategory(c._id);
                      loadSubcategories(c._id);
                    }}
                  >
                    {c.name}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditCategoryId(c._id);
                        setEditCategoryName(c.name);
                      }}
                      className="text-yellow-500"
                    >
                      Edit
                    </button>
                    {/* <button
                      onClick={() => handleDeleteCategory(c._id)}
                      className="text-red-500"
                    >
                      Delete
                    </button> */}
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* --------- SUBCATEGORIES --------- */}
      {selectedCategory && (
        <div className="border rounded-xl p-4 shadow">
          <h2 className="text-xl font-bold mb-4">Subcategories</h2>

          <div className="flex gap-2 mb-4">
            <input
              className="border p-2 flex-1 rounded"
              value={newSubcategory}
              onChange={(e) => setNewSubcategory(e.target.value)}
              placeholder="Add subcategory..."
            />
            <button
              onClick={handleAddSubcategory}
              className="bg-green-500 text-white px-4 rounded"
            >
              Add
            </button>
          </div>

          <ul>
            {subcategories.map((sc) => (
              <li
                key={sc._id}
                className="flex justify-between items-center mb-2"
              >
                {editSubcategoryId === sc._id ? (
                  <input
                    className="border p-1"
                    defaultValue={sc.name}
                    onBlur={(e) => handleEditSubcategory(sc._id, e.target.value)}
                  />
                ) : (
                  <>
                    <span>{sc.name}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditSubcategoryId(sc._id)}
                        className="text-yellow-500"
                      >
                        Edit
                      </button>
                      {/* <button
                        onClick={() => handleDeleteSubcategory(sc._id)}
                        className="text-red-500"
                      >
                        Delete
                      </button> */}
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
