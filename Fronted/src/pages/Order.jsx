// import { useContext, useEffect, useState, useRef } from "react";
// import { ShopContext } from "../Context/ShopContext";
// import axios from "axios";

// const Order = () => {
//   const { backendUrl, token, currency } = useContext(ShopContext);
//   const [orders, setOrders] = useState([]);
//   const [filterStatus, setFilterStatus] = useState("All");
//   const scrollRef = useRef(null);

//   const SHIPPING_CHARGE = 150;

//   // ✅ Modals state
//   const [showCancelModal, setShowCancelModal] = useState(false);
//   const [cancelOrderId, setCancelOrderId] = useState(null);

//   const [showReturnModal, setShowReturnModal] = useState(false);
//   const [returnOrderId, setReturnOrderId] = useState(null);
//   const [returnReason, setReturnReason] = useState("");

//   // ✅ Load Orders
//   const loadOrderData = async () => {
//     try {
//       if (!token) return;
//       const response = await axios.post(
//         `${backendUrl}/api/order/userorders`,
//         {},
//         { headers: { token } }
//       );
//       if (response.data.success && Array.isArray(response.data.orders)) {
//         const formattedOrders = response.data.orders.map((order) => ({
//           orderId: order._id,
//           amount: order.amount,
//           orderNumber: order.orderId,
//           date: order.createdAt,
//           status: order.orderStatus,
//           paymentMethod: order.paymentMethod,
//           returnRequest: order.returnRequest || {
//             isRequested: false,
//             status: "Pending",
//             reason: "",
//           },
//           items: order.items.map((item) => ({
//             ...item,
//             productName: item.productId?.name || "Unknown Product",
//             productImage: item.productId?.images?.[0] || "/placeholder.jpg",
//           })),
//         }));
//         setOrders(formattedOrders);
//       }
//     } catch (error) {
//       console.error("Error loading user orders:", error);
//     }
//   };

//   // ✅ Cancel Order API
//   const cancelOrderAPI = async (orderId) => {
//     try {
//       const res = await axios.post(
//         `${backendUrl}/api/order/cancel`,
//         { orderId },
//         { headers: { token } }
//       );
//       if (res.data.success) {
//         setShowCancelModal(false);
//         setCancelOrderId(null);
//         loadOrderData();
//       } else {
//         alert(res.data.message);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Failed to cancel order.");
//     }
//   };

//   // ✅ Return Order API
//   const returnOrderAPI = async (orderId, reason) => {
//     try {
//       const res = await axios.post(
//         `${backendUrl}/api/order/return`,
//         { orderId, reason },
//         { headers: { token } }
//       );
//       if (res.data.success) {
//         setShowReturnModal(false);
//         setReturnOrderId(null);
//         setReturnReason("");
//         loadOrderData();
//       } else {
//         alert(res.data.message);
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Failed to submit return request.");
//     }
//   };

//   // ✅ Fetch orders on load
//   useEffect(() => {
//     loadOrderData();
//     window.scrollTo(0, 0);
//   }, [token]);

//   const filteredOrders =
//     filterStatus === "All"
//       ? orders
//       : orders.filter((order) => order.status === filterStatus);

//   const statuses = [
//     "All",
//     "Pending",
//     "Ready To Ship",
//     "Delivered",
//     "Cancelled",
//     "Returned",
//   ];

//   // ✅ Drag to scroll horizontally
//   useEffect(() => {
//     const container = scrollRef.current;
//     if (!container) return;

//     let isDown = false;
//     let startX;
//     let scrollLeft;

//     const handleMouseDown = (e) => {
//       isDown = true;
//       startX = e.pageX - container.offsetLeft;
//       scrollLeft = container.scrollLeft;
//     };
//     const handleMouseLeave = () => (isDown = false);
//     const handleMouseUp = () => (isDown = false);
//     const handleMouseMove = (e) => {
//       if (!isDown) return;
//       e.preventDefault();
//       const x = e.pageX - container.offsetLeft;
//       const walk = (x - startX) * 1.2;
//       container.scrollLeft = scrollLeft - walk;
//     };

//     container.addEventListener("mousedown", handleMouseDown);
//     container.addEventListener("mouseleave", handleMouseLeave);
//     container.addEventListener("mouseup", handleMouseUp);
//     container.addEventListener("mousemove", handleMouseMove);

//     return () => {
//       container.removeEventListener("mousedown", handleMouseDown);
//       container.removeEventListener("mouseleave", handleMouseLeave);
//       container.removeEventListener("mouseup", handleMouseUp);
//       container.removeEventListener("mousemove", handleMouseMove);
//     };
//   }, []);

//   useEffect(() => {
//     if (showCancelModal) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }

