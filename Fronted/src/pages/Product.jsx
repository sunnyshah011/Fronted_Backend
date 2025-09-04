import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../Context/ShopContext";
import { toast } from "react-toastify";

const Product = () => {
  const { backendUrl, currency, addtocart } = useContext(ShopContext);
  const { id } = useParams();

  const [fproduct, setFProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  // ✅ Fetch product by _id
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return; // Prevent fetch if id is undefined
      try {
        setLoading(true);
        const { data } = await axios.get(`${backendUrl}/api/product/single/${id}`);
        if (data.success) {
          setFProduct(data.product);
        } else {
          toast.error("Product not found");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [backendUrl, id]);

  if (loading) return <p>Loading...</p>;
  if (!fproduct) return <p>Product not found</p>;

  // ✅ Extract unique sizes & colors
  const allSizes = [...new Set(fproduct.variants.map((v) => v.size))];
  const allColors = [...new Set(fproduct.variants.map((v) => v.color))];

  // ✅ Derive valid options based on selection
  const availableColors = selectedSize
    ? fproduct.variants.filter((v) => v.size === selectedSize).map((v) => v.color)
    : allColors;

  const availableSizes = selectedColor
    ? fproduct.variants.filter((v) => v.color === selectedColor).map((v) => v.size)
    : allSizes;

  // ✅ Find selected variant
  const selectedVariant =
    selectedSize && selectedColor
      ? fproduct.variants.find(
          (v) => v.size === selectedSize && v.color === selectedColor
        )
      : null;

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Product Info */}
      <h1 className="text-2xl font-bold mb-4">{fproduct.name}</h1>
      <p className="mb-6 text-gray-700">{fproduct.description}</p>

      {/* Size Selector */}
      <div className="mb-6">
        <p className="font-medium mb-2">Select Size</p>
        <div className="flex gap-2 flex-wrap">
          {allSizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              disabled={!availableSizes.includes(size)}
              className={`px-4 py-2 border rounded-lg transition ${
                selectedSize === size
                  ? "bg-black text-white"
                  : availableSizes.includes(size)
                  ? "bg-white hover:bg-gray-100"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Selector */}
      <div className="mb-6">
        <p className="font-medium mb-2">Select Color</p>
        <div className="flex gap-2 flex-wrap">
          {allColors.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              disabled={!availableColors.includes(color)}
              className={`px-4 py-2 border rounded-lg transition ${
                selectedColor === color
                  ? "bg-black text-white"
                  : availableColors.includes(color)
                  ? "bg-white hover:bg-gray-100"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Variant Info */}
      <div className="mb-6">
        {selectedVariant ? (
          <>
            <p className="text-3xl font-bold">
              {currency} {selectedVariant.price}
            </p>
            <p
              className={`text-sm font-medium ${
                selectedVariant.stock > 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              Stock: {selectedVariant.stock > 0 ? selectedVariant.stock : "Out of stock"}
            </p>
          </>
        ) : selectedSize && selectedColor ? (
          <p className="text-red-500">This combination is not available.</p>
        ) : (
          <p className="text-gray-500">Select size & color</p>
        )}
      </div>

      {/* Add to Cart */}
      <button
        onClick={() =>
          selectedVariant && selectedVariant.stock > 0
            ? addtocart(fproduct._id, selectedSize, selectedColor, 1)
            : toast.error("Please select a valid size & color")
        }
        className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default Product;
