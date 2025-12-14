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

  const [selectedStatus, setSelectedStatus] = useState("All");


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

  const filteredOrders =
    selectedStatus === "All"
      ? orders
      : orders.filter(
        (order) => order.orderStatus === selectedStatus
      );


  return (
    <div className="p-1">
      <h1 className="text-2xl font-bold mb-4">Admin Orders</h1>
      <div className="flex gap-2 mb-4 flex-wrap">
        {["All", ...statuses].map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border border-gray-400 transition
        ${selectedStatus === status
                ? "bg-blue-900 text-white border-blue-900"
                : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto border">
        <table className="min-w-full border-b border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">Products</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Payment</th>
              <th className="p-2 border">Address</th>
              <th className="p-2 border">Order Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>

            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No orders found for <strong>{selectedStatus}</strong>
                </td>
              </tr>
            )}

            {filteredOrders.map((order) => (
              <tr key={order._id} className="text-sm">
                <td className="p-2 border">{order.orderId}</td>
                <td className="p-3 border  align-top max-w-[320px]">
                  <div className="space-y-3">
                    {order.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex gap-3 p-2 border border-gray-400 rounded-md bg-gray-50"
                      >
                        {item.productId?.images?.length > 0 && (
                          <img
                            src={item.productId.images[0]}
                            alt={item.productId?.name}
                            className="w-14 h-14 object-cover rounded border shrink-0"
                          />
                        )}

                        <div className="flex-1 break-words">
                          <p className="font-semibold leading-snug">
                            {item.productId?.name}
                          </p>

                          <p className="text-xs text-gray-600 mt-1 border border-gray-400 w-fit px-1 rounded font-medium">
                            Rs.{item.price} × {item.quantity}
                          </p>

                          <div className="text-xs text-gray-500 mt-1 space-x-2">
                            {item.size && <span>Size: {item.size}</span>}
                            {item.color && <span>Color: {item.color}</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </td>

                <td className="p-2 border">Rs.{order.amount}/-</td>
                <td className="p-2 border text-center font-medium">
                  {order.paymentMethod}
                  {/* Show payment proof image if exists */}
                  {order.paymentProof && (
                    <div className="mt-2 flex flex-col items-center gap-1">
                      <a
                        href={order.paymentProof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        View Proof
                      </a>
                      <img
                        src={order.paymentProof}
                        alt="Payment Proof"
                        className="w-12 h-12 object-cover rounded border"
                      />
                    </div>
                  )}
                </td>

                <td className="p-3 border align-center max-w-[260px] break-words whitespace-normal">
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">{order.address.fullName}</p>
                    <p className="text-gray-600">{order.address.phone}</p>
                    <p className="text-gray-700">
                      {order.address.streetAddress}, {order.address.city}
                    </p>
                    <p className="text-gray-500">
                      {order.address.district}, {order.address.province}
                    </p>
                  </div>
                </td>

                <td className="p-2 border text-center">
                  <span
                    className={`px-2 py-1 text-center rounded text-white ${order.orderStatus === "Delivered"
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
                <td className="p-2 border-t flex flex-col gap-2">
                  <select
                    value={order.orderStatus}
                    onChange={(e) => updateStatus(order._id, e.target.value)}
                    className="border px-2 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={
                      order.orderStatus === "Cancelled" ||
                      order.orderStatus === "Returned" ||
                      order.orderStatus === "Delivered" ||
                      order.returnRequest?.status === "Approved"
                    }
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>

                  {order.returnRequest?.isRequested && (
                    <div className="flex flex-col gap-1 p-2 rounded bg-gray-50 text-xs">
                      <p>
                        <strong>Return Reason:</strong>{" "}
                        {order.returnRequest.reason}
                      </p>
                      <select
                        defaultValue={order.returnRequest.status}
                        onChange={(e) =>
                          axios
                            .post(
                              `${BackendUrl}/api/order/return/handle`,
                              { orderId: order._id, decision: e.target.value },
                              { headers: { token } }
                            )
                            .then((res) => {
                              alert(res.data.message);
                              fetchOrders();
                            })
                            .catch(() =>
                              alert("Failed to update return status")
                            )
                        }
                        className=" px-2 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={
                          order.orderStatus === "Cancelled" ||
                          order.orderStatus === "Returned" ||
                          order.returnRequest?.status === "Approved"
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approve</option>
                        <option value="Rejected">Reject</option>
                      </select>
                    </div>
                  )}

                  {/* <button
                    onClick={() => deleteOrder(order._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button> */}
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
