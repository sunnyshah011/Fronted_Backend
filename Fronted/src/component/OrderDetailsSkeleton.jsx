const OrderDetailsSkeleton = () => {
  return (
    <div className="max-w-4xl mx-auto px-3 py-4 space-y-4 animate-pulse">

      {/* Header */}
      <div className="bg-white shadow rounded-xl p-4 md:p-6">
        <div className="h-6 w-40 bg-gray-300 rounded mb-3"></div>
        <div className="h-4 w-60 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-48 bg-gray-200 rounded"></div>
      </div>

      {/* Products */}
      <div className="bg-white shadow rounded-xl p-4 md:p-6">
        <div className="h-5 w-28 bg-gray-300 rounded mb-4"></div>

        {[1, 2, 3].map((x) => (
          <div key={x} className="flex items-center gap-4 border-b pb-3 mb-3">
            <div className="w-20 h-20 bg-gray-300 rounded-md"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 w-40 bg-gray-200 rounded"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
              <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}

        <div className="space-y-2 mt-2">
          <div className="h-4 w-24 bg-gray-300 rounded ml-auto"></div>
          <div className="h-4 w-28 bg-gray-300 rounded ml-auto"></div>
          <div className="h-5 w-32 bg-gray-400 rounded ml-auto"></div>
        </div>
      </div>

      {/* Payment Proof */}
      <div className="bg-white shadow rounded-xl p-4 md:p-6">
        <div className="h-5 w-36 bg-gray-300 rounded mb-4"></div>

        <div className="flex items-center gap-4">
          <div className="w-32 h-32 bg-gray-300 rounded-md"></div>

          <div className="flex flex-col gap-2 w-full">
            <div className="h-10 w-full bg-gray-200 rounded"></div>
            <div className="h-10 w-32 bg-gray-300 rounded"></div>
            <div className="h-10 w-32 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="bg-white shadow rounded-xl p-4 md:p-6">
        <div className="h-10 w-32 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
};

export default OrderDetailsSkeleton