import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../Context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";
import CartTotal from "../component/CartTotal";
import { Link } from "react-router-dom";

const Cart = () => {
  const { products, currency, cartitem, updateQuantity, navigate } =
    useContext(ShopContext);

  const [cartdata, setCartData] = useState([]);

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="mt-5 px-4">
      <h2 className="text-2xl font-semibold mb-6">My Cart</h2>

      <div className="space-y-3">
        {cartdata.map((item) => {
          const productData = products.find((p) => p._id === item._id);
          const key = `${item._id}_${item.size}_${item.color}`;
          if (!productData) return null;
          

          // ✅ Variant-based price and stock
          const variant = productData.variants?.find(
            (v) => v.size === item.size && v.color === item.color
          );
          const price = variant?.price ?? productData.price ?? 0;
          const maxStock = variant?.stock ?? Infinity;

          // ✅ Build product link (fallback to /product/:id if missing category)
          const productLink =
            productData.subcategory.category?.slug && productData.slug
              ? `/categories/${productData.subcategory.category.slug}/${productData.slug}`
              : `/product/${productData._id}`;

          return (
            <div
              key={key}
              className="bg-white shadow-sm rounded-xl px-3 py-2 sm:p-4 flex items-center gap-2 sm:gap-4"
            >
              {/* 🔹 Product Image */}
              <Link
                to={productLink}
                // `/categories/${categorySlug}/${productSlug}`
                className="flex-shrink-0"
              >
                <img
                  className="w-14 sm:w-20 h-14 sm:h-20 rounded-lg object-cover"
                  src={productData.images?.[0] || "/placeholder.png"}
                  alt={productData.name}
                />
              </Link>

              {/* 🔹 Product Details */}
              <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2">
                <div className="flex flex-col sm:flex-col sm:items-left gap-1 sm:gap-2 flex-wrap">
                  <p className="text-sm sm:text-base font-medium text-gray-700 truncate max-w-[110px] min-[340px]:max-w-[170px] min-[360px]:max-w-[190px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[700px]">
                    {productData.name}
                  </p>

                  <span className="text-[15px] font-semibold text-gray-900">
                    {currency} {price} /-
                  </span>

                  <span className="px-2 py-0.5 text-xs border border-gray-200 bg-gray-50 rounded-md">
                    Size: {item.size}
                  </span>

                  {item.color && (
                    <span className="px-2 py-0.5 text-xs border border-gray-200 bg-gray-50 rounded-md">
                      Color: {item.color}
                    </span>
                  )}
                </div>

                {/* ✅ Quantity Controls */}
                <div className="flex items-center">
                  <button
                    onClick={() => {
                      if (item.quantity > 1) {
                        updateQuantity(
                          item._id,
                          item.size,
                          item.color,
                          item.quantity - 1
                        );
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
                        updateQuantity(
                          item._id,
                          item.size,
                          item.color,
                          item.quantity + 1
                        );
                      }
                    }}
                    className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 🔹 Delete Button */}
              <img
                onClick={() =>
                  updateQuantity(item._id, item.size, item.color, 0)
                }
                className="w-5 sm:w-6 cursor-pointer hover:opacity-70 transition"
                src={assets.bin_icon}
                alt="Remove"
                title="Remove item"
              />
            </div>
          );
        })}
      </div>

      {/* ✅ Show totals if items exist */}
      {cartdata.length > 0 && (
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
