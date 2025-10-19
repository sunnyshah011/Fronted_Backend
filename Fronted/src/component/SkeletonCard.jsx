import { GiFishingHook } from "react-icons/gi";

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-3 flex flex-col space-y-2 overflow-hidden relative transform transition-transform duration-300 hover:scale-105">
      {/* Image skeleton with fishing gradient */}
      <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-blue-200 via-blue-100 to-gray-200 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 opacity-50 animate-shimmer"></div>
      </div>

      {/* Title skeleton */}
      <div className="h-4 bg-gray-200 rounded w-4/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 opacity-50 animate-shimmer"></div>
      </div>

      {/* Price skeleton */}
      <div className="h-5 bg-gray-300 rounded w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 opacity-50 animate-shimmer"></div>
      </div>

      {/* Small fishing hook icon placeholder */}
      <div className="absolute top-2 right-2 text-red-400 opacity-30">
        <GiFishingHook size={18} />
      </div>

      {/* Shimmer keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite linear;
        }
      `}</style>
    </div>
  );
};

export default SkeletonCard;
