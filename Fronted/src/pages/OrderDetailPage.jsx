// import { useEffect, useState, useContext } from "react";
// import { useParams } from "react-router-dom";
// import { ShopContext } from "../Context/ShopContext";
// import axios from "axios";
// import { toast } from "react-toastify";

// const OrderDetails = () => {
//   const { orderId } = useParams();
//   const { backendUrl, token, currency } = useContext(ShopContext);
//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(false);

//   console.log(orderId);
  

//   // ✅ Updated fetch function to get a single order
//   const fetchOrderDetails = async () => {
//     if (!token) return;
//     setLoading(true);
//     try {
//       const res = await axios.get(`${backendUrl}/api/order/${orderId}`, {
//         headers: { token },
//       });

//       if (res.data.success && res.data.order) {
//         const o = res.data.order;
//         const formattedOrder = {
//           ...o,
//           items: o.items.map((item) => ({
//             ...item,
//             productName: item.productId?.name || "Unknown Product",
//             productImage: item.productId?.images?.[0] || "/placeholder.jpg",
//           })),
//         };
//         setOrder(formattedOrder);
//       } else {
//         setOrder(null);
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to load order details");
//       setOrder(null);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrderDetails();
//   }, [orderId, token]);

//   if (loading) return <p>Loading order details...</p>;
//   if (!order) return <p>Order not found.</p>;

//   const subtotal = order.items.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4">Order #{order.orderId}</h1>
//       <p className="mb-2">Payment Method: {order.paymentMethod}</p>
//       <p className="mb-2">Status: {order.orderStatus}</p>
//       <p className="mb-4">Date: {new Date(order.createdAt).toLocaleString()}</p>

//       <h2 className="text-xl font-semibold mb-2">Products</h2>
//       <div className="space-y-3">
//         {order.items.map((item, i) => (
//           <div key={i} className="flex items-start gap-4 border-b pb-2">
//             <img
//               src={item.productImage}
//               alt={item.productName}
//               className="w-20 h-20 object-cover rounded-md"
//             />
//             <div>
//               <p className="font-semibold">{item.productName}</p>
//               <p>
//                 {currency} {item.price} × {item.quantity}
//               </p>
//               {item.size && <p>Size: {item.size}</p>}
//               {item.color && <p>Color: {item.color}</p>}
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="text-right mt-4">
//         <p>
//           Subtotal: {currency} {subtotal.toFixed(2)}
//         </p>
//         <p>
//           Total: {currency} {order.amount.toFixed(2)}
//         </p>
//       </div>

//       {order.paymentProof && (
//         <div className="mt-4">
//           <p className="font-semibold mb-1">Payment Proof:</p>
//           <img
//             src={order.paymentProof}
//             alt="Payment Proof"
//             className="w-40 h-40 object-cover rounded-md border"
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default OrderDetails;
