import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";

const ProductSuggestion = () => {
  const { products } = useContext(ShopContext);

  if (!products || products.length === 0) return null;

  return (
    <div className="block sm:hidden p-4">
      <p className="font-semibold mb-2">More to explore</p>

      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-3 py-2">
          {products.slice(0, 10).map((item) => (
            <div
              key={item?._id}
              className="min-w-[125px] bg-white rounded-lg shadow p-2"
            >
              <img
                src={item?.images?.[0] || "/placeholder.png"}
                alt={item?.name || "Product"}
                className="w-full h-24 object-cover rounded"
              />

              <p className="text-sm mt-2 font-medium line-clamp-1">
                {item?.name}
              </p>

              <p className="text-xs text-gray-600">
                Rs. {item?.variants?.[0].price}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductSuggestion;
