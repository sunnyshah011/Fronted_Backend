import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../Context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";
import CartTotal from "../component/CartTotal";
import { Link } from "react-router-dom";

const Cart = () => {
  const { products, currency, cartitem, updateQuantity, navigate } = useContext(ShopContext);
  const [cartdata, setCartData] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});

  // Prepare cart data
  useEffect(() => {
    const tempData = [];
    for (const productId in cartitem) {
      for (const size in cartitem[productId]) {
        const qty = cartitem[productId][size];
        if (qty > 0) {
          tempData.push({ _id: productId, size, quantity: qty });
        }
      }
    }
    setCartData(tempData);

    // Keep only existing selected items
    setSelectedItems((prev) => {
      const updated = {};
      tempData.forEach((item) => {
        const key = `${item._id}_${item.size}`;
        if (prev[key]) updated[key] = true;
      });
      return updated;
    });
  }, [cartitem, products]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleSelectItem = (id, size) => {
    const key = `${id}_${size}`;
    setSelectedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const deleteSelected = () => {
    Object.keys(selectedItems).forEach((key) => {
      if (selectedItems[key]) {
        const [id, size] = key.split("_");
        updateQuantity(id, size, 0);
      }
    });
    setSelectedItems({});
  };

  return (
    <div className="mt-5 px-4">
      <h2 className="text-2xl font-semibold mb-6">My Cart</h2>

      {cartdata.length > 0 && (
        <div className="flex justify-end mb-4">
          <button
            onClick={deleteSelected}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition"
          >
            Delete Selected
          </button>
        </div>
      )}

      <div className="space-y-3">
        {cartdata.map((item) => {
          const productData = products.find((p) => p._id === item._id);
          const key = `${item._id}_${item.size}`;

          // Skip rendering if product data is missing
          if (!productData) return null;

          return (
            <div
              key={key}
              className="bg-white shadow-sm rounded-xl px-3 py-2 sm:p-4 flex items-center gap-2 sm:gap-4"
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={!!selectedItems[key]}
                onChange={() => toggleSelectItem(item._id, item.size)}
              />

              {/* Image */}
              <Link to={`/product/${item._id}`} className="flex-shrink-0">
                <img
                  className="w-14 sm:w-20 h-14 sm:h-20 rounded-lg object-cover"
                  src={productData.image[0]}
                  alt={productData.name}
                />
              </Link>

              {/* Product info + quantity */}
              <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 flex-wrap">
                  <p className="text-sm sm:text-base font-medium text-gray-800 truncate w-40">
                    {productData.name}
                  </p>
                  <span className="text-sm font-semibold text-gray-700">
                    {currency} {productData.price}
                  </span>
                  <span className="px-2 py-0.5 w-30 text-xs border border-gray-300 bg-gray-50 rounded-md">
                    Size: {item.size}
                  </span>
                </div>

                {/* Quantity input */}
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (val >= 1) updateQuantity(item._id, item.size, val);
                  }}
                  className="border border-gray-300 rounded-md px-2 py-1 w-14 text-center"
                />
              </div>

              {/* Delete button */}
              <img
                onClick={() => updateQuantity(item._id, item.size, 0)}
                className="w-5 sm:w-6 cursor-pointer hover:opacity-70 transition"
                src={assets.bin_icon}
                alt="Remove"
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-end mt-6 sm:mt-12">
        <div className="w-full sm:w-[450px] p-4 bg-white shadow-md rounded-xl border border-gray-200">
          <CartTotal />
          <div className="w-full text-center sm:text-right mt-4 sm:mt-6">
            <button
              onClick={() => navigate("./placeorder")}
              className="bg-black text-white text-sm sm:text-base px-8 sm:px-12 py-3 rounded-lg hover:bg-gray-800 transition"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
