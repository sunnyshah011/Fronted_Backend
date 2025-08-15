import { useContext, useEffect } from "react";
import { ShopContext } from "../Context/ShopContext";

const Order = () => {
  const { products, currency } = useContext(ShopContext);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="mt-20 px-4">
      <div className="text-2xl">
        <p className="font-semibold mb-4">MY ORDERS</p>

        <div>
          {products.slice(1, 10).map((item, index) => (
            <div
              key={index}
              className="py-4 border-t border-b border-gray-400  text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex items-start gap-6 text-sm">
                <img
                  className="w-16 sm:w-20 object-cover"
                  src={item.image[0]}
                  alt={item.name}
                />
                <div>
                  <p className="sm:text-base font-medium">{item.name}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-base text-gray-400">
                    <p className="text-lg">
                      {currency} {item.price}
                    </p>
                    <p>Quantity: 1</p>
                    <p>Size: M</p>
                  </div>
                  <p>
                    Date:{" "}
                    <span className="text-gray-400">25, Jan 2025</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end md:gap-8 w-full md:w-auto">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <p className="text-sm md:text-base">Ready to ship</p>
                </div>
                <button className="border px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-100 transition">
                  Track Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Order;
