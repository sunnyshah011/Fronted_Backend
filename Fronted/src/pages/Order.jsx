import { useContext, useEffect, useState, useRef } from "react";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";

const Order = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const scrollRef = useRef(null);

  const SHIPPING_CHARGE = 150; // ✅ fixed shipping charge

  const loadOrderData = async () => {
    try {
      if (!token) return;

      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );

      if (response.data.success && Array.isArray(response.data.orders)) {
        const formattedOrders = response.data.orders.map((order) => ({
          orderId: order._id,
          date: order.createdAt,
          status: order.orderStatus,
          paymentMethod: order.paymentMethod,
          items: order.items.map((item) => ({
            ...item,
            productName: item.productId?.name || "Unknown Product",
            productImage: item.productId?.images?.[0] || "/placeholder.jpg",
          })),
        }));
        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error("Error loading user orders:", error);
    }
  };

  useEffect(() => {
    loadOrderData();
    window.scrollTo(0, 0);
  }, [token]);

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

  // ✅ drag-to-scroll horizontally
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };
    const handleMouseLeave = () => (isDown = false);
    const handleMouseUp = () => (isDown = false);
    const handleMouseMove = (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 1.2;
      container.scrollLeft = scrollLeft - walk;
    };

    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/cancel`,
        { orderId },
        { headers: { token } }
      );
      if (response.data.success) {
        alert("Order cancelled successfully!");
        loadOrderData();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to cancel order. Please try again.");
    }
  };

  return (
    <div className="mt-5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>

        {/* Status filter (scrollable horizontally + draggable) */}
        <div
          ref={scrollRef}
          className="flex gap-2 mb-6 overflow-x-auto whitespace-nowrap py-1 cursor-grab active:cursor-grabbing select-none"
          onWheel={(e) => {
            e.preventDefault();
            e.currentTarget.scrollLeft += e.deltaY;
          }}
        >
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3 py-1 rounded font-medium flex-shrink-0 ${
                filterStatus === status
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } transition`}
            >
              {status}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            No orders found for "{filterStatus}" status.
          </p>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const subtotal = order.items.reduce(
                (sum, item) => sum + item.price * item.quantity,
                0
              );
              const total = subtotal + SHIPPING_CHARGE; // ✅ add shipping charge

              return (
                <div
                  key={order.orderId}
                  className="p-4 rounded-lg shadow-sm hover:shadow-md transition bg-white"
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-center justify-between border-b pb-2 mb-3">
                    <div>
                      <p className="font-medium text-gray-700">
                        Order ID:{" "}
                        <span className="text-gray-500">{order.orderId}</span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Date: {new Date(order.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Payment: {order.paymentMethod}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            order.status === "Delivered"
                              ? "bg-green-500"
                              : order.status === "Pending"
                              ? "bg-yellow-500"
                              : order.status === "Ready To Ship"
                              ? "bg-blue-500"
                              : order.status === "Cancelled"
                              ? "bg-red-500"
                              : order.status === "Returned"
                              ? "bg-pink-500"
                              : "bg-gray-400"
                          }`}
                        ></span>
                        <p className="font-medium text-gray-700">
                          {order.status}
                        </p>
                      </div>

                      {/* <button
                        onClick={loadOrderData}
                        className="border border-gray-200 px-3 py-1 text-sm rounded-md hover:bg-gray-100 transition"
                      >
                        Track
                      </button> */}

                      {order.status === "Pending" && (
                        <button
                          onClick={() => cancelOrder(order.orderId)}
                          className="bg-red-500 text-white px-3 py-1 text-sm rounded-md hover:bg-red-600 transition"
                        >
                          Cancel
                        </button>
                      )}

                      {order.status === "Delivered" && (
                        <button
                          onClick={() => {
                            const reason = prompt(
                              "Please enter reason for return (or leave blank to cancel):"
                            );
                            if (!reason) return;
                            axios
                              .post(
                                `${backendUrl}/api/order/return`,
                                { orderId: order.orderId, reason },
                                { headers: { token } }
                              )
                              .then((res) => {
                                if (res.data.success) {
                                  alert("Return request submitted!");
                                  loadOrderData();
                                } else {
                                  alert(res.data.message);
                                }
                              })
                              .catch((err) => {
                                console.error(err);
                                alert("Failed to submit return request.");
                              });
                          }}
                          className="bg-pink-500 text-white px-3 py-1 text-sm rounded-md hover:bg-pink-600 transition"
                        >
                          Return
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    {order.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-4 border-b last:border-0 pb-2"
                      >
                        <img
                          className="w-20 h-20 object-cover rounded-md"
                          src={item.productImage}
                          alt={item.productName}
                        />
                        <div>
                          <p className="font-semibold text-gray-800 text-sm sm:text-base">
                            {item.productName}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                            <p>
                              {currency} {item.price} × {item.quantity}
                            </p>
                            {item.size && <p>Size: {item.size}</p>}
                            {item.color && <p>Color: {item.color}</p>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* ✅ Total with shipping */}
                  <div className="text-right mt-3 text-sm sm:text-base text-gray-700">
                    <p>
                      Subtotal:{" "}
                      <span className="font-medium">
                        {currency} {subtotal.toFixed(2)} /-
                      </span>
                    </p>
                    <p>
                      Shipping:{" "}
                      <span className="font-medium">
                        {currency} {SHIPPING_CHARGE.toFixed(2)} /-
                      </span>
                    </p>
                    <p className="font-semibold text-[16px] text-gray-900 mt-1">
                      Total: {currency} {total.toFixed(2)} /-
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
