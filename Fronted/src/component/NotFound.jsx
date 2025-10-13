import React from "react";

const NotFound = () => {
  return (
    <div className="mt-5 flex flex-col items-center justify-center  p-4">
      <h1 className="text-6xl sm:text-8xl font-bold animate-bounce mb-4">
        😱
      </h1>
      <h2 className="text-4xl sm:text-6xl font-extrabold mb-6 animate-pulse">
        404
      </h2>
      <p className="text-lg sm:text-2xl mb-6 text-center animate-fadeIn">
        Oops! Looks like you got lost in our store 🌪️
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-full shadow-lg hover:bg-yellow-300 transition-all transform hover:scale-110 animate-bounce"
      >
        Go Back Home
      </a>
      <div className="mt-10 flex gap-4 text-3xl animate-spin-slow">
        🛒 🏠 🎉
      </div>

      {/* Extra animations with Tailwind */}
      <style>
        {`
          @keyframes fadeIn {
            0% { opacity: 0; transform: translateY(-20px);}
            100% { opacity: 1; transform: translateY(0);}
          }

          .animate-fadeIn {
            animation: fadeIn 1.5s ease-in-out forwards;
          }

          @keyframes spinSlow {
            from { transform: rotate(0deg);}
            to { transform: rotate(360deg);}
          }

          .animate-spin-slow {
            animation: spinSlow 10s linear infinite;
          }
        `}
      </style>
    </div>
  );
};

export default NotFound;
