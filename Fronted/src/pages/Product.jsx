// import { useEffect, useState, useContext } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { ShopContext } from "../Context/ShopContext";
// import { toast } from "react-toastify";
// import "react-medium-image-zoom/dist/styles.css";
// import FishingLoader from "../component/FishingLoader";
// import { useQuery } from "@tanstack/react-query";
// import { Fancybox } from "@fancyapps/ui";
// import "@fancyapps/ui/dist/fancybox/fancybox.css";


// const fetchProduct = async (backendUrl, categorySlug, productSlug) => {
//   const { data } = await axios.get(
//     `${backendUrl}/api/categories/${categorySlug}/${productSlug}`
//   );
//   if (!data.success) throw new Error("Product not found");
//   return data.product;
// };

// const Product = () => {
//   const { backendUrl, currency, addtocart, cartitem, token } = useContext(ShopContext);
//   const { categorySlug, productSlug } = useParams();
//   const [selectedSize, setSelectedSize] = useState("");
//   const [selectedColor, setSelectedColor] = useState("");
//   const [mainImage, setMainImage] = useState("");
//   const [quantity, setQuantity] = useState(1);
//   const [isAdding, setIsAdding] = useState(false);

//   const {
//     data: fproduct,
//     isLoading,
//     isError,
//     error,
//   } = useQuery({
//     queryKey: ["product", categorySlug, productSlug],
//     queryFn: async () => {
//       const { data } = await axios.get(
//         `${backendUrl}/api/categories/${categorySlug}/${productSlug}`
//       );
//       if (!data.success) throw new Error("Product not found");
//       return data.product;
//     },
//     enabled: !!backendUrl && !!categorySlug && !!productSlug,
//     staleTime: 1000 * 60 * 5,
//     cacheTime: 1000 * 60 * 30,
//     refetchOnWindowFocus: false,
//   });

//   // ✅ Handle default image, size, and color after query returns
//   useEffect(() => {
//     if (!fproduct) return;

//     setMainImage(fproduct.images?.[0] || "/placeholder.png");

//     const sizes = [...new Set(fproduct.variants.map((v) => v.size))];
//     const colors = [...new Set(fproduct.variants.map((v) => v.color))];

//     if (sizes.length === 1) setSelectedSize(sizes[0]);
//     if (colors.length === 1) setSelectedColor(colors[0]);
//   }, [fproduct]);

//   const allSizes = fproduct
//     ? [...new Set(fproduct.variants.map((v) => v.size))]
//     : [];
//   const allColors = fproduct
//     ? [...new Set(fproduct.variants.map((v) => v.color))]
//     : [];

//   const selectedVariant =
//     selectedSize && selectedColor
//       ? fproduct?.variants.find(
//         (v) => v.size === selectedSize && v.color === selectedColor
//       )
//       : null;

//   const priceVariant = selectedVariant || fproduct?.variants?.[0];
//   const displayPrice = priceVariant?.price || 0;

//   const inCartQty =
//     cartitem?.[fproduct?._id]?.[selectedSize]?.[selectedColor] || 0;

//   const isVariantSelected = selectedSize && selectedColor;
//   const isOutOfStock = selectedVariant && selectedVariant.stock <= 0;
//   const isMaxInCart =
//     isVariantSelected && inCartQty >= (selectedVariant?.stock || 0);

//   const increment = () => {
//     if (quantity + inCartQty < (selectedVariant?.stock || 1)) {
//       setQuantity((q) => q + 1);
//     }
//   };

//   const decrement = () => {
//     if (quantity > 1) {
//       setQuantity((q) => q - 1);
//     }
//   };

//   // Check if any variant has stock
//   const anyStockAvailable = fproduct?.variants.some((v) => v.stock > 0);

