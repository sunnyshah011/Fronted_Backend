

import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

const OrderDetails = () => {
  const { orderId } = useParams();
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const queryClient = useQueryClient();

  // Cancel & Return States
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [canceling, setCanceling] = useState(false);

  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returning, setReturning] = useState(false);
  const [returnReason, setReturnReason] = useState("");

  const isPaymentDisabled = order
    ? ["Delivered", "Cancelled", "Returned", "Return Requested"].includes(order.orderStatus)
    : false;

  const fetchOrderDetails = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/order/${orderId}`,
        {},
        { headers: { token } }
      );

      if (res.data.success && res.data.order) {
        const o = res.data.order;
        const formattedOrder = {
          ...o,
          items: o.items.map((item) => ({
            ...item,
            productName: item.productId?.name || "Unknown Product",
            productImage: item.productId?.images?.[0] || "/placeholder.jpg",
          })),
        };
        setOrder(formattedOrder);
      } else {
        setOrder(null);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load order details");
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
    window.scrollTo(0, 0);
  }, [orderId, token]);

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!selectedFile) return toast.error("Please select a image first");
    setUploading(true);

    const formData = new FormData();
    formData.append("image", selectedFile);
    formData.append("_id", order._id);

    try {
      const res = await axios.post(
        `${backendUrl}/api/order/paymentproof`,
        formData,
        { headers: { token, "Content-Type": "multipart/form-data" } }
      );

      if (res.data.success) {
        toast.success("Payment proof uploaded/edited successfully");
        setSelectedFile(null);
        fetchOrderDetails();
      } else {
        toast.error("Failed to upload payment proof");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveProof = async () => {
    if (!window.confirm("Are you sure you want to remove the payment proof?"))
      return;

    try {
      const res = await axios.post(
        `${backendUrl}/api/order/paymentproof/remove`,
        { _id: order._id },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Payment proof removed successfully");
        fetchOrderDetails();
      } else {
        toast.error("Failed to remove payment proof");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error removing payment proof");
    }
  };

  // Cancel Order
  const cancelOrder = async () => {
    if (canceling) return;
    setCanceling(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/order/cancel`,
        { orderId: order._id },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success("Order cancelled successfully");
        setShowCancelModal(false);
        fetchOrderDetails();
        await queryClient.refetchQueries(["products"], { exact: true });
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel order");
    } finally {
      setCanceling(false);
    }
  };

  // Return Order
  const returnOrder = async () => {
    if (returning) return;
    setReturning(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/order/return`,
        { orderId: order._id, reason: returnReason || "No reason provided" },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success("Return request submitted");
        setShowReturnModal(false);
        setReturnReason("");
        fetchOrderDetails();
        await queryClient.refetchQueries(["products"], { exact: true });
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit return request");
    } finally {
      setReturning(false);
    }
  };

  if (loading)
    return <p className="text-center p-6">Loading order details...</p>;
  if (!order) return <p className="text-center p-6">Order not found.</p>;

  const subtotal = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const statusColor = {
    Pending: "bg-yellow-200 text-yellow-800",
    Completed: "bg-green-200 text-green-800",
    Cancelled: "bg-red-200 text-red-800",
  };

  return (
    <div className="max-w-4xl mx-auto px-3 py-4 space-y-4">
      {/* Order Header */}
      <div className="bg-white shadow rounded-xl p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold">
            Order #{order.orderId}
          </h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">
            Placed on {new Date(order.createdAt).toLocaleString()}
          </p>
          <p className="mt-1 text-sm md:text-base">
            Payment Method:{" "}
            <span className="font-medium">{order.paymentMethod}</span>
          </p>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <span
            className={`px-3 py-1 md:px-4 md:py-1.5 rounded-full font-semibold text-sm md:text-base ${
              statusColor[order.orderStatus] || "bg-gray-200 text-gray-800"
            }`}
          >
            {order.orderStatus}
          </span>
        </div>
      </div>

      {/* Products Section */}
      <div className="bg-white shadow rounded-xl p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-3">Products</h2>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 sm:gap-4 border-b pb-3 last:border-b-0"
            >
              <img
                src={item.productImage}
                alt={item.productName}
                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md border border-gray-400"
              />
              <div className="flex-1">
                <p className="font-semibold text-xs md:text-base">
                  {item.productName}
                </p>
                <p className="text-gray-600 text-sm md:text-base">
                  {currency} {item.price} × {item.quantity}
                </p>
                {item.size && (
                  <p className="text-gray-500 text-sm md:text-base">
                    Size: {item.size}
                  </p>
                )}
                {item.color && (
                  <p className="text-gray-500 text-sm md:text-base">
                    Color: {item.color}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="text-right mt-3 md:mt-4 space-y-1">
          <p className="font-medium text-sm md:text-base">
            Subtotal: {currency} {subtotal.toFixed(2)}/-
          </p>
          <p className="font-medium text-[13px] md:text-base">
            Shipping Fee: Rs.150/-
          </p>
          <p className="font-bold text-base md:text-lg">
            Total: {currency} {order.amount.toFixed(2)}/-
          </p>
        </div>
      </div>

      {/* Payment Proof Section */}
      <div className="bg-white shadow rounded-xl p-4 md:p-6">
        <h2 className="text-lg md:text-xl font-semibold mb-2">Payment Proof</h2>

        {order.paymentProof ? (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <img
              src={order.paymentProof}
              alt="Payment Proof"
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-cover rounded-md border"
            />
            <div className="flex flex-col  sm:items-left sm:w-80 gap-2 w-full">
              <input
                type="file"
                onChange={handleFileChange}
                className={`border rounded p-2 text-sm sm:text-base flex-1 ${
                  isPaymentDisabled ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
                disabled={isPaymentDisabled}
              />

              <button
                onClick={handleUpload}
                className={`px-4 py-2 rounded text-white w-full sm:w-auto ${
                  isPaymentDisabled || uploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                disabled={uploading || isPaymentDisabled}
              >
                {uploading ? "Uploading..." : "Edit Proof"}
              </button>

              <button
                onClick={handleRemoveProof}
                className={`px-4 py-2 rounded text-white w-full sm:w-auto ${
                  isPaymentDisabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
                disabled={isPaymentDisabled}
              >
                Remove Proof
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col  sm:items-left gap-2 w-full">
            <input
              type="file"
              onChange={handleFileChange}
              className={`border rounded p-2 text-sm sm:text-base flex-1 ${
                isPaymentDisabled ? "bg-gray-100 cursor-not-allowed" : ""
              }`}
              disabled={isPaymentDisabled}
            />
            <button
              onClick={handleUpload}
              className={`px-4 py-2 rounded text-white w-full sm:w-auto ${
                isPaymentDisabled || uploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={uploading || isPaymentDisabled}
            >
              {uploading ? "Uploading..." : "Upload Proof"}
            </button>
          </div>
        )}

        {order.paymentStatus && (
          <p className="mt-3 text-gray-600 text-[10px] bg-green-100 w-fit p-1 px-3 rounded-2xl">
            Payment Status:{" "}
            <span className="font-medium">{order.paymentStatus}</span>
          </p>
        )}
      </div>

      {/* Cancel & Return Buttons */}
      {order.orderStatus === "Pending" && (
        <div className="bg-white shadow rounded-xl p-4 md:p-6">
          <button
            onClick={() => setShowCancelModal(true)}
            className=" px-3 py-1 md:px-4 md:py-1.5 bg-red-500 text-white rounded hover:bg-red-600 text-sm md:text-base"
          >
            Cancel Order
          </button>
        </div>
      )}

      {order.orderStatus === "Delivered" && !order.isReturned && (
        <div className="bg-white shadow rounded-xl p-4 md:p-6">
          <button
            onClick={() => setShowReturnModal(true)}
            className="px-3 py-1 md:px-4 md:py-1.5 bg-pink-500 text-white rounded hover:bg-pink-600 text-sm md:text-base mt-2 md:mt-0"
          >
            Return Order
          </button>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-80 max-w-sm shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Cancel</h3>
            <p className="mb-6">Are you sure you want to cancel this order?</p>
            <div className="flex justify-end gap-3">
              <button
                disabled={canceling}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50"
                onClick={() => setShowCancelModal(false)}
              >
                No
              </button>
              <button
                disabled={canceling}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                onClick={cancelOrder}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Return Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-6 w-80 max-w-sm shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Return Order</h3>

            <textarea
              className="w-full border rounded-md p-2 mb-4"
              placeholder="Enter reason for return..."
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
            />

            <div className="mb-4">
              <p className="text-sm font-medium mb-1">Or select a reason:</p>
              <div className="flex flex-col gap-2 max-h-32 overflow-y-auto">
                {[
                  "Received wrong item",
                  "Item damaged",
                  "Better price available",
                  "No longer needed",
                ].map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    disabled={returning}
                    onClick={() => setReturnReason(reason)}
                    className={`text-left px-2 py-1 border rounded hover:bg-gray-100 transition ${
                      returnReason === reason ? "bg-gray-200 font-semibold" : ""
                    } disabled:opacity-50`}
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                disabled={returning}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50"
                onClick={() => setShowReturnModal(false)}
              >
                Cancel
              </button>
              <button
                disabled={returning}
                className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50"
                onClick={returnOrder}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
