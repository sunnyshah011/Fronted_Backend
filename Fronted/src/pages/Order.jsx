// import { useContext, useEffect, useState } from "react";
// import { ShopContext } from "../Context/ShopContext";
// import axios from "axios";

// const Order = () => {
//   const { backendUrl, token, currency } = useContext(ShopContext);

//   const [orderData, setOrderData] = useState([]);

//   const loadOrderData = async () => {
//     try {
//       if (!token) {
//         return null;
//       }

//       const response = await axios.post(
//         backendUrl + "/api/order/userorders",
//         {},
//         { headers: { token } }
//       );

//       if (response.data.success) {
//         let allOrderItems = [];
//         response.data.orders.map((order) => {
//           order.items.map((item) => {
//             item["status"] = order.status;
//             item["payment"] = order.payment;
//             item["paymentMethod"] = order.paymentMethod;
//             item["date"] = order.date;
//             allOrderItems.push(item);
//           });
//         });
//         setOrderData(allOrderItems.reverse());
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     loadOrderData();
//     window.scrollTo(0, 0);
//   }, [token]);

//   return (
//     <div className="mt-5 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-5xl mx-auto">
//         <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>

//         {orderData.length === 0 ? (
//           <p className="text-center text-gray-500 mt-10">
//             You don’t have any orders yet.
//           </p>
//         ) : (
//           <div className="space-y-3">
//             {orderData.map((item, index) => (
//               <div
//                 key={index}
//                 className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-4 rounded-lg shadow-sm hover:shadow-sm transition bg-white"
//               >
//                 {/* LEFT: Product Info */}
//                 <div className="flex items-start gap-4">
//                   <img
//                     className="w-20 h-20 object-cover rounded-md"
//                     src={item.image[0]}
//                     alt={item.name}
//                   />
//                   <div>
//                     <p className="font-semibold text-gray-800 text-sm sm:text-base truncate max-w-[110px] min-[340px]:max-w-[170px] min-[360px]:max-w-[190px] sm:max-w-[300px] md:max-w-[400px] lg:max-w-[700px]">
//                       {item.name}
//                     </p>

//                     <div className="flex flex-wrap items-center gap-2  text-[12px] text-gray-500">
//                       <p className="font-medium text-gray-800">
//                         {currency} {item.price} /-
//                       </p>
//                       <p>Qty: {item.quantity}</p>
//                       <p>Size: {item.size}</p>
//                     </div>
//                     <p className="text-xs sm:text-sm mt-1">
//                       Date:{" "}
//                       <span className="text-gray-500">
//                         {new Date(item.date).toDateString()}
//                       </span>
//                     </p>
//                     <p className="text-xs sm:text-sm mt-1">
//                       Payment:{" "}
//                       <span className="text-gray-500">
//                         {item.paymentMethod}
//                       </span>
//                     </p>
//                   </div>
//                 </div>

//                 {/* RIGHT: Status + Track */}
//                 <div className="flex items-center justify-between md:justify-end md:gap-8 w-full md:w-auto">
//                   <div className="flex items-center gap-2">
//                     <span
//                       className={`w-2.5 h-2.5 rounded-full ${
//                         item.status === "Delivered"
//                           ? "bg-green-500"
//                           : item.status === "Pending"
//                           ? "bg-yellow-500"
//                           : "bg-blue-500"
//                       }`}
//                     ></span>
//                     <p className="text-sm md:text-base font-medium text-gray-700">
//                       {item.status}
//                     </p>
//                   </div>
//                   <button
//                     onClick={loadOrderData}
//                     className="border border-gray-200 px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition"
//                   >
//                     Track Order
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Order;

import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";

const Order = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);
  const [orderData, setOrderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) return;

      // ✅ Backend uses POST for /userorders, keep it that way
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        { headers: { token } }
      );

      if (response.data.success && Array.isArray(response.data.orders)) {
        const allOrderItems = [];

        response.data.orders.forEach((order) => {
          if (Array.isArray(order.items)) {
            order.items.forEach((item) => {
              allOrderItems.push({
                ...item,
                status: order.status,
                payment: order.payment,
                paymentMethod: order.paymentMethod,
                date: order.date,
                orderId: order._id,
              });
            });
          }
        });

        setOrderData(allOrderItems.reverse());
      }
    } catch (error) {
      console.error("Error loading user orders:", error);
    }
  };

  useEffect(() => {
    loadOrderData();
    window.scrollTo(0, 0);
  }, [token]);

  return (
    <div className="mt-5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Orders</h2>

        {orderData.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">
            You don’t have any orders yet.
          </p>
        ) : (
          <div className="space-y-3">
            {orderData.map((item, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 p-4 rounded-lg shadow-sm hover:shadow-md transition bg-white"
              >
                {/* LEFT: Product Info */}
                <div className="flex items-start gap-4">
                  <img
                    className="w-20 h-20 object-cover rounded-md border"
                    src={
                      Array.isArray(item.image)
                        ? item.image[0]
                        : item.image || "/placeholder.jpg"
                    }
                    alt={item.name}
                  />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm sm:text-base truncate max-w-[300px]">
                      {item.name}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-[12px] text-gray-500">
                      <p className="font-medium text-gray-800">
                        {currency} {item.price} /-
                      </p>
                      {item.quantity && <p>Qty: {item.quantity}</p>}
                      {item.size && <p>Size: {item.size}</p>}
                    </div>

                    <p className="text-xs sm:text-sm mt-1">
                      Date:{" "}
                      <span className="text-gray-500">
                        {new Date(item.date).toLocaleDateString()}
                      </span>
                    </p>
                    <p className="text-xs sm:text-sm mt-1">
                      Payment:{" "}
                      <span className="text-gray-500">
                        {item.paymentMethod}
                      </span>
                    </p>
                    <p className="text-xs sm:text-sm mt-1">
                      Order ID:{" "}
                      <span className="text-gray-500">{item.orderId}</span>
                    </p>
                  </div>
                </div>

                {/* RIGHT: Status + Track */}
                <div className="flex items-center justify-between md:justify-end md:gap-8 w-full md:w-auto">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        item.status === "Delivered"
                          ? "bg-green-500"
                          : item.status === "Order Placed"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                    ></span>
                    <p className="text-sm md:text-base font-medium text-gray-700">
                      {item.status}
                    </p>
                  </div>
                  <button
                    onClick={loadOrderData}
                    className="border border-gray-200 px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition"
                  >
                    Track Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
