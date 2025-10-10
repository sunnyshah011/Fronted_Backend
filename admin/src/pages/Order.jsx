import { useEffect, useState } from "react";
import axios from "axios";
import { BackendUrl } from "../App";

const Order = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const statuses = [
    "Pending",
    "Ready To Ship",
    "Delivered",
    "Cancelled",
    "Returned",
  ];

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${BackendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );
      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status
  const updateStatus = async (orderId, status) => {
    try {
      const res = await axios.post(
        `${BackendUrl}/api/order/status`,
        { orderId, status },
        { headers: { token } }
      );
      if (res.data.success) {
        alert("Status updated");
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  // 🗑️ Delete order
  const deleteOrder = async (orderId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this order?"
    );
    if (!confirmDelete) return;

    try {
      const res = await axios.post(
        `${BackendUrl}/api/order/delete`,
        { orderId },
        { headers: { token } }
      );
      if (res.data.success) {
        alert("Order deleted successfully");
        fetchOrders();
      } else {
        alert(res.data.message || "Failed to delete order");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Error deleting order");
    }
  };

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Products</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Payment</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="text-sm">
                <td className="p-2 border">{order._id}</td>
                <td className="p-2 border">
                  {order.user?.name} <br />
                  {order.user?.gmail}
                </td>
                <td className="p-2 border">
                  {order.items.map((item, i) => (
                    <div key={i} className="mb-2">
                      <p className="font-medium">{item.productId?.name}</p>
                      <p className="text-xs text-gray-600">
                        Price: {item.price} × Qty: {item.quantity}
                        {item.size && ` | Size: ${item.size}`}
                        {item.color && ` | Color: ${item.color}`}
                      </p>
                    </div>
                  ))}
                </td>
                <td className="p-2 border">{order.amount}</td>
                <td className="p-2 border">{order.paymentMethod}</td>
                <td className="p-2 border">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      order.orderStatus === "Delivered"
                        ? "bg-green-500"
                        : order.orderStatus === "Pending"
                        ? "bg-yellow-500"
                        : order.orderStatus === "Ready To Ship"
                        ? "bg-blue-500"
                        : order.orderStatus === "Returned"
                        ? "bg-pink-500"
                        : "bg-red-500"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </td>
                <td className="p-2 border flex flex-col gap-2">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="border px-2 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={order.orderStatus === "Cancelled"} // ✅ disable if cancelled
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  {/* 🗑️ Delete Button */}
                  <button
                    onClick={() => deleteOrder(order._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Order;
