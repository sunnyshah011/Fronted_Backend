import { assets } from "../assets/frontend_assets/assets";

const Hero = () => {

  return (
    <div className="w-full min-h-[40vh] mt-20 mb-5 lg:min-h-[70vh] lg:mt-20 flex flex-col items-center justify-center px-4">
      {/* Hero Image Section */}
      <div className="w-full flex items-center justify-center">
        <div className="w-40 sm:w-50 md:w-52 lg:w-60 xl:w-60 aspect-square bg-red-400 overflow-hidden rounded-full">
          <img
            src={assets.nightmare}
            alt="Hero"
            className="object-cover rounded-full scale-128"
          />
        </div>
      </div>

      {/* Title */}
      {/* <div className="w-full flex justify-center mt-4">
        <h1 className="min-[370px]:text-[35px] sm:text-4xl md:text-5xl lg:text-6xl font-poppins font-semibold text-center">
          FISHING TACKLE STORE
        </h1>
      </div> */}

      <div className="w-full flex justify-center overflow-x-auto mt-2">
        <h1 className="text-[8vw] sm:text-[7vw] md:text-[5vw] lg:text-[5vw] xl:text-[5vw] font-poppins font-semibold text-center">
          NIGHTMARE
        </h1>
      </div>

      {/* Description */}
      <div className="w-full flex justify-center items-center md:pt-2 mt-2">
        <p className="text-md max-[320px]:text-[10px] sm:text-base md:text-lg px-4 text-center leading-relaxed font-normal max-w-2xl">
          {/* "Gear up for the catch – premium fishing equipment for every angler." */}
          Lorem ipsum dolor sit amet onem minus! Accusantium molestiae optio placeat.
        </p>
      </div>
    </div>


  )
};

export default Hero;