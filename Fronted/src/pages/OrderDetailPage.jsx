import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const OrderDetails = () => {
    const { orderId } = useParams();
    const { backendUrl, token, currency } = useContext(ShopContext);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const fetchOrderDetails = async () => {
        if (!token) return;
        setLoading(true);
        try {
            const res = await axios.post(`${backendUrl}/api/order/${orderId}`, {}, {
                headers: { token },
            });

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
        if (!selectedFile) return toast.error("Please select a file first");
        setUploading(true);

        const formData = new FormData();
        formData.append("paymentProof", selectedFile);

        try {
            const res = await axios.post(
                `${backendUrl}/api/order/${orderId}/upload-proof`,
                formData,
                {
                    headers: {
                        token,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (res.data.success) {
                toast.success("Payment proof uploaded successfully");
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

    if (loading) return <p className="text-center p-6">Loading order details...</p>;
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
                    <h1 className="text-xl md:text-2xl font-bold">Order #{order.orderId}</h1>
                    <p className="text-gray-600 mt-1 text-sm md:text-base">Placed on {new Date(order.createdAt).toLocaleString()}</p>
                    <p className="mt-1 text-sm md:text-base">
                        Payment Method: <span className="font-medium">{order.paymentMethod}</span>
                    </p>
                </div>
                <div>
                    <span className={`px-3 py-1 md:px-4 md:py-1.5 rounded-full font-semibold text-sm md:text-base ${statusColor[order.orderStatus] || "bg-gray-200 text-gray-800"}`}>
                        {order.orderStatus}
                    </span>
                </div>
            </div>

            {/* Products Section */}
            <div className="bg-white shadow rounded-xl p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold mb-3">Products</h2>
                <div className="space-y-3">
                    {order.items.map((item, i) => (
                        <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 border-b pb-3 last:border-b-0">
                            <img
                                src={item.productImage}
                                alt={item.productName}
                                className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md border"
                            />
                            <div className="flex-1">
                                <p className="font-semibold text-sm md:text-base">{item.productName}</p>
                                <p className="text-gray-600 text-sm md:text-base">{currency} {item.price} × {item.quantity}</p>
                                {item.size && <p className="text-gray-500 text-sm md:text-base">Size: {item.size}</p>}
                                {item.color && <p className="text-gray-500 text-sm md:text-base">Color: {item.color}</p>}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Totals */}
                <div className="text-right mt-3 md:mt-4 space-y-1">
                    <p className="font-medium text-sm md:text-base">Subtotal: {currency} {subtotal.toFixed(2)}</p>
                    <p className="font-bold text-base md:text-lg">Total: {currency} {order.amount.toFixed(2)}</p>
                </div>
            </div>

            {/* Payment Proof Section */}
            <div className="bg-white shadow rounded-xl p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold mb-2">Payment Proof</h2>
                {order.paymentProof ? (
                    <img
                        src={order.paymentProof}
                        alt="Payment Proof"
                        className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 object-cover rounded-md border"
                    />
                ) : (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
                        {/* Payment Proof Preview */}
                        {order.paymentProof && (
                            <img
                                src={order.paymentProof}
                                alt="Payment Proof"
                                className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-md border shrink-0"
                            />
                        )}

                        {/* File Input + Button */}
                        <div className="flex flex-1 flex-col sm:flex-row gap-2 sm:gap-3 w-full">
                            <input
                                type="file"
                                onChange={handleFileChange}
                                className="flex-1 min-w-0 border rounded p-2 text-sm sm:text-base w-full sm:w-auto"
                            />
                            <button
                                onClick={handleUpload}
                                className="shrink-0 px-4 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto"
                                disabled={uploading}
                            >
                                {uploading ? "Uploading..." : "Upload Proof"}
                            </button>
                        </div>
                    </div>

                )}
                {order.paymentStatus && (
                    <p className="mt-2 text-gray-600 text-sm md:text-base">
                        Payment Status: <span className="font-medium">{order.paymentStatus}</span>
                    </p>
                )}
            </div>
        </div>
    );
};

export default OrderDetails;
