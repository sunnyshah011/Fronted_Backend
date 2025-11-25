import { useContext, useState, useEffect, useMemo } from "react";
import { ShopContext } from "../Context/ShopContext";
import CartTotal from "../component/CartTotal";
import { Link } from "react-router-dom";
import debounce from "lodash.debounce";
import { FaFish } from "react-icons/fa";
import { TrashIcon } from "@heroicons/react/24/outline";

const Cart = () => {
  const { products, currency, cartitem, updateQuantity, navigate } =
    useContext(ShopContext);

  const [cartdata, setCartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingItem, setUpdatingItem] = useState(null);

  // 🔹 Build flat array from nested cart structure
  useEffect(() => {
    const temp = [];
    for (const productId in cartitem) {
      for (const size in cartitem[productId]) {
        for (const color in cartitem[productId][size]) {
          const qty = cartitem[productId][size][color];
          if (qty > 0)
            temp.push({ _id: productId, size, color, quantity: qty });
        }
      }
    }
    setCartData(temp);
  }, [cartitem, products]);

  // 🔹 Debounce quantity updates (prevents localStorage lag)
  const debouncedUpdateQuantity = useMemo(
    () => debounce(updateQuantity, 300),
    [updateQuantity]
  );

  const handleQuantityChange = async (item, newQty) => {
    const key = `${item._id}_${item.size}_${item.color}`;
    if (updatingItem === key) return; // ignore rapid clicks
    setUpdatingItem(key);

    const productData = products.find((p) => p._id === item._id);
    const variant = productData?.variants?.find(
      (v) => v.size === item.size && v.color === item.color
    );
    const maxStock = variant?.stock ?? Infinity;
    if (newQty > maxStock) newQty = maxStock;

    setCartData((prev) =>
      prev.map((i) =>
        i._id === item._id && i.size === item.size && i.color === item.color
          ? { ...i, quantity: newQty }
          : i
      )
    );

    await debouncedUpdateQuantity(item._id, item.size, item.color, newQty);
    setUpdatingItem(null);
  };

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [loading]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 🟢 Loader trigger when proceeding
  const handleProceed = () => {
    setLoading(true);
    setTimeout(() => {
      navigate("./placeorder");
    }, 1000); // redirect after 1.5s
  };

  return (
    <div className="mt-5 px-4">
      {/* 🐟 Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <FaFish className="text-blue-500 text-5xl animate-bounce" />
          <p className="mt-3 text-gray-700 font-medium">Please wait...</p>
        </div>
      )}

      <h2 className="text-2xl font-semibold text-gray-800 mb-4">My Cart</h2>

      <div className="space-y-3">
        {cartdata.map((item) => {
          const productData = products.find((p) => p._id === item._id);
          if (!productData) return null;

          const key = `${item._id}_${item.size}_${item.color}`;
          const variant = productData.variants?.find(
            (v) => v.size === item.size && v.color === item.color
          );

          const price = variant?.price ?? productData.price ?? 0;
          const maxStock = variant?.stock ?? Infinity;

          const productLink =
            productData.subcategory?.category?.slug && productData.slug
              ? `/categories/${productData.subcategory.category.slug}/${productData.slug}`
              : `/product/${productData._id}`;

          return (
            <div
              key={key}
              className="bg-white shadow-sm rounded-xl px-3 py-2 sm:p-4 flex items-center gap-2 sm:gap-4"
            >
              {/* 🔹 Product Image */}
              <Link to={productLink} className="shrink-0">
                <img
                  className="w-14 sm:w-20 h-14 sm:h-20 rounded-lg object-cover"
                  src={productData.images?.[0] || "/placeholder.png"}
                  alt={productData.name}
                />
              </Link>

              {/* 🔹 Product Details */}
              <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 flex-wrap">
                <div className="flex flex-col gap-1 sm:gap-2">
                  <p className="text-sm sm:text-base text-gray-950 sm:truncate sm:w-150 line-clamp-1">
                    {productData.name}
                  </p>

                  <span className="text-[18px] sm:text-[20px] font-medium text-gray-700">
                    <span className="text-[16px]">{currency}</span>{price} /-
                  </span>

                  <span className="px-2 py-0.5 text-xs border border-gray-200 bg-gray-50 rounded-md w-fit text-gray-700">
                    Size: {item.size}
                  </span>

                  {item.color && (
                    <span className="px-2 py-0.5 text-xs border border-gray-200 bg-gray-50 rounded-md w-fit text-gray-700">
                      Color: {item.color}
                    </span>
                  )}
                </div>

                {/* ✅ Quantity Controls */}
                <div className="flex items-center">
                  <button
                    onClick={() => {
                      if (item.quantity > 1) {
                        handleQuantityChange(item, item.quantity - 1);
                      }
                    }}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 transition"
                  >
                    –
                  </button>

                  <span className="w-8 text-center text-sm font-medium">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => {
                      if (item.quantity < maxStock) {
                        handleQuantityChange(item, item.quantity + 1);
                      }
                    }}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 🔹 Delete Button */}
              <TrashIcon
                onClick={() => handleQuantityChange(item, 0)}
                className="w-5 h-5 sm:w-6 sm:h-6 cursor-pointer text-red-400 hover:opacity-70 transition"
                title="Remove item"
              />
            </div>
          );
        })}
      </div>

      {/* ✅ Show totals if items exist */}
      {cartdata.length > 0 && (
        <div className="flex justify-end mt-6 sm:mt-5">
          <div className="w-full sm:w-[450px] p-4 bg-white shadow-md rounded-xl border border-gray-200">
            <CartTotal />
            <div className="w-full text-center sm:text-right mt-4 sm:mt-6">
              <button
                onClick={handleProceed}
                disabled={loading}
                className="bg-black text-white text-lg sm:text-base px-8 sm:px-12 py-3 font-medium  rounded-lg hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "PROCEED TO CHECKOUT"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Empty Cart */}
      {cartdata.length === 0 && (
        <div className="text-center text-gray-600 py-10 flex flex-col justify-center items-center gap-2">
          <div>Your cart is empty.</div>

          <Link to="/">
            <div className="border w-35 py-1 text-center border-gray-400 bg-sky-800 text-white rounded-sm">
              Shop Now
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Cart;
