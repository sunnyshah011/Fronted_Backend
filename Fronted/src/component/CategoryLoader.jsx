import React from "react";

const CategoryLoader = () => {
  return (
    <div className="bg-white py-2">
      {/* Header shimmer */}
      <div className="flex justify-between px-3 mb-2">
        <div className="h-5 w-24 bg-gray-200 rounded-md shimmer"></div>
        <div className="h-5 w-16 bg-gray-200 rounded-md shimmer"></div>
      </div>

      {/* Category Grid shimmer */}
      <div className="container mx-auto px-3 grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-2">
            {/* Circle / Image placeholder */}
            <div className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] bg-gray-200 rounded-full shimmer"></div>
            {/* Text placeholder */}
            <div className="h-4 w-12 bg-gray-200 rounded-md shimmer"></div>
          </div>
        ))}
      </div>

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
            0% { left: -150%; }
            100% { left: 150%; }
          }
        `}
      </style>
    </div>
  );
};

export default CategoryLoader;