//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [showCancelModal]);

//   useEffect(() => {
//     if (showReturnModal) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }

//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [showReturnModal]);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   return (
//     <div className="mt-5 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-5xl mx-auto">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>

//         {/* Status filter */}
//         <div
//           ref={scrollRef}
//           className="flex gap-2 mb-6 overflow-x-auto whitespace-nowrap py-1 cursor-grab active:cursor-grabbing select-none"
//           onWheel={(e) => {
//             e.preventDefault();
//             e.currentTarget.scrollLeft += e.deltaY;
//           }}
//         >
//           {statuses.map((status) => (
//             <button
//               key={status}
//               onClick={() => setFilterStatus(status)}
//               className={`px-3 py-1 rounded font-medium flex-shrink-0 ${filterStatus === status
//                 ? "bg-blue-500 text-white"
//                 : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                 } transition`}
//             >
//               {status}
//             </button>
//           ))}
//         </div>

//         {filteredOrders.length === 0 ? (
//           <p className="text-center text-gray-500 mt-10">
//             No orders found for "{filterStatus}" status.
//           </p>
//         ) : (
//           <div className="space-y-4">
//             {filteredOrders.map((order) => {
//               const subtotal = order.items.reduce(
//                 (sum, item) => sum + item.price * item.quantity,
//                 0
//               );

//               return (
//                 <div
//                   key={order.orderId}
//                   className="p-4 rounded-lg shadow-sm hover:shadow-md transition bg-white"
//                 >
//                   {/* Header */}
//                   <div className="flex flex-wrap items-center justify-between border-b pb-2 mb-3">
//                     <div>
//                       <p className="font-medium text-gray-700">
//                         Order ID:{" "}
//                         <span className="text-gray-500">
//                           #{order.orderNumber}
//                         </span>
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         Date: {new Date(order.date).toLocaleDateString()}
//                       </p>
//                       <p className="text-sm text-gray-500">
//                         Payment: {order.paymentMethod}
//                       </p>
//                     </div>

//                     <div className="flex items-center gap-5 max-[630px]:w-full justify-between">
//                       <div className="flex items-center gap-2">
//                         <span
//                           className={`w-2.5 h-2.5 rounded-full ${order.status === "Delivered"
//                             ? "bg-green-500"
//                             : order.status === "Pending"
//                               ? "bg-yellow-500"
//                               : order.status === "Ready To Ship"
//                                 ? "bg-blue-500"
//                                 : order.status === "Cancelled"
//                                   ? "bg-red-500"
//                                   : order.status === "Returned"
//                                     ? "bg-pink-500"
//                                     : "bg-gray-400"
//                             }`}
//                         ></span>
//                         <p className="font-medium text-gray-700">
//                           {order.status}
//                         </p>
//                       </div>

//                       {/* Cancel Button */}
//                       {order.status === "Pending" && (
//                         <button
//                           onClick={() => {
//                             setCancelOrderId(order.orderId);
//                             setShowCancelModal(true);
//                           }}
//                           className="bg-red-500 text-white px-3 py-1 text-sm rounded-md hover:bg-red-600 transition"
//                         >
//                           Cancel
//                         </button>
//                       )}

//                       {/* Return Button */}
//                       {order.status === "Delivered" && (
//                         <div className="flex flex-col items-center">
//                           <button
//                             onClick={() => {
//                               setReturnOrderId(order.orderId);
//                               setReturnReason("");
//                               setShowReturnModal(true);
//                             }}
//                             className={`px-3 py-1 text-sm rounded-md transition ${order.returnRequest.isRequested
//                               ? order.returnRequest.status === "Approved" ||
//                                 order.returnRequest.status === "Rejected"
//                                 ? "bg-gray-400 text-white cursor-not-allowed"
//                                 : "bg-pink-500 text-white hover:bg-pink-600"
//                               : "bg-pink-500 text-white hover:bg-pink-600"
//                               }`}
//                             disabled={
//                               order.returnRequest.status === "Approved" ||
//                               order.returnRequest.status === "Rejected"
//                             }
//                           >
//                             {order.returnRequest.isRequested
//                               ? `Return ${order.returnRequest.status}`
//                               : "Return"}
//                           </button>

//                           {order.returnRequest.isRequested && (
//                             <p className="text-xs text-gray-700 mt-1">
//                               <strong>Status:</strong>{" "}
//                               {order.returnRequest.status}
//                             </p>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   </div>

