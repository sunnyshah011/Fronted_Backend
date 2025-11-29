import { useContext, useEffect, useState, useRef } from "react";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";
// import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";


const Order = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [filterStatus, setFilterStatus] = useState("All");
  const scrollRef = useRef(null);


  // const [orders, setOrders] = useState([]);
  // const [loadingOrders, setLoadingOrders] = useState(false);

  // Load orders
  // const loadOrderData = async () => {
  //   if (!token) return;
  //   setLoadingOrders(true);

  //   try {
  //     const response = await axios.post(
  //       `${backendUrl}/api/order/userorders`,
  //       {},
  //       { headers: { token } }
  //     );

  //     if (response.data.success && Array.isArray(response.data.orders)) {
  //       const formattedOrders = response.data.orders.map((order) => ({
  //         orderId: order._id,
  //         amount: order.amount,
  //         orderNumber: order.orderId,
  //         date: order.createdAt,
  //         status: order.orderStatus,
  //         paymentMethod: order.paymentMethod,
  //         items: order.items.map((item) => ({
  //           ...item,
  //           productName: item.productId?.name || "Unknown Product",
  //           productImage: item.productId?.images?.[0] || "/placeholder.jpg",
  //         })),
  //       }));

  //       setOrders(formattedOrders);
  //     }
  //   } catch (error) {
  //     console.error("Error loading user orders:", error);
  //     toast.error("Failed to load orders");
  //   } finally {
  //     setLoadingOrders(false);
  //   }
  // };

  // useEffect(() => {
  //   loadOrderData();
  //   window.scrollTo(0, 0);
  // }, [token]);

  const {
    data: orders = [],
    isLoading: loadingOrders,
  } = useQuery({
    queryKey: ["userOrders", token],
    queryFn: async () => {
      if (!token) return [];

      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );

      if (!response.data.success || !Array.isArray(response.data.orders)) {
        return [];
      }

      return response.data.orders.map((order) => ({
        orderId: order._id,
        amount: order.amount,
        orderNumber: order.orderId,
        date: order.createdAt,
        status: order.orderStatus,
        paymentMethod: order.paymentMethod,
        items: order.items.map((item) => ({
          ...item,
          productName: item.productId?.name || "Unknown Product",
          productImage: item.productId?.images?.[0] || "/placeholder.jpg",
        })),
      }));
    },
    enabled: !!token,
    refetchOnWindowFocus: false,
  });


  const filteredOrders =
    filterStatus === "All"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  const statuses = [
    "All",
    "Pending",
    "Ready To Ship",
    "Delivered",
    "Cancelled",
    "Returned",
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);


  return (
    <div className="mt-5 px-4 sm:px-6 lg:px-8">
      {/* Loading overlay */}
      {loadingOrders && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-medium text-gray-800 mb-6">My Orders</h2>

        {/* Status filter */}
        <div
          ref={scrollRef}
          className="flex gap-2 mb-6 overflow-x-auto whitespace-nowrap py-1 select-none"
          onWheel={(e) => {
            e.preventDefault();
            e.currentTarget.scrollLeft += e.deltaY;
          }}
        >
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded font-medium shrink-0 ${filterStatus === status
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                } transition`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders */}
        {filteredOrders.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No orders found for "{filterStatus}" status.
          </p>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Link
                key={order.orderId}
                to={`/order/${order.orderId}`}
                className="block p-4 rounded-lg shadow-sm hover:shadow-md transition bg-white cursor-pointer relative overflow-hidden"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-2">
                  <p className="font-medium text-gray-700 px-2 py-0.5 text-md border border-gray-200 bg-gray-50 rounded-md w-fit">
                    Order ID #{order.orderNumber}
                  </p>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-semibold ${order.status === "Delivered"
                      ? "bg-green-200 text-green-800"
                      : order.status === "Pending"
                        ? "bg-yellow-200 text-yellow-800"
                        : order.status === "Ready To Ship"
                          ? "bg-blue-200 text-blue-800"
                          : order.status === "Cancelled"
                            ? "bg-red-200 text-red-800"
                            : order.status === "Returned"
                              ? "bg-pink-200 text-pink-800"
                              : "bg-gray-200 text-gray-800"
                      }`}
                  >
                    {order.status}
                  </span>
                </div>

                {/* Subtotal/Amount */}
                <div className="flex justify-between text-gray-600 text-sm mb-3">
                  <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                  <p className="font-medium">
                    Total: {currency} {order.amount.toFixed(2)}
                  </p>
                </div>

                {/* Products preview */}
                <div className="flex gap-2 overflow-hidden">
                  {order.items.slice(0, 2).map((item, i) => (
                    <div key={i} className="shrink-0 w-16 h-16 relative">
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  ))}

                  {order.items.length > 2 && (
                    <div className="shrink-0 w-16 h-16 bg-gray-100 text-gray-600 flex items-center justify-center rounded-md text-sm font-semibold">
                      +{order.items.length - 2}
                    </div>
                  )}
                </div>

                {/* Fade overlay with smooth gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-18 flex items-end justify-end pointer-events-none bg-linear-to-t from-white/80 via-white/20 to-transparent px-4 py-2  font-semibold text-sm rounded-b-lg">
                  <span className="px-2 py-1 rounded-lg text-[10px] bg-white text-gray-600 font-medium border border-gray-300">
                    View Order Detail
                  </span>
                </div>

              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
