import { assets } from "../assets/frontend_assets/assets";

const Hero = () => {
  return (
    <section className="mt-22 mb-3 px-2">
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

