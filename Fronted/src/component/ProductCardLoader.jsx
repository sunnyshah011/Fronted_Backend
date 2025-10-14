import React from "react";

const ProductCardLoader = () => {
    return (
        <div className="text-gray-700 cursor-pointer rounded bg-white block shadow-sm hover:shadow-md transition">
            {/* Image shimmer */}
            <div className="w-full aspect-square overflow-hidden rounded bg-gray-200 shimmer"></div>

            {/* Product name shimmer */}
            <div className="pt-5 pb-1 pl-2">
                <div className="h-4 w-3/4 bg-gray-200 rounded-md shimmer"></div>
            </div>

            {/* Price shimmer */}
            <div className="pl-2 mt-2 pb-3">
                <div className="h-5 w-1/2 bg-gray-200 rounded-md shimmer"></div>
            </div>

            {/* Shimmer animation */}
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

export default ProductCardLoader;
