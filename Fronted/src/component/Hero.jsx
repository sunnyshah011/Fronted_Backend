import { useState, useEffect, useRef } from "react";
import { assets } from "../assets/frontend_assets/assets";

const banners = [ assets.banner2]; // Add all your banners here

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);
  const total = banners.length;
  const carouselRef = useRef(null);

  const startX = useRef(0);
  const isDragging = useRef(false);

  // Auto-slide every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 3000);
    return () => clearInterval(interval);
  }, [total]);

  const handlePrev = () => setCurrent((prev) => (prev - 1 + total) % total);
  const handleNext = () => setCurrent((prev) => (prev + 1) % total);

  // Touch & Mouse handlers
  const handleStart = (x) => {
    startX.current = x;
    isDragging.current = true;
  };

  const handleMove = (x) => {
    if (!isDragging.current) return;
    const delta = startX.current - x;
    if (delta > 50) {
      handleNext();
      isDragging.current = false;
    } else if (delta < -50) {
      handlePrev();
      isDragging.current = false;
    }
  };

  const handleEnd = () => {
    isDragging.current = false;
  };

  if (!banners.length) return null;

  return (
    <section className="mt-22 mb-3 px-2">
      <div
        className="container mx-auto relative overflow-hidden rounded"
        ref={carouselRef}
        onTouchStart={(e) => handleStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        onTouchEnd={handleEnd}
        onMouseDown={(e) => handleStart(e.clientX)}
        onMouseMove={(e) => handleMove(e.clientX)}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
      >
        {/* Banners */}
        {banners.map((banner, index) => (
          <img
            key={index}
            src={banner}
            alt={`banner-${index}`}
            className={`w-full h-auto object-contain sm:rounded-2xl rounded-[8px] transition-opacity duration-700 ${
              index === current
                ? "opacity-100"
                : "opacity-0 absolute top-0 left-0"
            }`}
          />
        ))}

        {/* Dots */}
        {/* <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
          {banners.map((_, idx) => (
            <span
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`w-3 h-3 rounded-full cursor-pointer transition ${
                idx === current ? "bg-white" : "bg-gray-400"
              }`}
            ></span>
          ))}
        </div> */}
      </div>
    </section>
  );
};

export default HeroCarousel;