//                   {/* Items */}
//                   <div className="space-y-3">
//                     {order.items.map((item, i) => (
//                       <div
//                         key={i}
//                         className="flex items-start gap-4 border-b last:border-0 pb-2"
//                       >
//                         <img
//                           className="w-20 h-20 object-cover rounded-md"
//                           src={item.productImage}
//                           alt={item.productName}
//                         />
//                         <div>
//                           <p className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-2">
//                             {item.productName}
//                           </p>
//                           <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
//                             <p>
//                               {currency} {item.price} × {item.quantity}
//                             </p>
//                             {item.size && <p>Size: {item.size}</p>}
//                             {item.color && <p>Color: {item.color}</p>}
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>

//                   {/* Total */}
//                   <div className="text-right mt-3 text-sm sm:text-base text-gray-700">
//                     <p>
//                       Subtotal:{" "}
//                       <span className="font-medium">
//                         {currency} {subtotal.toFixed(2)} /-
//                       </span>
//                     </p>
//                     <p>
//                       Shipping:{" "}
//                       <span className="font-medium">
//                         {currency} {SHIPPING_CHARGE.toFixed(2)} /-
//                       </span>
//                     </p>
//                     <p className="font-semibold text-[16px] text-gray-900 mt-1">
//                       Total: {currency} {order.amount.toFixed(2)} /-
//                     </p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* Cancel Modal */}
//         {showCancelModal && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-opacity-40">
//             <div className="bg-white rounded-xl p-6 w-80 max-w-sm shadow-lg">
//               <h3 className="text-lg font-semibold mb-4">Confirm Cancel</h3>
//               <p className="mb-6">Are you sure you want to cancel this order?</p>
//               <div className="flex justify-end gap-3">
//                 <button
//                   className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
//                   onClick={() => setShowCancelModal(false)}
//                 >
//                   No
//                 </button>
//                 <button
//                   className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
//                   onClick={() => cancelOrderAPI(cancelOrderId)}
//                 >
//                   Yes, Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Return Modal */}
//         {showReturnModal && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-opacity-40">
//             <div className="bg-white rounded-xl p-6 w-80 max-w-sm shadow-lg">
//               <h3 className="text-lg font-semibold mb-4">Return Order</h3>

//               <textarea
//                 className="w-full border rounded-md p-2 mb-4"
//                 placeholder="Enter reason for return..."
//                 value={returnReason}
//                 onChange={(e) => setReturnReason(e.target.value)}
//               />

//               {/* Predefined reasons */}
//               <div className="mb-4">
//                 <p className="text-sm font-medium mb-1">Or select a reason:</p>
//                 <div className="flex flex-col gap-2 max-h-32 overflow-y-auto">
//                   {[
//                     "Received wrong item",
//                     "Item damaged",
//                     "Better price available",
//                     "No longer needed",
//                   ].map((reason) => (
//                     <button
//                       key={reason}
//                       type="button"
//                       onClick={() => setReturnReason(reason)}
//                       className={`text-left px-2 py-1 border rounded hover:bg-gray-100 transition ${returnReason === reason ? "bg-gray-200 font-semibold" : ""
//                         }`}
//                     >
//                       {reason}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className="flex justify-end gap-3">
//                 <button
//                   className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
//                   onClick={() => setShowReturnModal(false)}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
//                   onClick={() =>
//                     returnOrderAPI(
//                       returnOrderId,
//                       returnReason.trim() || "No reason provided"
//                     )
//                   }
//                 >
//                   Submit
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Order;

import { useContext, useEffect, useState, useRef } from "react";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";