//   // ✅ Reset quantity when variant changes
//   useEffect(() => {
//     if (!selectedVariant) return;
//     setQuantity(selectedVariant.stock > 0 ? 1 : 0);
//   }, [selectedVariant]);

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   useEffect(() => {
//     Fancybox.bind("[data-fancybox='gallery']", {
//       Toolbar: false,
//       Thumbs: {
//         autoStart: true,
//       },
//       zoom: true,
//       animated: true,
//       dragToClose: true,
//     });

//     return () => {
//       Fancybox.destroy();
//     };
//   }, [fproduct, mainImage]);


//   return (
//     <div className="max-w-[1250px] mt-3 pt-4 px-4 bg-white">
//       {isLoading && <FishingLoader />}
//       {isError && (
//         <p className="text-center py-5 text-red-500">
//           Failed to load product: {error.message}
//         </p>
//       )}
//       {!isLoading && !isError && !fproduct && (
//         <p className="text-center py-5 text-gray-500">Product not found</p>
//       )}
//       {fproduct && (
//         <div className="grid grid-cols-1 md:grid-cols-2">
//           {/* LEFT IMAGES */}
//           <div className="w-full flex flex-col items-center">
//             <div
//               className="w-full max-w-[500px] aspect-square bg-white overflow-hidden rounded-xl mb-2 flex items-center justify-center shadow"
//             >
//               <a
//                 data-fancybox="gallery"
//                 href={mainImage || "/placeholder.png"}
//               // data-caption={fproduct.name}
//               >
//                 <img
//                   src={mainImage || "/placeholder.png"}
//                   alt={fproduct.name}
//                   className="max-w-full max-h-full object-contain cursor-zoom-in"
//                 />
//               </a>
//             </div>

//             {/* // Thumbnail Images */}
//             {fproduct.images?.length > 1 && (
//               <div className="flex gap-3 flex-wrap justify-center">
//                 {fproduct.images.map((img) => (
//                   <div
//                     key={img}
//                     onClick={() => setMainImage(img)}
//                     className={`w-15 h-15 rounded-lg overflow-hidden cursor-pointer border transition transform hover:scale-105 ${mainImage === img
//                       ? "border-black ring-2 ring-black"
//                       : "border-gray-300"
//                       }`}
//                   >
//                     <img
//                       src={img}
//                       alt="Thumbnail"
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>


//           {/* RIGHT INFO */}
//           <div className="flex flex-col pr-5">
//             <h1 className="text-[13px] md:text-[20px] font-bold mb-2 mt-4">
//               {fproduct.name}
//             </h1>
//             <p className="text-2xl font-bold mb-4">
//               {currency} {displayPrice} /-
//             </p>
//             SIZE SELECT
//             <div className="mb-6">
//               <p className="font-medium mb-2">Available Sizes</p>
//               <div className="flex gap-2 flex-wrap">
//                 {allSizes.map((size) => {
//                   const sizeHasStock = fproduct.variants.some(
//                     (v) => v.size === size && v.stock > 0
//                   );
//                   return (
//                     <div key={size} className="flex flex-col items-center">
//                       <button
//                         onClick={() => setSelectedSize(size)}
//                         className={`px-4 py-2 border rounded-lg transition ${selectedSize === size
//                           ? "bg-black text-white"
//                           : sizeHasStock
//                             ? "bg-white hover:bg-gray-100"
//                             : "bg-gray-200 text-gray-500 cursor-not-allowed"
//                           }`}
//                         disabled={!sizeHasStock}
//                       >
//                         {size}
//                       </button>
//                       {!sizeHasStock && (
//                         <p className="text-xs text-red-500 mt-1">
//                           Out of stock
//                         </p>
//                       )}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//             {/* COLOR SELECT */}
//             <div className="mb-6">
//               <p className="font-medium mb-2">Available Colors</p>
//               <div className="flex gap-2 flex-wrap">
//                 {allColors.map((color) => {
//                   const colorHasStock = fproduct.variants.some(
//                     (v) =>
//                       v.color === color &&
//                       (!selectedSize || v.size === selectedSize) &&
//                       v.stock > 0
//                   );
//                   return (
//                     <div key={color} className="flex flex-col items-center">
//                       <button
//                         onClick={() => setSelectedColor(color)}
//                         className={`px-4 py-2 border rounded-lg transition ${selectedColor === color
//                           ? "bg-black text-white"
//                           : colorHasStock
//                             ? "bg-white hover:bg-gray-100"
//                             : "bg-gray-200 text-gray-500 cursor-not-allowed"
//                           }`}
//                         disabled={!colorHasStock}
//                       >
//                         {color}
//                       </button>
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//             {/* STOCK INFO */}
//             {isVariantSelected && (
//               <p className="mb-2 text-sm text-gray-600">
//                 Stock Available: {selectedVariant?.stock || 0}
//               </p>
//             )}
//             {/* QUANTITY */}
//             {isVariantSelected && !isOutOfStock && (
//               <div className="mb-6 flex items-center gap-3 mt-2">
//                 <button
//                   onClick={decrement}
//                   className="px-3 py-1 bg-gray-200 rounded"
//                   disabled={quantity <= 1}
//                 >
//                   -
//                 </button>
//                 <span className="font-medium">{quantity}</span>
//                 <button
//                   onClick={increment}
//                   className="px-3 py-1 bg-gray-200 rounded"
//                   disabled={quantity + inCartQty >= selectedVariant?.stock}
//                 >
//                   +
//                 </button>
//               </div>
//             )}
//             {/* // Replace your Add to Cart button with this: */}
//             <button
//               onClick={async () => {

//                 // 1️⃣ Check login first
//                 if (!token) {
//                   await addtocart(
//                     fproduct._id,
//                     selectedVariant?.size,
//                     selectedVariant?.color,
//                     quantity
//                   );
//                   return; // prevent further execution
//                 }

//                 if (!isVariantSelected) {
//                   toast.error("Please select size and color");
//                   return;
//                 }
//                 if (isOutOfStock) {
//                   toast.error("This variant is out of stock");
//                   return;
//                 }
//                 if (inCartQty + quantity > selectedVariant?.stock) {
//                   toast.error(
//                     `Cannot add more than ${selectedVariant.stock} items`
//                   );
//                   return;
//                 }

//                 setIsAdding(true); // 🔹 prevent multiple clicks
//                 await addtocart(
//                   fproduct._id,
//                   selectedVariant.size,
//                   selectedVariant.color,
//                   quantity
//                 );
//                 setQuantity(1);
//                 setIsAdding(false); // 🔹 re-enable button
//               }}
//               disabled={
//                 !anyStockAvailable ||
//                 isOutOfStock ||
//                 isMaxInCart ||
//                 // !isVariantSelected ||
//                 isAdding
//               }
//               className={`px-6 w-50 py-3 rounded-lg mb-4 transition ${!anyStockAvailable || isOutOfStock || isMaxInCart || isAdding
//                 ? "bg-gray-400 cursor-not-allowed"
//                 : "bg-black text-white hover:bg-gray-800"
//                 }`}
//             >
//               {isAdding
//                 ? "Adding..."
//                 : !anyStockAvailable || isOutOfStock
//                   ? "Out of Stock"
//                   : isMaxInCart
//                     ? "Added to Cart"
//                     : "Add to Cart"}
//             </button>
//             <p className="mb-6 text-gray-700">{fproduct.description}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Product;


import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../Context/ShopContext";
import { toast } from "react-toastify";
import "react-medium-image-zoom/dist/styles.css";
import FishingLoader from "../component/FishingLoader";
import { useQuery } from "@tanstack/react-query";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";



const fetchProduct = async (backendUrl, categorySlug, productSlug) => {
  const { data } = await axios.get(
    `${backendUrl}/api/categories/${categorySlug}/${productSlug}`
  );
  if (!data.success) throw new Error("Product not found");
  return data.product;
};

const Product = () => {
  const { backendUrl, currency, addtocart, cartitem, token } = useContext(ShopContext);
  const { categorySlug, productSlug } = useParams();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const [thumbsSwiper, setThumbsSwiper] = useState(null);


  const {
    data: fproduct,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["product", categorySlug, productSlug],
    queryFn: async () => {
      const { data } = await axios.get(
        `${backendUrl}/api/categories/${categorySlug}/${productSlug}`
      );
      if (!data.success) throw new Error("Product not found");
      return data.product;
    },
    enabled: !!backendUrl && !!categorySlug && !!productSlug,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  });

  // ✅ Handle default image, size, and color after query returns
  useEffect(() => {
    if (!fproduct) return;

    setMainImage(fproduct.images?.[0] || "/placeholder.png");

    const sizes = [...new Set(fproduct.variants.map((v) => v.size))];
    const colors = [...new Set(fproduct.variants.map((v) => v.color))];

    if (sizes.length === 1) setSelectedSize(sizes[0]);
    if (colors.length === 1) setSelectedColor(colors[0]);
  }, [fproduct]);

  const allSizes = fproduct
    ? [...new Set(fproduct.variants.map((v) => v.size))]
    : [];
  const allColors = fproduct
    ? [...new Set(fproduct.variants.map((v) => v.color))]
    : [];

  const selectedVariant =
    selectedSize && selectedColor
      ? fproduct?.variants.find(
        (v) => v.size === selectedSize && v.color === selectedColor
      )
      : null;

  const priceVariant = selectedVariant || fproduct?.variants?.[0];
  const displayPrice = priceVariant?.price || 0;

  const inCartQty =
    cartitem?.[fproduct?._id]?.[selectedSize]?.[selectedColor] || 0;

  const isVariantSelected = selectedSize && selectedColor;
  const isOutOfStock = selectedVariant && selectedVariant.stock <= 0;
  const isMaxInCart =
    isVariantSelected && inCartQty >= (selectedVariant?.stock || 0);

  const increment = () => {
    if (quantity + inCartQty < (selectedVariant?.stock || 1)) {
      setQuantity((q) => q + 1);
    }
  };

  const decrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  // Check if any variant has stock
  const anyStockAvailable = fproduct?.variants.some((v) => v.stock > 0);

  // ✅ Reset quantity when variant changes
  useEffect(() => {
    if (!selectedVariant) return;
    setQuantity(selectedVariant.stock > 0 ? 1 : 0);
  }, [selectedVariant]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    Fancybox.bind("[data-fancybox='gallery']", {
      Toolbar: false,
      Thumbs: {
        autoStart: true,
      },
      zoom: true,
      animated: true,
      dragToClose: true,
    });

    return () => {
      Fancybox.destroy();
    };
  }, [fproduct, mainImage]);


  return (
    <div className="max-w-[1250px] mt-3 pt-4 px-4 bg-white">
      {isLoading && <FishingLoader />}
      {isError && (
        <p className="text-center py-5 text-red-500">
          Failed to load product: {error.message}
        </p>
      )}
      {!isLoading && !isError && !fproduct && (
        <p className="text-center py-5 text-gray-500">Product not found</p>
      )}
      {fproduct && (
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* LEFT IMAGES */}
          <div className="w-full flex flex-col items-center">
            <Swiper
              modules={[Navigation, Thumbs]}
              thumbs={{ swiper: thumbsSwiper }}
              // navigation
              spaceBetween={10}
              className="w-full max-w-[470px] aspect-square rounded-xl overflow-hidden mb-3 flex items-center justify-center shadow"
            >
              {fproduct.images?.map((img) => (
                <SwiperSlide key={img}>
                  <a data-fancybox="gallery" href={img}>
                    <img
                      src={img}
                      alt={fproduct.name}
                      className="w-full h-full object-contain rounded-xl cursor-zoom-in"
                    />
                  </a>
                </SwiperSlide>
              ))}
            </Swiper>

            {fproduct.images?.length > 1 && (
              <div className="w-full max-w-[470px] flex justify-center">
                <Swiper
                  onSwiper={setThumbsSwiper}
                  modules={[Navigation, Thumbs]}
                  spaceBetween={10}
                  slidesPerView={"auto"}
                  freeMode
                  watchSlidesProgress
                  className="w-auto!"
                >
                  {fproduct.images.map((img) => (
                    <SwiperSlide key={img} className="w-auto! cursor-pointer">
                      <img
                        src={img}
                        alt="thumbnail"
                        className="w-17 h-17 sm:w-20 sm:h-20 object-cover rounded border border-gray-200 transition-all"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            )}
          </div>


          {/* RIGHT INFO */}
          <div className="flex flex-col sm:pr-5">
            <h1 className="text-[19px] md:text-[20px] font-medium mb-3 mt-4">
              {fproduct.name}
            </h1>
            <p className="text-[26px] font-medium mb-4">
              {currency} {displayPrice} /-
            </p>
           <p className="mb-2 bg-gray-200 w-fit px-3 rounded"> SIZE SELECT</p>
            <div className="mb-2 mt-1">
              <p className="font-medium mb-1 pl-3">Available Sizes</p>
              <div className="flex gap-2 flex-wrap">
                {allSizes.map((size) => {
                  const sizeHasStock = fproduct.variants.some(
                    (v) => v.size === size && v.stock > 0
                  );
                  return (
                    <div key={size} className="flex flex-col items-center max-[500px]:text-[12.5px]">
                      <button
                        onClick={() => setSelectedSize(size)}
                        className={`sm:px-4 px-3 py-2 border rounded-lg transition ${selectedSize === size
                          ? "bg-black text-white"
                          : sizeHasStock
                            ? "bg-white hover:bg-gray-100"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                          }`}
                        disabled={!sizeHasStock}
                      >
                        {size}
                      </button>
                      {!sizeHasStock && (
                        <p className="text-xs text-red-500 mt-1">
                          Out of stock
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* COLOR SELECT */}
            <div className="mb-4 mt-1">
              <p className="font-medium mb-1 pl-3">Available Colors</p>
              <div className="flex gap-2 flex-wrap">
                {allColors.map((color) => {
                  const colorHasStock = fproduct.variants.some(
                    (v) =>
                      v.color === color &&
                      (!selectedSize || v.size === selectedSize) &&
                      v.stock > 0
                  );
                  return (
                    <div key={color} className="flex flex-col items-center max-[500px]:text-[12.5px]">
                      <button
                        onClick={() => setSelectedColor(color)}
                        className={`sm:px-4 px-3 py-2 border rounded-lg transition ${selectedColor === color
                          ? "bg-black text-white"
                          : colorHasStock
                            ? "bg-white hover:bg-gray-100"
                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                          }`}
                        disabled={!colorHasStock}
                      >
                        {color}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* STOCK INFO */}
            {isVariantSelected && (
              <p className="mb-2 pl-2 text-sm text-gray-600">
                Stock Available: {selectedVariant?.stock || 0}
              </p>
            )}
            {/* QUANTITY */}
            {isVariantSelected && !isOutOfStock && (
              <div className="mb-6 pl-2 flex items-center gap-3 mt-2">
                <button
                  onClick={decrement}
                  className="px-3 py-1 bg-gray-200 rounded"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="font-medium">{quantity}</span>
                <button
                  onClick={increment}
                  className="px-3 py-1 bg-gray-200 rounded"
                  disabled={quantity + inCartQty >= selectedVariant?.stock}
                >
                  +
                </button>
              </div>
            )}
            {/* // Replace your Add to Cart button with this: */}
            <button
              onClick={async () => {

                // 1️⃣ Check login first
                if (!token) {
                  await addtocart(
                    fproduct._id,
                    selectedVariant?.size,
                    selectedVariant?.color,
                    quantity
                  );
                  return; // prevent further execution
                }

                if (!isVariantSelected) {
                  toast.error("Please select size and color");
                  return;
                }
                if (isOutOfStock) {
                  toast.error("This variant is out of stock");
                  return;
                }
                if (inCartQty + quantity > selectedVariant?.stock) {
                  toast.error(
                    `Cannot add more than ${selectedVariant.stock} items`
                  );
                  return;
                }

                setIsAdding(true); // 🔹 prevent multiple clicks
                await addtocart(
                  fproduct._id,
                  selectedVariant.size,
                  selectedVariant.color,
                  quantity
                );
                setQuantity(1);
                setIsAdding(false); // 🔹 re-enable button
              }}
              disabled={
                !anyStockAvailable ||
                isOutOfStock ||
                isMaxInCart ||
                // !isVariantSelected ||
                isAdding
              }
              className={`px-6 w-50 py-3 text-[20px] rounded-lg mb-4 transition ${!anyStockAvailable || isOutOfStock || isMaxInCart || isAdding
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
                }`}
            >
              {isAdding
                ? "Adding..."
                : !anyStockAvailable || isOutOfStock
                  ? "Out of Stock"
                  : isMaxInCart
                    ? "Added to Cart"
                    : "Add to Cart"}
            </button>
            <p className="mb-6 text-gray-700">{fproduct.description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;