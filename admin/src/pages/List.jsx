import axios from "axios";
import { useEffect, useState } from "react";
import { BackendUrl } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null); // for edit modal
  const [loading, setLoading] = useState(false);
  const [newImages, setNewImages] = useState({}); // store new image files

  // Fetch all products
  const fetchList = async () => {
    try {
      const response = await axios.get(BackendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Delete product
  const removeProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await axios.post(
        BackendUrl + "/api/product/remove",
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove product");
    }
  };

  // Handle new image selection
  const handleImageChange = (e, field) => {
    setNewImages({ ...newImages, [field]: e.target.files[0] });
  };

  // Update product
  const updateProduct = async () => {
    if (!selected) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("id", selected._id);
      formData.append("name", selected.name);
      formData.append("description", selected.description || "");
      formData.append("price", selected.price);
      formData.append("stock", selected.stock);
      formData.append("isTopProduct", selected.isTopProduct);
      formData.append("isBestSelling", selected.isBestSelling);
      formData.append("isFlashSale", selected.isFlashSale);
      formData.append("variants", JSON.stringify(selected.variants || []));

      ["image1", "image2", "image3", "image4"].forEach((field, index) => {
        if (newImages[field]) {
          formData.append(field, newImages[field]);
        } else if (selected.images[index]) {
          formData.append(`existing_${field}`, selected.images[index]);
        }
      });

      const response = await axios.post(
        BackendUrl + "/api/product/update",
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success("Product updated successfully");
        setSelected(null);
        setNewImages({});
        fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p className="mb-2">All Products List</p>
      <div className="flex flex-col gap-2">
        {/* List table title */}
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Status</b>
          <b className="text-center">Action</b>
        </div>

        {/* Product list */}
        {list.map((item) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
            key={item._id}
          >
            <img
              className="w-12 h-12 object-cover rounded"
              src={item.images[0]}
              alt=""
            />
            <p>{item.name}</p>
            <p>{item.subcategory?.name || "N/A"}</p>
            <p>
              Rs.{" "}
              {item.variants && item.variants.length > 0
                ? Math.min(...item.variants.map((v) => v.price))
                : item.price}{" "}
              /-
            </p>
            <p>
              {item.isFlashSale
                ? "Flash Sale"
                : item.isBestSelling
                ? "Best Selling"
                : item.isTopProduct
                ? "Top Product"
                : "Normal"}
            </p>

            <div className="flex gap-3 justify-end md:justify-center">
              <button
                className="px-2 py-1 text-xs bg-blue-500 text-white rounded"
                onClick={() => setSelected(item)}
              >
                View / Edit
              </button>
              <button
                className="px-2 py-1 text-xs bg-red-500 text-white rounded"
                onClick={() => removeProduct(item._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for view/update */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto">
          <div className="bg-white p-5 rounded shadow-lg w-full max-w-lg">
            <h2 className="text-lg font-bold mb-3">Edit Product</h2>

            <label className="block mb-2">
              Name:
              <input
                type="text"
                value={selected.name}
                onChange={(e) =>
                  setSelected({ ...selected, name: e.target.value })
                }
                className="w-full border p-1 rounded"
              />
            </label>

            <label className="block mb-2">
              Description:
              <textarea
                value={selected.description || ""}
                onChange={(e) =>
                  setSelected({ ...selected, description: e.target.value })
                }
                className="w-full border p-1 rounded"
              />
            </label>

            

            <div className="flex gap-4 my-3">
              <label>
                <input
                  type="checkbox"
                  checked={selected.isTopProduct}
                  onChange={(e) =>
                    setSelected({ ...selected, isTopProduct: e.target.checked })
                  }
                />{" "}
                Top Product
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={selected.isBestSelling}
                  onChange={(e) =>
                    setSelected({ ...selected, isBestSelling: e.target.checked })
                  }
                />{" "}
                Best Selling
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={selected.isFlashSale}
                  onChange={(e) =>
                    setSelected({ ...selected, isFlashSale: e.target.checked })
                  }
                />{" "}
                Flash Sale
              </label>
            </div>

            {/* Variants */}
            <div className="mt-4">
              <p className="font-medium mb-2">Variants (Color / Size / Stock / Price)</p>
              {selected.variants?.map((v, i) => (
                <div key={i} className="gap-2 mb-2 items-center">
                  <input
                    type="text"
                    placeholder="Color"
                    value={v.color}
                    className="border rounded p-1 flex-1"
                    onChange={(e) => {
                      const newVariants = [...selected.variants];
                      newVariants[i].color = e.target.value;
                      setSelected({ ...selected, variants: newVariants });
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Size"
                    value={v.size}
                    className="border rounded p-1 flex-1"
                    onChange={(e) => {
                      const newVariants = [...selected.variants];
                      newVariants[i].size = e.target.value;
                      setSelected({ ...selected, variants: newVariants });
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={v.stock}
                    className="border rounded p-1 flex-1"
                    onChange={(e) => {
                      const newVariants = [...selected.variants];
                      newVariants[i].stock = Number(e.target.value);
                      setSelected({ ...selected, variants: newVariants });
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    value={v.price}
                    className="border rounded p-1 flex-1"
                    onChange={(e) => {
                      const newVariants = [...selected.variants];
                      newVariants[i].price = Number(e.target.value);
                      setSelected({ ...selected, variants: newVariants });
                    }}
                  />
                  <button
                    type="button"
                    className="text-red-500"
                    onClick={() => {
                      const newVariants = selected.variants.filter((_, idx) => idx !== i);
                      setSelected({ ...selected, variants: newVariants });
                    }}
                  >
                    ❌
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="text-green-600 mt-2"
                onClick={() =>
                  setSelected({
                    ...selected,
                    variants: [
                      ...(selected.variants || []),
                      { color: "", size: "", stock: 0, price: 0 },
                    ],
                  })
                }
              >
                ➕ Add Variant
              </button>
            </div>

            <div>
              <p className="font-medium mb-2">Images:</p>
              {["image1", "image2", "image3", "image4"].map((field, idx) => (
                <div key={field} className="mb-2">
                  <input
                    type="file"
                    onChange={(e) => handleImageChange(e, field)}
                  />
                  <div className="mt-1">
                    {newImages[field] ? (
                      <img
                        src={URL.createObjectURL(newImages[field])}
                        alt="preview"
                        className="w-20 h-20 object-cover rounded"
                      />
                    ) : selected.images[idx] ? (
                      <img
                        src={selected.images[idx]}
                        alt="current"
                        className="w-20 h-20 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-500 text-xs">No image</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setSelected(null);
                  setNewImages({});
                }}
                className="px-3 py-1 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={updateProduct}
                className="px-3 py-1 bg-green-600 text-white rounded"
              >
                {loading ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default List;
