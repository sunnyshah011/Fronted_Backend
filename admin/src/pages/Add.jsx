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

  //delivery charge for each product
  const [deliveryCharge, setDeliveryCharge] = useState(150);
  const [error, setError] = useState("");

  const [discountedPrice, setDiscountedPrice] = useState(0);


  const handleChange = (e) => {
    const value = Number(e.target.value);
    setDeliveryCharge(value);

    if (value < 150) {
      setError("Delivery charge must be at least Rs.150");
    } else {
      setError("");
    }
  };

  // Variants
  const [variants, setVariants] = useState([
    { color: "", size: "", stock: 0, price: 0 },
  ]);

  // Loading state
  const [loading, setLoading] = useState(false);

  // Fetch categories
  const loadCategories = async () => {
    try {
      const res = await axios.get(`${BackendUrl}/api/categories`);
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

  // Compress image and convert to WebP
  const compressAndConvertToWebP = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob(
            (blob) => {
              resolve(
                new File([blob], file.name.replace(/\.[^/.]+$/, ".webp"), {
                  type: "image/webp",
                })
              );
            },
            "image/webp",
            0.8
          );
        };
      };
    });
  };

  // Handle image upload + preview
  const handleImageChange = async (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const webpFile = await compressAndConvertToWebP(file);
      setImages((prev) => ({ ...prev, [field]: webpFile }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(webpFile);
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
    if (loading) return; // prevent double submit
    if (!selectedSubcategory) return toast.error("Select a subcategory");
    if (deliveryCharge < 150)
      return toast.error("Delivery charge must be at least Rs.150");

    setLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("subcategory", selectedSubcategory);
    formData.append("variants", JSON.stringify(variants));
    formData.append("isTopProduct", isTopProduct);
    formData.append("isBestSelling", isBestSelling);
    formData.append("isFlashSale", isFlashSale);
    formData.append("deliveryCharge", Number(deliveryCharge));
    formData.append("discountedPrice", Number(discountedPrice));


    ["image1", "image2", "image3", "image4"].forEach(
      (f) => images[f] && formData.append(f, images[f])
    );

    // Optimistic UI toast
    toast.success("Product added! Uploading images...");

    try {
      await axios.post(`${BackendUrl}/api/product/add`, formData, {
        headers: { token },
      });

      // Reset form after upload
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
      setDeliveryCharge(150);
      setDiscountedPrice(0);
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {/* Left Column */}
      <div className="space-y-6">
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

          <div>
            <p className="font-medium mb-2">
              Variants (Color / Size / Stock / Price)
            </p>
            {variants.map((v, i) => (
              <div key={i} className="gap-2 mb-2 items-center">
                <input
                  type="text"
                  placeholder="Color"
                  value={v.color}
                  onChange={(e) =>
                    handleVariantChange(i, "color", e.target.value)
                  }
                  className="border rounded-lg p-2 flex-1"
                  required
                />
                <input
                  type="text"
                  placeholder="Size"
                  value={v.size}
                  onChange={(e) =>
                    handleVariantChange(i, "size", e.target.value)
                  }
                  className="border rounded-lg p-2 flex-1"
                  required
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={v.stock}
                  onChange={(e) =>
                    handleVariantChange(i, "stock", e.target.value)
                  }
                  className="border rounded-lg p-2 flex-1"
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={v.price}
                  onChange={(e) =>
                    handleVariantChange(i, "price", e.target.value)
                  }
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
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Discounted Price <span className="text-sm text-red-500">(only for flashsale & topproduct)</span></h2>

          <input
            type="number"
            value={discountedPrice}
            onChange={(e) => setDiscountedPrice(Number(e.target.value))}
            className="border rounded-lg p-2 w-full"
            placeholder="Enter discounted price (Optional)"
          />
        </div>

      </div>


      {/* Right Column */}
      <div className="space-y-6">
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

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold">
            Product Delivery Charge{" "}
            <span className="text-sm pl-2 font-medium text-emerald-600">
              Default Charge - Rs.150/-
            </span>
          </h2>

          <input
            type="number"
            min={150}
            value={deliveryCharge}
            onChange={handleChange}
            className={`border rounded-lg p-2 flex-1 ${error ? "border-red-500" : "border-gray-300"
              }`}
            required
          />

          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>



        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`bg-green-600 text-white px-6 py-2 rounded-xl shadow hover:bg-green-700 ${loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
          >
            {loading ? "Adding..." : "Add Product"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddProduct;
