const FishingLoader = () => {
  return (
    <div className="flex flex-col md:flex-row gap-8 items-center justify-center h-[70vh] p-6 animate-fade-in">
      {/* Left Side — Image Placeholder */}
      <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px] bg-gray-200 rounded-2xl relative overflow-hidden shimmer" />

      {/* Right Side — Text / Details Placeholder */}
      <div className="flex flex-col gap-4 w-[90%] md:w-[400px]">
        <div className="h-6 bg-gray-200 rounded-md shimmer w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded-md shimmer w-1/2"></div>

        <div className="h-8 bg-gray-200 rounded-md shimmer w-1/3 mt-3"></div>

        <div className="flex gap-3 mt-4">
          <div className="h-8 w-16 bg-gray-200 rounded-md shimmer"></div>
          <div className="h-8 w-16 bg-gray-200 rounded-md shimmer"></div>
          <div className="h-8 w-16 bg-gray-200 rounded-md shimmer"></div>
        </div>

        <div className="h-10 bg-gray-200 rounded-lg shimmer w-2/3 mt-6"></div>
        <div className="h-5 bg-gray-200 rounded-md shimmer w-full mt-2"></div>
        <div className="h-5 bg-gray-200 rounded-md shimmer w-5/6"></div>
      </div>

      {/* Styles */}
      <style>
        {`
          .shimmer {
            position: relative;
            overflow: hidden;
          }
          .shimmer::before {
            content: '';
            position: absolute;
            top: 0;
            left: -150%;
            width: 150%;
            height: 100%;
            background: linear-gradient(
              120deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(255, 255, 255, 0.5) 50%,
              rgba(255, 255, 255, 0) 100%
            );
            animation: shimmerMove 1.5s infinite;
          }
          @keyframes shimmerMove {
            0% {
              left: -150%;
            }
            100% {
              left: 150%;
            }
          }
          @keyframes fade-in {
            from { opacity: 0; transform: scale(0.98); }
            to { opacity: 1; transform: scale(1); }
          }
          .animate-fade-in {
            animation: fade-in 0.5s ease-in-out;
          }
        `}
      </style>
    </div>
  );
};

export default FishingLoader;