const Order = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const scrollRef = useRef(null);
  const queryClient = useQueryClient(); // add this near top

  const SHIPPING_CHARGE = 150;

  // ✅ Modals state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnOrderId, setReturnOrderId] = useState(null);
  const [returnReason, setReturnReason] = useState("");

  // ✅ Loading state
  const [loadingAction, setLoadingAction] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // ✅ Load Orders
  const loadOrderData = async () => {
    if (!token) return;
    setLoadingOrders(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );
      if (response.data.success && Array.isArray(response.data.orders)) {
        const formattedOrders = response.data.orders.map((order) => ({
          orderId: order._id,
          amount: order.amount,
          orderNumber: order.orderId,
          date: order.createdAt,
          status: order.orderStatus,
          paymentMethod: order.paymentMethod,
          returnRequest: order.returnRequest || {
            isRequested: false,
            status: "Pending",
            reason: "",
          },
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
      toast.error("Failed to load orders");
    } finally {
      setLoadingOrders(false);
    }
  };

  // ✅ Cancel Order API
  const cancelOrderAPI = async (orderId) => {
    if (loadingAction) return;
    setLoadingAction(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/order/cancel`,
        { orderId },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success("Order cancelled successfully");
        setShowCancelModal(false);
        setCancelOrderId(null);
        await loadOrderData(); // ✅ ensures latest data
        await queryClient.refetchQueries(["products"], { exact: true }); // ✅ refetch React Query products
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to cancel order");
    } finally {
      setLoadingAction(false);
    }
  };

  // ✅ Return Order API
  const returnOrderAPI = async (orderId, reason) => {
    if (loadingAction) return;
    setLoadingAction(true);
    try {
      const res = await axios.post(
        `${backendUrl}/api/order/return`,
        { orderId, reason },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success("Return request submitted");
        setShowReturnModal(false);
        setReturnOrderId(null);
        setReturnReason("");
        await loadOrderData(); // ✅ ensures latest data
        await queryClient.refetchQueries(["products"], { exact: true }); // ✅ refetch React Query products
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit return request");
    } finally {
      setLoadingAction(false);
    }
  };

  // ✅ Fetch orders on load
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

  // ✅ Drag to scroll horizontally
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

  // ✅ Disable scroll when modal open
  useEffect(() => {
    if (showCancelModal || showReturnModal || loadingAction || loadingOrders) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [showCancelModal, showReturnModal, loadingAction, loadingOrders]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="mt-5 px-4 sm:px-6 lg:px-8 relative">
      {/* Loading overlay */}
      {(loadingAction || loadingOrders) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>

        {/* Status filter */}
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
              className={`px-3 py-1 rounded font-medium flex-shrink-0 ${filterStatus === status
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
                        <span className="text-gray-500">
                          #{order.orderNumber}
                        </span>
                      </p>
                      <p className="text-sm text-gray-500">
                        Date: {new Date(order.date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Payment: {order.paymentMethod}
                      </p>
                    </div>

                    <div className="flex items-center gap-5 max-[630px]:w-full justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${order.status === "Delivered"
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

                      {/* Cancel Button */}
                      {order.status === "Pending" && (
                        <button
                          disabled={loadingAction}
                          onClick={() => {
                            setCancelOrderId(order.orderId);
                            setShowCancelModal(true);
                          }}
                          className="bg-red-500 text-white px-3 py-1 text-sm rounded-md hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Cancel
                        </button>
                      )}

                      {/* Return Button */}
                      {order.status === "Delivered" && (
                        <div className="flex flex-col items-center">
                          <button
                            disabled={loadingAction}
                            onClick={() => {
                              setReturnOrderId(order.orderId);
                              setReturnReason("");
                              setShowReturnModal(true);
                            }}
                            className={`px-3 py-1 text-sm rounded-md transition ${order.returnRequest.isRequested
                              ? order.returnRequest.status === "Approved" ||
                                order.returnRequest.status === "Rejected"
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : "bg-pink-500 text-white hover:bg-pink-600"
                              : "bg-pink-500 text-white hover:bg-pink-600"
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                          >
                            {order.returnRequest.isRequested
                              ? `Return ${order.returnRequest.status}`
                              : "Return"}
                          </button>

                          {order.returnRequest.isRequested && (
                            <p className="text-xs text-gray-700 mt-1">
                              <strong>Status:</strong>{" "}
                              {order.returnRequest.status}
                            </p>
                          )}
                        </div>
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
                          <p className="font-semibold text-gray-800 text-sm sm:text-base line-clamp-2">
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

                  {/* Total */}
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
                      Total: {currency} {order.amount.toFixed(2)} /-
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-opacity-40">
            <div className="bg-white rounded-xl p-6 w-80 max-w-sm shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Confirm Cancel</h3>
              <p className="mb-6">
                Are you sure you want to cancel this order?
              </p>
              <div className="flex justify-end gap-3">
                <button
                  disabled={loadingAction}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setShowCancelModal(false)}
                >
                  No
                </button>
                <button
                  disabled={loadingAction}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => cancelOrderAPI(cancelOrderId)}
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Return Modal */}
        {showReturnModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-opacity-40">
            <div className="bg-white rounded-xl p-6 w-80 max-w-sm shadow-lg">
              <h3 className="text-lg font-semibold mb-4">Return Order</h3>

              <textarea
                className="w-full border rounded-md p-2 mb-4"
                placeholder="Enter reason for return..."
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
              />

              {/* Predefined reasons */}
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
                      disabled={loadingAction}
                      onClick={() => setReturnReason(reason)}
                      className={`text-left px-2 py-1 border rounded hover:bg-gray-100 transition ${returnReason === reason
                        ? "bg-gray-200 font-semibold"
                        : ""
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  disabled={loadingAction}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => setShowReturnModal(false)}
                >
                  Cancel
                </button>
                <button
                  disabled={loadingAction}
                  className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() =>
                    returnOrderAPI(
                      returnOrderId,
                      returnReason.trim() || "No reason provided"
                    )
                  }
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
