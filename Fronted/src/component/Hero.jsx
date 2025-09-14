// import { assets } from "../assets/frontend_assets/assets";

// const Hero = () => {

//   return (
//     <div className="p-2">
//     <div className="rounded-sm w-full min-h-[40vh] mt-18 pt-7 pb-7 mb-5 lg:min-h-[60vh] lg:mt-20 lg:pt-10 bg-white flex flex-col items-center justify-center px-4">
//       {/* Hero Image Section */}
//       <div className="w-full flex items-center justify-center">
//         <div className="w-40 sm:w-50 md:w-52 lg:w-60 xl:w-60 aspect-square bg-red-400 overflow-hidden rounded-full">
//           <img
//             src={assets.nightmare}
//             alt="Hero"
//             className="object-cover rounded-full scale-128"
//           />
//         </div>
//       </div>

//       {/* Title */}
//       {/* <div className="w-full flex justify-center mt-4">
//         <h1 className="min-[370px]:text-[35px] sm:text-4xl md:text-5xl lg:text-6xl font-poppins font-semibold text-center">
//           FISHING TACKLE STORE
//         </h1>
//       </div> */}

//       <div className="w-full flex justify-center overflow-x-auto mt-2">
//         <h1 className="text-[8vw] sm:text-[7vw] md:text-[5vw] lg:text-[5vw] xl:text-[5vw] font-poppins font-semibold text-center">
//           NIGHTMARE
//         </h1>
//       </div>

//       {/* Description */}
//       <div className="w-full flex justify-center items-center md:pt-2 mt-2">
//         <p className="text-md max-[320px]:text-[10px] sm:text-base md:text-lg px-4 text-center leading-relaxed font-normal max-w-2xl">
//           {/* "Gear up for the catch – premium fishing equipment for every angler." */}
//           Lorem ipsum dolor sit amet onem minus! Accusantium molestiae optio placeat.
//         </p>
//       </div>
//     </div>
//     </div>
//   )
// };

// export default Hero;

// import {assets} from "../assets/frontend_assets/assets";

// const Hero = () => {
//   return (
//     <section className="bg-white mt-20 mb-3">
//       <div className="container mx-auto">
//         <div
//           className={`w-full h-full min-h-48 bg-blue-100 rounded ${
//             !assets.banner && "animate-pulse my-2"
//           } `}
//         >
//           <img
//             src={assets.banner}
//             className="w-full h-full hidden lg:block"
//             alt="banner"
//           />
//           <img
//             src={assets.banner_mobile}
//             className="w-full h-full lg:hidden"
//             alt="banner"
//           />
//         </div>
//       </div>
//     </section>
//   );
// };
// export default Hero;

import { assets } from "../assets/frontend_assets/assets";

const Hero = () => {
  return (
    <section className="mt-20 mb-3 px-2">
      <div className="container mx-auto">
        <div
          className={`w-full rounded overflow-hidden ${
            !assets.banner1 && "animate-pulse my-2"
          }`}
        >
          {assets.banner1 && (
            <img
              src={assets.banner1}
              alt="banner"
              className="w-full h-auto object-contain rounded"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Hero;

