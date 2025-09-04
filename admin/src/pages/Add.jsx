import { useState, useEffect } from "react";
import axios from "axios";
import { BackendUrl } from "../App";
import { toast } from "react-toastify";

const AddProduct = ({ token }) => {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  const [images, setImages] = useState({});
  const [imagePreviews, setImagePreviews] = useState({});

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Flags
  const [isTopProduct, setIsTopProduct] = useState(false);
  const [isBestSelling, setIsBestSelling] = useState(false);
  const [isFlashSale, setIsFlashSale] = useState(false);

  // Variants: color + size + stock + price
  const [variants, setVariants] = useState([
    { color: "", size: "", stock: 0, price: 0 },
  ]);

  // Fetch categories
  const loadCategories = async () => {
    try {
      const res = await axios.get(BackendUrl + "/api/categories");
      setCategories(res.data.categories || []);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch subcategories
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

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory("");
    loadSubcategories(categoryId);
  };

  // Handle image upload + preview
  const handleImageChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      setImages({ ...images, [field]: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Variants handlers
  const addVariant = () =>
    setVariants([...variants, { color: "", size: "", stock: 0, price: 0 }]);

  const removeVariant = (index) =>
    setVariants(variants.filter((_, i) => i !== index));

  const handleVariantChange = (index, key, value) => {
    const newVariants = [...variants];
    newVariants[index][key] =
      key === "stock" || key === "price" ? Number(value) : value;
    setVariants(newVariants);
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSubcategory) return toast.error("Select a subcategory");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("subcategory", selectedSubcategory);
    formData.append("variants", JSON.stringify(variants));

    formData.append("isTopProduct", isTopProduct);
    formData.append("isBestSelling", isBestSelling);
    formData.append("isFlashSale", isFlashSale);

    ["image1", "image2", "image3", "image4"].forEach(
      (f) => images[f] && formData.append(f, images[f])
    );

    try {
      const res = await axios.post(`${BackendUrl}/api/product/add`, formData, {
        headers: { token },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setName("");
        setDescription("");
        setVariants([{ color: "", size: "", stock: 0, price: 0 }]);
        setImages({});
        setImagePreviews({});
        setSelectedCategory("");
        setSelectedSubcategory("");
        setIsTopProduct(false);
        setIsBestSelling(false);
        setIsFlashSale(false);
      } else toast.error(res.data.message);
      
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {/* Left Column */}
      <div className="space-y-6">
        {/* General Information */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">General Information</h2>

          <label className="block text-sm font-medium">Product Name</label>
          <input
            type="text"
            className="w-full border rounded-lg p-2 mb-4"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label className="block text-sm font-medium">Description</label>
          <textarea
            className="w-full border rounded-lg p-2 mb-4"
            placeholder="Product Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Variants */}
          <div>
            <p className="font-medium mb-2">Variants (Color / Size / Stock / Price)</p>
            {variants.map((v, i) => (
              <div key={i} className=" gap-2 mb-2 items-center">
                <input
                  type="text"
                  placeholder="Color"
                  value={v.color}
                  onChange={(e) => handleVariantChange(i, "color", e.target.value)}
                  className="border rounded-lg p-2 flex-1"
                  required
                />
                <input
                  type="text"
                  placeholder="Size"
                  value={v.size}
                  onChange={(e) => handleVariantChange(i, "size", e.target.value)}
                  className="border rounded-lg p-2 flex-1"
                  required
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={v.stock}
                  onChange={(e) => handleVariantChange(i, "stock", e.target.value)}
                  className="border rounded-lg p-2 flex-1"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={v.price}
                  onChange={(e) => handleVariantChange(i, "price", e.target.value)}
                  className="border rounded-lg p-2 flex-1"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeVariant(i)}
                  className="text-red-500"
                >
                  ❌
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addVariant}
              className="text-green-600 mt-2"
            >
              ➕ Add Variant
            </button>
          </div>

          {/* Category */}
          <div className="mt-4">
            <label className="block text-sm font-medium">Category</label>
            <select
              className="w-full border rounded-lg p-2 mb-4"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <label className="block text-sm font-medium">Subcategory</label>
            <select
              className="w-full border rounded-lg p-2"
              value={selectedSubcategory}
              onChange={(e) => setSelectedSubcategory(e.target.value)}
            >
              <option value="">Select Subcategory</option>
              {subcategories.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Upload Images */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Upload Images</h2>
          {["image1", "image2", "image3", "image4"].map((f) => (
            <div key={f} className="mb-4">
              <input
                type="file"
                onChange={(e) => handleImageChange(e, f)}
                className="w-full"
              />
              {imagePreviews[f] && (
                <img
                  src={imagePreviews[f]}
                  alt="preview"
                  className="mt-2 w-28 h-28 object-cover rounded-lg border"
                />
              )}
            </div>
          ))}
        </div>

        {/* Flags */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Product Flags</h2>
          <div className="flex flex-col gap-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isTopProduct}
                onChange={(e) => setIsTopProduct(e.target.checked)}
              />
              Top Product
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isBestSelling}
                onChange={(e) => setIsBestSelling(e.target.checked)}
              />
              Best Selling
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={isFlashSale}
                onChange={(e) => setIsFlashSale(e.target.checked)}
              />
              Flash Sale
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded-xl shadow hover:bg-green-700"
          >
            Add Product
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddProduct;
