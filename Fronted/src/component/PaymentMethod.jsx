
const PaymentMethod = () => {
  return (
    <div className="bg-white shadow-sm rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
      <div
        onClick={() => setPayment(!payment)}
        className={`flex items-center gap-3 border p-3 rounded-lg cursor-pointer ${
          payment ? "border-green-500 bg-green-50" : "border-gray-200"
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full border ${
            payment ? "bg-green-500 border-green-500" : "border-gray-400"
          }`}
        ></div>
        <span>Cash on Delivery</span>
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={isModified || isLoading}
        className={`mt-4 w-full py-3 rounded-lg text-white ${
          isModified
            ? "bg-gray-400 cursor-not-allowed"
            : isLoading
            ? "bg-gray-700"
            : "bg-black hover:bg-gray-800"
        } flex items-center justify-center gap-2`}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            Processing...
          </>
        ) : isModified ? (
          "Update address first"
        ) : (
          "Place Order"
        )}
      </button>
    </div>
  );
};

export default PaymentMethod;
