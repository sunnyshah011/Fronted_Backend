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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Orders</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Order ID</th>
              {/* <th className="p-2 border">User</th> */}
              <th className="p-2 border">Products</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Payment</th>
              <th className="p-2 border">Payment Status</th>
              <th className="p-2 border">Address</th>
              <th className="p-2 border">Order Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="text-sm">
                <td className="p-2 border">{order.orderId}</td>
                {/* <td className="p-2 border">
                  {order.user?.name} <br />
                  {order.user?.gmail}
                </td> */}
                <td className="p-2 border">
                  {order.items.map((item, i) => (
                    <div key={i} className="mb-2 flex items-center gap-2">
                      {item.productId?.images?.length > 0 && (
                        <img
                          src={item.productId.images[0]} // Base64 image
                          alt={item.productId?.name}
                          className="w-12 h-12 object-cover rounded border"
                        />
                      )}
                      <div>
                        <p className="font-medium pb-1">
                          {item.productId?.name}
                        </p>
                        <p className=" text-gray-600 border border-gray-400 w-fit px-1 rounded font-medium">
                          Price: {item.price} × Qty: {item.quantity}
                        </p>
                        <div className="text-xs pt-1">
                          {item.size && `  Size: ${item.size}`}
                          {item.color && `  Color: ${item.color}`}
                        </div>
                      </div>
                    </div>
                  ))}
                </td>
                <td className="p-2 border">{order.amount}</td>
                <td className="p-2 border">
                  {order.paymentMethod}{" "}
                  {order.paymentMethodId && (
                    <span className="text-xs text-gray-500">
                      (ID: {order.paymentMethodId})
                    </span>
                  )}
                  {/* Show payment proof image if exists */}
                  {order.paymentProof && (
                    <div className="mt-1 flex items-center gap-2">
                      <a
                        href={order.paymentProof}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs"
                      >
                        View Proof
                      </a>
                      <img
                        src={order.paymentProof} // Assuming this is a full URL or Base64
                        alt="Payment Proof"
                        className="w-12 h-12 object-cover rounded border"
                      />
                    </div>
                  )}
                </td>
                <td className="p-2 border">{order.paymentStatus || "N/A"}</td>
                <td className="p-2 border ">
                  {order.address.fullName} <br />
                  {order.address.phone} <br />
                  {order.address.streetAddress}, {order.address.city},{" "}
                  {order.address.district}, {order.address.province}
                </td>
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
                    disabled={
                      order.orderStatus === "Cancelled" ||
                      order.orderStatus === "Returned" ||
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
                    <div className="flex flex-col gap-1 border p-2 rounded bg-gray-50 text-xs">
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
                        className="border px-2 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
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
