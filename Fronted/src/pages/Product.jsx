// import { useEffect, useState, useContext } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { ShopContext } from "../Context/ShopContext";
// import { toast } from "react-toastify";
// import Zoom from "react-medium-image-zoom";
// import "react-medium-image-zoom/dist/styles.css";

// const Product = () => {
//   const { backendUrl, currency, addtocart } = useContext(ShopContext);
//   const { categorySlug, productSlug } = useParams(); // updated

//   const [fproduct, setFProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedSize, setSelectedSize] = useState("");
//   const [selectedColor, setSelectedColor] = useState("");
//   const [mainImage, setMainImage] = useState("");
//   const [quantity, setQuantity] = useState(1);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       if (!productSlug) return;
//       try {
//         setLoading(true);
//         const { data } = await axios.get(
//           `${backendUrl}/api/categories/${categorySlug}/${productSlug}`
//         );
//         if (data.success) {
//           setFProduct(data.product);
//           setMainImage(data.product.images?.[0] || "/placeholder.png");

//           const sizes = [...new Set(data.product.variants.map((v) => v.size))];
//           const colors = [
//             ...new Set(data.product.variants.map((v) => v.color)),
//           ];

//           if (sizes.length === 1) setSelectedSize(sizes[0]);
//           if (colors.length === 1) setSelectedColor(colors[0]);
//         } else {
//           toast.error("Product not found");
//         }
//       } catch (error) {
//         console.error(error);
//         toast.error("Failed to load product");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [backendUrl, categorySlug, productSlug]);

//   // ✅ Keep all your logic/styles as is (no changes below)
//   const allSizes = fproduct
//     ? [...new Set(fproduct.variants.map((v) => v.size))]
//     : [];
//   const allColors = fproduct
//     ? [...new Set(fproduct.variants.map((v) => v.color))]
//     : [];

//   const availableColors = selectedSize
//     ? fproduct.variants
//         .filter((v) => v.size === selectedSize && v.stock > 0)
//         .map((v) => v.color)
//     : allColors;

//   const availableSizes = selectedColor
//     ? fproduct.variants
//         .filter((v) => v.color === selectedColor && v.stock > 0)
//         .map((v) => v.size)
//     : allSizes;

//   const priceVariant = selectedSize
//     ? fproduct?.variants.find((v) => v.size === selectedSize)
//     : fproduct?.variants?.[0];

//   const displayPrice = priceVariant?.price || 0;

//   const selectedVariant =
//     selectedSize && selectedColor
//       ? fproduct?.variants.find(
//           (v) => v.size === selectedSize && v.color === selectedColor
//         )
//       : null;

//   const variantToUse = selectedVariant || priceVariant;

//   useEffect(() => {
//     if (!variantToUse) return;
//     setQuantity(variantToUse.stock > 0 ? 1 : 0);
//   }, [variantToUse]);

//   const increment = () => {
//     if (quantity < (variantToUse?.stock || 1)) setQuantity((q) => q + 1);
//   };

//   const decrement = () => {
//     if (quantity > 1) setQuantity((q) => q - 1);
//   };

//   return (
//     <div className="max-w-[1250px] mt-3 pt-4 px-4 bg-white">
//       {loading && <p>Loading...</p>}
//       {!loading && !fproduct && <p>Product not found</p>}
//       {!loading && fproduct && (
//         <div className="grid grid-cols-1 md:grid-cols-2">
//           {/* LEFT: Images
//           <div>
//             <div>
//               <div className="w-full aspect-square overflow-hidden rounded-xl bg-white mb-4 flex items-center justify-center">
//                 <img
//                   src={mainImage}
//                   alt={fproduct.name}
//                   className="max-w-full max-h-full object-contain"
//                 />
//               </div>
//             </div>

//             {fproduct.images?.length > 1 && (
//               <div className="flex gap-3 flex-wrap">
//                 {fproduct.images.map((img, idx) => (
//                   <div
//                     key={idx}
//                     onClick={() => setMainImage(img)}
//                     className={`w-20 h-20 rounded-lg overflow-hidden cursor-pointer border ${
//                       mainImage === img
//                         ? "border-black ring-2 ring-black"
//                         : "border-gray-300"
//                     }`}
//                   >
//                     <img
//                       src={img}
//                       alt={`Thumbnail ${idx + 1}`}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div> */}
//           {/* LEFT: Images */}
//           <div className="w-full flex flex-col items-center">
//             <div className="w-full max-w-[500px] aspect-square bg-white overflow-hidden rounded-xl mb-2 flex items-center justify-center shadow">
//               <Zoom>
//                 <img
//                   src={mainImage}
//                   alt={fproduct.name}
//                   className="max-w-full max-h-full object-contain"
//                 />
//               </Zoom>
//             </div>

//             {fproduct.images?.length > 1 && (
//               <div className="flex gap-3 flex-wrap justify-center">
//                 {fproduct.images.map((img) => (
//                   <div
//                     key={img}
//                     onClick={() => setMainImage(img)}
//                     className={`w-15 h-15 rounded-lg overflow-hidden cursor-pointer border transition transform hover:scale-105 ${
//                       mainImage === img
//                         ? "border-black ring-2 ring-black"
//                         : "border-gray-300"
//                     }`}
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

//           {/* RIGHT: Info */}
//           <div className="flex flex-col pr-5">
//             <h1 className="text-[13px] md:text-[20px] font-bold mb-2 mt-4">
//               {fproduct.name}
//             </h1>
//             <p className="text-2xl font-bold mb-4">
//               {currency} {displayPrice} /-
//             </p>

//             {/* Size Selector */}
//             <div className="mb-6">
//               <p className="font-medium mb-2">Available Size</p>
//               <div className="flex gap-2 flex-wrap">
//                 {allSizes.map((size) => (
//                   <button
//                     key={size}
//                     onClick={() => {
//                       setSelectedSize(size);
//                       if (
//                         selectedColor &&
//                         !fproduct.variants.some(
//                           (v) => v.size === size && v.color === selectedColor
//                         )
//                       ) {
//                         setSelectedColor("");
//                       }
//                     }}
//                     className={`px-4 py-2 border rounded-lg transition ${
//                       selectedSize === size
//                         ? "bg-black text-white"
//                         : availableSizes.includes(size)
//                         ? "bg-white hover:bg-gray-100"
//                         : "bg-gray-200 text-gray-500 cursor-not-allowed"
//                     }`}
//                   >
//                     {size}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Color Selector */}
//             <div className="mb-6">
//               <p className="font-medium mb-2">Available Color</p>
//               <div className="flex gap-2 flex-wrap">
//                 {allColors.map((color) => (
//                   <button
//                     key={color}
//                     onClick={() => setSelectedColor(color)}
//                     className={`px-4 py-2 border rounded-lg transition ${
//                       selectedColor === color
//                         ? "bg-black text-white"
//                         : availableColors.includes(color)
//                         ? "bg-white hover:bg-gray-100"
//                         : "bg-gray-200 text-gray-500 cursor-not-allowed"
//                     }`}
//                     disabled={!availableColors.includes(color)}
//                   >
//                     {color}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Stock & Quantity */}
//             <div className="mb-6 flex flex-col gap-2">
//               <p
//                 className={`text-sm font-medium ${
//                   variantToUse?.stock > 0 ? "text-green-600" : "text-red-500"
//                 }`}
//               >
//                 {variantToUse?.stock > 0
//                   ? `Stock: ${variantToUse.stock}`
//                   : "Out of stock"}
//               </p>

//               <div className="flex items-center gap-3 mt-2">
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
//                   disabled={quantity >= variantToUse?.stock}
//                 >
//                   +
//                 </button>
//               </div>
//             </div>

//             {/* Add to Cart */}
//             <button
//               onClick={() => {
//                 const multipleSizes = allSizes.length > 1;
//                 const multipleColors = allColors.length > 1;

//                 if (
//                   (multipleSizes && !selectedSize) ||
//                   (multipleColors && !selectedColor)
//                 ) {
//                   toast.error("Please select size and color");
//                   return;
//                 }

//                 if (variantToUse.stock > 0) {
//                   addtocart(
//                     fproduct._id,
//                     variantToUse.size,
//                     variantToUse.color,
//                     quantity
//                   );
//                 } else {
//                   toast.error("Product out of stock");
//                 }
//               }}
//               className="px-6 w-50 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition mb-4"
//             >
//               Add to Cart
//             </button>

//             <p className="mb-6 text-gray-700">{fproduct.description}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Product;

//resolve code-------------------------------------------------------------
// import { useEffect, useState, useContext } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { ShopContext } from "../Context/ShopContext";
// import { toast } from "react-toastify";
// import Zoom from "react-medium-image-zoom";
// import "react-medium-image-zoom/dist/styles.css";

// const Product = () => {
//   const { backendUrl, currency, addtocart, cartitem } = useContext(ShopContext);
//   const { categorySlug, productSlug } = useParams();

//   const [fproduct, setFProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedSize, setSelectedSize] = useState("");
//   const [selectedColor, setSelectedColor] = useState("");
//   const [mainImage, setMainImage] = useState("");
//   const [quantity, setQuantity] = useState(1);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       if (!productSlug) return;
//       try {
//         setLoading(true);
//         const { data } = await axios.get(
//           `${backendUrl}/api/categories/${categorySlug}/${productSlug}`
//         );
//         if (data.success) {
//           setFProduct(data.product);
//           setMainImage(data.product.images?.[0] || "/placeholder.png");

//           const sizes = [...new Set(data.product.variants.map((v) => v.size))];
//           const colors = [
//             ...new Set(data.product.variants.map((v) => v.color)),
//           ];

//           if (sizes.length === 1) setSelectedSize(sizes[0]);
//           if (colors.length === 1) setSelectedColor(colors[0]);
//         } else {
//           toast.error("Product not found");
//         }
//       } catch (error) {
//         console.error(error);
//         toast.error("Failed to load product");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [backendUrl, categorySlug, productSlug]);

//   const allSizes = fproduct
//     ? [...new Set(fproduct.variants.map((v) => v.size))]
//     : [];
//   const allColors = fproduct
//     ? [...new Set(fproduct.variants.map((v) => v.color))]
//     : [];

//   const availableColors = selectedSize
//     ? fproduct.variants
//         .filter((v) => v.size === selectedSize && v.stock > 0)
//         .map((v) => v.color)
//     : allColors;

//   const availableSizes = selectedColor
//     ? fproduct.variants
//         .filter((v) => v.color === selectedColor && v.stock > 0)
//         .map((v) => v.size)
//     : allSizes;

//   const priceVariant = selectedSize
//     ? fproduct?.variants.find((v) => v.size === selectedSize)
//     : fproduct?.variants?.[0];

//   const displayPrice = priceVariant?.price || 0;

//   const selectedVariant =
//     selectedSize && selectedColor
//       ? fproduct?.variants.find(
//           (v) => v.size === selectedSize && v.color === selectedColor
//         )
//       : null;

//   const variantToUse = selectedVariant || priceVariant;

//   // Set initial quantity
//   useEffect(() => {
//     if (!variantToUse) return;
//     setQuantity(variantToUse.stock > 0 ? 1 : 0);
//   }, [variantToUse]);

//   const increment = () => {
//     const inCartQty =
//       cartitem?.[fproduct?._id]?.[selectedSize]?.[selectedColor] || 0;
//     if (quantity + inCartQty < (variantToUse?.stock || 1))
//       setQuantity((q) => q + 1);
//   };

//   const decrement = () => {
//     if (quantity > 1) setQuantity((q) => q - 1);
//   };

//   // ✅ Check if Add to Cart button should be disabled
//   const inCartQty =
//     cartitem?.[fproduct?._id]?.[selectedSize]?.[selectedColor] || 0;
//   const isAddToCartDisabled =
//     !variantToUse || variantToUse.stock <= 0 || inCartQty >= variantToUse.stock;

//   return (
//     <div className="max-w-[1250px] mt-3 pt-4 px-4 bg-white">
//       {loading && <p>Loading...</p>}
//       {!loading && !fproduct && <p>Product not found</p>}
//       {!loading && fproduct && (
//         <div className="grid grid-cols-1 md:grid-cols-2">
//           {/* LEFT: Images */}
//           <div className="w-full flex flex-col items-center">
//             <div className="w-full max-w-[500px] aspect-square bg-white overflow-hidden rounded-xl mb-2 flex items-center justify-center shadow">
//               <Zoom>
//                 <img
//                   src={mainImage}
//                   alt={fproduct.name}
//                   className="max-w-full max-h-full object-contain"
//                 />
//               </Zoom>
//             </div>

//             {fproduct.images?.length > 1 && (
//               <div className="flex gap-3 flex-wrap justify-center">
//                 {fproduct.images.map((img) => (
//                   <div
//                     key={img}
//                     onClick={() => setMainImage(img)}
//                     className={`w-15 h-15 rounded-lg overflow-hidden cursor-pointer border transition transform hover:scale-105 ${
//                       mainImage === img
//                         ? "border-black ring-2 ring-black"
//                         : "border-gray-300"
//                     }`}
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

//           {/* RIGHT: Info */}
//           <div className="flex flex-col pr-5">
//             <h1 className="text-[13px] md:text-[20px] font-bold mb-2 mt-4">
//               {fproduct.name}
//             </h1>
//             <p className="text-2xl font-bold mb-4">
//               {currency} {displayPrice} /-
//             </p>

//             {/* Size Selector */}
//             <div className="mb-6">
//               <p className="font-medium mb-2">Available Size</p>
//               <div className="flex gap-2 flex-wrap">
//                 {allSizes.map((size) => (
//                   <button
//                     key={size}
//                     onClick={() => {
//                       setSelectedSize(size);
//                       if (
//                         selectedColor &&
//                         !fproduct.variants.some(
//                           (v) => v.size === size && v.color === selectedColor
//                         )
//                       ) {
//                         setSelectedColor("");
//                       }
//                     }}
//                     className={`px-4 py-2 border rounded-lg transition ${
//                       selectedSize === size
//                         ? "bg-black text-white"
//                         : availableSizes.includes(size)
//                         ? "bg-white hover:bg-gray-100"
//                         : "bg-gray-200 text-gray-500 cursor-not-allowed"
//                     }`}
//                   >
//                     {size}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Color Selector */}
//             <div className="mb-6">
//               <p className="font-medium mb-2">Available Color</p>
//               <div className="flex gap-2 flex-wrap">
//                 {allColors.map((color) => (
//                   <button
//                     key={color}
//                     onClick={() => setSelectedColor(color)}
//                     className={`px-4 py-2 border rounded-lg transition ${
//                       selectedColor === color
//                         ? "bg-black text-white"
//                         : availableColors.includes(color)
//                         ? "bg-white hover:bg-gray-100"
//                         : "bg-gray-200 text-gray-500 cursor-not-allowed"
//                     }`}
//                     disabled={!availableColors.includes(color)}
//                   >
//                     {color}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Stock & Quantity */}
//             <div className="mb-6 flex flex-col gap-2">
//               <p
//                 className={`text-sm font-medium ${
//                   variantToUse?.stock > 0 ? "text-green-600" : "text-red-500"
//                 }`}
//               >
//                 {variantToUse?.stock > 0
//                   ? `Stock: ${variantToUse.stock - inCartQty}`
//                   : "Out of stock"}
//               </p>

//               <div className="flex items-center gap-3 mt-2">
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
//                   disabled={quantity + inCartQty >= variantToUse?.stock}
//                 >
//                   +
//                 </button>
//               </div>
//             </div>

//             {/* Add to Cart */}
//             <button
//               onClick={() => {
//                 const multipleSizes = allSizes.length > 1;
//                 const multipleColors = allColors.length > 1;

//                 if (
//                   (multipleSizes && !selectedSize) ||
//                   (multipleColors && !selectedColor)
//                 ) {
//                   toast.error("Please select size and color");
//                   return;
//                 }

//                 if (!isAddToCartDisabled) {
//                   addtocart(
//                     fproduct._id,
//                     variantToUse.size,
//                     variantToUse.color,
//                     quantity
//                   );
//                 } else {
//                   toast.error("Cannot add more than available stock");
//                 }
//               }}
//               disabled={isAddToCartDisabled}
//               className={`px-6 w-50 py-3 rounded-lg mb-4 transition ${
//                 isAddToCartDisabled
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-black text-white hover:bg-gray-800"
//               }`}
//             >
//               Add to Cart
//             </button>

//             <p className="mb-6 text-gray-700">{fproduct.description}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Product;

//mistake not checking size and color............................................
// import { useEffect, useState, useContext } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { ShopContext } from "../Context/ShopContext";
// import { toast } from "react-toastify";
// import Zoom from "react-medium-image-zoom";
// import "react-medium-image-zoom/dist/styles.css";

// const Product = () => {
//   const { backendUrl, currency, addtocart, cartitem } = useContext(ShopContext);
//   const { categorySlug, productSlug } = useParams();

//   const [fproduct, setFProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedSize, setSelectedSize] = useState("");
//   const [selectedColor, setSelectedColor] = useState("");
//   const [mainImage, setMainImage] = useState("");
//   const [quantity, setQuantity] = useState(1);

//   // Fetch product data
//   useEffect(() => {
//     const fetchProduct = async () => {
//       if (!productSlug) return;
//       try {
//         setLoading(true);
//         const { data } = await axios.get(
//           `${backendUrl}/api/categories/${categorySlug}/${productSlug}`
//         );
//         if (data.success) {
//           setFProduct(data.product);
//           setMainImage(data.product.images?.[0] || "/placeholder.png");

//           const sizes = [...new Set(data.product.variants.map((v) => v.size))];
//           const colors = [
//             ...new Set(data.product.variants.map((v) => v.color)),
//           ];

//           if (sizes.length === 1) setSelectedSize(sizes[0]);
//           if (colors.length === 1) setSelectedColor(colors[0]);
//         } else {
//           toast.error("Product not found");
//         }
//       } catch (error) {
//         console.error(error);
//         toast.error("Failed to load product");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [backendUrl, categorySlug, productSlug]);

//   const allSizes = fproduct
//     ? [...new Set(fproduct.variants.map((v) => v.size))]
//     : [];
//   const allColors = fproduct
//     ? [...new Set(fproduct.variants.map((v) => v.color))]
//     : [];

//   const availableColors = selectedSize
//     ? fproduct.variants
//         .filter((v) => v.size === selectedSize && v.stock > 0)
//         .map((v) => v.color)
//     : allColors;

//   const availableSizes = selectedColor
//     ? fproduct.variants
//         .filter((v) => v.color === selectedColor && v.stock > 0)
//         .map((v) => v.size)
//     : allSizes;

//   const priceVariant = selectedSize
//     ? fproduct?.variants.find((v) => v.size === selectedSize)
//     : fproduct?.variants?.[0];

//   const displayPrice = priceVariant?.price || 0;

//   const selectedVariant =
//     selectedSize && selectedColor
//       ? fproduct?.variants.find(
//           (v) => v.size === selectedSize && v.color === selectedColor
//         )
//       : null;

//   const variantToUse = selectedVariant || priceVariant;

//   // Initialize quantity based on stock
//   useEffect(() => {
//     if (!variantToUse) return;
//     setQuantity(variantToUse.stock > 0 ? 1 : 0);
//   }, [variantToUse]);

//   // Quantity increment/decrement
//   const increment = () => {
//     const inCartQty =
//       cartitem?.[fproduct?._id]?.[selectedSize]?.[selectedColor] || 0;
//     if (quantity + inCartQty < (variantToUse?.stock || 1))
//       setQuantity((q) => q + 1);
//   };

//   const decrement = () => {
//     if (quantity > 1) setQuantity((q) => q - 1);
//   };

//   // Check if Add to Cart should be disabled
//   const inCartQty =
//     cartitem?.[fproduct?._id]?.[selectedSize]?.[selectedColor] || 0;
//   const isAddToCartDisabled =
//     !variantToUse || variantToUse.stock <= 0 || inCartQty >= variantToUse.stock;

//   return (
//     <div className="max-w-[1250px] mt-3 pt-4 px-4 bg-white">
//       {loading && <p>Loading...</p>}
//       {!loading && !fproduct && <p>Product not found</p>}
//       {!loading && fproduct && (
//         <div className="grid grid-cols-1 md:grid-cols-2">
//           {/* LEFT: Images */}
//           <div className="w-full flex flex-col items-center">
//             <div className="w-full max-w-[500px] aspect-square bg-white overflow-hidden rounded-xl mb-2 flex items-center justify-center shadow">
//               <Zoom>
//                 <img
//                   src={mainImage}
//                   alt={fproduct.name}
//                   className="max-w-full max-h-full object-contain"
//                 />
//               </Zoom>
//             </div>
//             {fproduct.images?.length > 1 && (
//               <div className="flex gap-3 flex-wrap justify-center">
//                 {fproduct.images.map((img) => (
//                   <div
//                     key={img}
//                     onClick={() => setMainImage(img)}
//                     className={`w-15 h-15 rounded-lg overflow-hidden cursor-pointer border transition transform hover:scale-105 ${
//                       mainImage === img
//                         ? "border-black ring-2 ring-black"
//                         : "border-gray-300"
//                     }`}
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

//           {/* RIGHT: Info */}
//           <div className="flex flex-col pr-5">
//             <h1 className="text-[13px] md:text-[20px] font-bold mb-2 mt-4">
//               {fproduct.name}
//             </h1>
//             <p className="text-2xl font-bold mb-4">
//               {currency} {displayPrice} /-
//             </p>

//             {/* Size Selector */}
//             <div className="mb-6">
//               <p className="font-medium mb-2">Available Size</p>
//               <div className="flex gap-2 flex-wrap">
//                 {allSizes.map((size) => (
//                   <button
//                     key={size}
//                     onClick={() => {
//                       setSelectedSize(size);
//                       if (
//                         selectedColor &&
//                         !fproduct.variants.some(
//                           (v) => v.size === size && v.color === selectedColor
//                         )
//                       ) {
//                         setSelectedColor("");
//                       }
//                     }}
//                     className={`px-4 py-2 border rounded-lg transition ${
//                       selectedSize === size
//                         ? "bg-black text-white"
//                         : availableSizes.includes(size)
//                         ? "bg-white hover:bg-gray-100"
//                         : "bg-gray-200 text-gray-500 cursor-not-allowed"
//                     }`}
//                   >
//                     {size}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Color Selector */}
//             <div className="mb-6">
//               <p className="font-medium mb-2">Available Color</p>
//               <div className="flex gap-2 flex-wrap">
//                 {allColors.map((color) => (
//                   <button
//                     key={color}
//                     onClick={() => setSelectedColor(color)}
//                     className={`px-4 py-2 border rounded-lg transition ${
//                       selectedColor === color
//                         ? "bg-black text-white"
//                         : availableColors.includes(color)
//                         ? "bg-white hover:bg-gray-100"
//                         : "bg-gray-200 text-gray-500 cursor-not-allowed"
//                     }`}
//                     disabled={!availableColors.includes(color)}
//                   >
//                     {color}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Quantity */}
//             <div className="mb-6 flex items-center gap-3 mt-2">
//               <button
//                 onClick={decrement}
//                 className="px-3 py-1 bg-gray-200 rounded"
//                 disabled={quantity <= 1 || isAddToCartDisabled}
//               >
//                 -
//               </button>
//               <span className="font-medium">{quantity}</span>
//               <button
//                 onClick={increment}
//                 className="px-3 py-1 bg-gray-200 rounded"
//                 disabled={
//                   quantity + inCartQty >= variantToUse?.stock ||
//                   isAddToCartDisabled
//                 }
//               >
//                 +
//               </button>
//             </div>

//             {/* Add to Cart */}
//             {isAddToCartDisabled ? (
//               <button
//                 className="px-6 w-50 py-3 bg-gray-400 text-white rounded-lg cursor-not-allowed mb-4"
//                 disabled
//               >
//                 Already Added
//               </button>
//             ) : (
//               <button
//                 onClick={() =>
//                   addtocart(
//                     fproduct._id,
//                     variantToUse.size,
//                     variantToUse.color,
//                     quantity
//                   )
//                 }
//                 className="px-6 w-50 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition mb-4"
//               >
//                 Add to Cart
//               </button>
//             )}

//             <p className="mb-6 text-gray-700">{fproduct.description}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Product;

//work but ui mistake==================================================================
// import { useEffect, useState, useContext } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { ShopContext } from "../Context/ShopContext";
// import { toast } from "react-toastify";
// import Zoom from "react-medium-image-zoom";
// import "react-medium-image-zoom/dist/styles.css";

// const Product = () => {
//   const { backendUrl, currency, addtocart, cartitem } = useContext(ShopContext);
//   const { categorySlug, productSlug } = useParams();

//   const [fproduct, setFProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedSize, setSelectedSize] = useState("");
//   const [selectedColor, setSelectedColor] = useState("");
//   const [mainImage, setMainImage] = useState("");
//   const [quantity, setQuantity] = useState(1);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       if (!productSlug) return;
//       try {
//         setLoading(true);
//         const { data } = await axios.get(
//           `${backendUrl}/api/categories/${categorySlug}/${productSlug}`
//         );
//         if (data.success) {
//           setFProduct(data.product);
//           setMainImage(data.product.images?.[0] || "/placeholder.png");

//           const sizes = [...new Set(data.product.variants.map((v) => v.size))];
//           const colors = [
//             ...new Set(data.product.variants.map((v) => v.color)),
//           ];

//           if (sizes.length === 1) setSelectedSize(sizes[0]);
//           if (colors.length === 1) setSelectedColor(colors[0]);
//         } else {
//           toast.error("Product not found");
//         }
//       } catch (error) {
//         console.error(error);
//         toast.error("Failed to load product");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [backendUrl, categorySlug, productSlug]);

//   const allSizes = fproduct
//     ? [...new Set(fproduct.variants.map((v) => v.size))]
//     : [];
//   const allColors = fproduct
//     ? [...new Set(fproduct.variants.map((v) => v.color))]
//     : [];

//   const availableColors = selectedSize
//     ? fproduct.variants
//         .filter((v) => v.size === selectedSize && v.stock > 0)
//         .map((v) => v.color)
//     : allColors;

//   const availableSizes = selectedColor
//     ? fproduct.variants
//         .filter((v) => v.color === selectedColor && v.stock > 0)
//         .map((v) => v.size)
//     : allSizes;

//   const priceVariant = selectedSize
//     ? fproduct?.variants.find((v) => v.size === selectedSize)
//     : fproduct?.variants?.[0];

//   const displayPrice = priceVariant?.price || 0;

//   const selectedVariant =
//     selectedSize && selectedColor
//       ? fproduct?.variants.find(
//           (v) => v.size === selectedSize && v.color === selectedColor
//         )
//       : null;

//   const variantToUse = selectedVariant || priceVariant;

//   // Set initial quantity
//   useEffect(() => {
//     if (!variantToUse) return;
//     setQuantity(variantToUse.stock > 0 ? 1 : 0);
//   }, [variantToUse]);

//   const inCartQty =
//     cartitem?.[fproduct?._id]?.[selectedSize]?.[selectedColor] || 0;

//   const increment = () => {
//     if (quantity + inCartQty < (variantToUse?.stock || 1))
//       setQuantity((q) => q + 1);
//   };
//   const decrement = () => {
//     if (quantity > 1) setQuantity((q) => q - 1);
//   };

//   // Disable Add to Cart if:
//   // 1. Variant not selected
//   // 2. Stock is zero
//   // 3. Already added max stock
//   const isAddToCartDisabled =
//     !selectedSize ||
//     !selectedColor ||
//     !variantToUse ||
//     variantToUse.stock <= 0 ||
//     inCartQty >= variantToUse.stock;

//   return (
//     <div className="max-w-[1250px] mt-3 pt-4 px-4 bg-white">
//       {loading && <p>Loading...</p>}
//       {!loading && !fproduct && <p>Product not found</p>}
//       {!loading && fproduct && (
//         <div className="grid grid-cols-1 md:grid-cols-2">
//           {/* LEFT: Images */}
//           <div className="w-full flex flex-col items-center">
//             <div className="w-full max-w-[500px] aspect-square bg-white overflow-hidden rounded-xl mb-2 flex items-center justify-center shadow">
//               <Zoom>
//                 <img
//                   src={mainImage}
//                   alt={fproduct.name}
//                   className="max-w-full max-h-full object-contain"
//                 />
//               </Zoom>
//             </div>
//             {fproduct.images?.length > 1 && (
//               <div className="flex gap-3 flex-wrap justify-center">
//                 {fproduct.images.map((img) => (
//                   <div
//                     key={img}
//                     onClick={() => setMainImage(img)}
//                     className={`w-15 h-15 rounded-lg overflow-hidden cursor-pointer border transition transform hover:scale-105 ${
//                       mainImage === img
//                         ? "border-black ring-2 ring-black"
//                         : "border-gray-300"
//                     }`}
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

//           {/* RIGHT: Info */}
//           <div className="flex flex-col pr-5">
//             <h1 className="text-[13px] md:text-[20px] font-bold mb-2 mt-4">
//               {fproduct.name}
//             </h1>
//             <p className="text-2xl font-bold mb-4">
//               {currency} {displayPrice} /-
//             </p>

//             {/* Size Selector */}
//             <div className="mb-6">
//               <p className="font-medium mb-2">Available Size</p>
//               <div className="flex gap-2 flex-wrap">
//                 {allSizes.map((size) => (
//                   <button
//                     key={size}
//                     onClick={() => {
//                       setSelectedSize(size);
//                       if (
//                         selectedColor &&
//                         !fproduct.variants.some(
//                           (v) => v.size === size && v.color === selectedColor
//                         )
//                       ) {
//                         setSelectedColor("");
//                       }
//                     }}
//                     className={`px-4 py-2 border rounded-lg transition ${
//                       selectedSize === size
//                         ? "bg-black text-white"
//                         : availableSizes.includes(size)
//                         ? "bg-white hover:bg-gray-100"
//                         : "bg-gray-200 text-gray-500 cursor-not-allowed"
//                     }`}
//                   >
//                     {size}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Color Selector */}
//             <div className="mb-6">
//               <p className="font-medium mb-2">Available Color</p>
//               <div className="flex gap-2 flex-wrap">
//                 {allColors.map((color) => (
//                   <button
//                     key={color}
//                     onClick={() => setSelectedColor(color)}
//                     className={`px-4 py-2 border rounded-lg transition ${
//                       selectedColor === color
//                         ? "bg-black text-white"
//                         : availableColors.includes(color)
//                         ? "bg-white hover:bg-gray-100"
//                         : "bg-gray-200 text-gray-500 cursor-not-allowed"
//                     }`}
//                     disabled={!availableColors.includes(color)}
//                   >
//                     {color}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Quantity */}
//             <div className="mb-6 flex items-center gap-3 mt-2">
//               <button
//                 onClick={decrement}
//                 className="px-3 py-1 bg-gray-200 rounded"
//                 disabled={quantity <= 1 || isAddToCartDisabled}
//               >
//                 -
//               </button>
//               <span className="font-medium">{quantity}</span>
//               <button
//                 onClick={increment}
//                 className="px-3 py-1 bg-gray-200 rounded"
//                 disabled={
//                   quantity + inCartQty >= variantToUse?.stock ||
//                   isAddToCartDisabled
//                 }
//               >
//                 +
//               </button>
//             </div>

//             {/* Add to Cart */}
//             <button
//               onClick={() => {
//                 if (!selectedSize || !selectedColor) {
//                   toast.error("Please select size and color");
//                   return;
//                 }
//                 addtocart(
//                   fproduct._id,
//                   variantToUse.size,
//                   variantToUse.color,
//                   quantity
//                 );
//               }}
//               disabled={isAddToCartDisabled}
//               className={`px-6 w-50 py-3 rounded-lg mb-4 transition ${
//                 isAddToCartDisabled
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-black text-white hover:bg-gray-800"
//               }`}
//             >
//               {isAddToCartDisabled ? "Already Added" : "Add to Cart"}
//             </button>

//             <p className="mb-6 text-gray-700">{fproduct.description}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Product;

//work but show toast while user addtocart maximum stock size
// import { useEffect, useState, useContext } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { ShopContext } from "../Context/ShopContext";
// import { toast } from "react-toastify";
// import Zoom from "react-medium-image-zoom";
// import "react-medium-image-zoom/dist/styles.css";

// const Product = () => {
//   const { backendUrl, currency, addtocart, cartitem } = useContext(ShopContext);
//   const { categorySlug, productSlug } = useParams();

//   const [fproduct, setFProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedSize, setSelectedSize] = useState("");
//   const [selectedColor, setSelectedColor] = useState("");
//   const [mainImage, setMainImage] = useState("");
//   const [quantity, setQuantity] = useState(1);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       if (!productSlug) return;
//       try {
//         setLoading(true);
//         const { data } = await axios.get(
//           `${backendUrl}/api/categories/${categorySlug}/${productSlug}`
//         );
//         if (data.success) {
//           setFProduct(data.product);
//           setMainImage(data.product.images?.[0] || "/placeholder.png");

//           const sizes = [...new Set(data.product.variants.map((v) => v.size))];
//           const colors = [
//             ...new Set(data.product.variants.map((v) => v.color)),
//           ];

//           if (sizes.length === 1) setSelectedSize(sizes[0]);
//           if (colors.length === 1) setSelectedColor(colors[0]);
//         } else {
//           toast.error("Product not found");
//         }
//       } catch (error) {
//         console.error(error);
//         toast.error("Failed to load product");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [backendUrl, categorySlug, productSlug]);

//   const allSizes = fproduct
//     ? [...new Set(fproduct.variants.map((v) => v.size))]
//     : [];
//   const allColors = fproduct
//     ? [...new Set(fproduct.variants.map((v) => v.color))]
//     : [];

//   const availableColors = selectedSize
//     ? fproduct.variants
//         .filter((v) => v.size === selectedSize && v.stock > 0)
//         .map((v) => v.color)
//     : allColors;

//   const availableSizes = selectedColor
//     ? fproduct.variants
//         .filter((v) => v.color === selectedColor && v.stock > 0)
//         .map((v) => v.size)
//     : allSizes;

//   const priceVariant = selectedSize
//     ? fproduct?.variants.find((v) => v.size === selectedSize)
//     : fproduct?.variants?.[0];

//   const displayPrice = priceVariant?.price || 0;

//   const selectedVariant =
//     selectedSize && selectedColor
//       ? fproduct?.variants.find(
//           (v) => v.size === selectedSize && v.color === selectedColor
//         )
//       : null;

//   const variantToUse = selectedVariant || priceVariant;

//   // Set initial quantity
//   useEffect(() => {
//     if (!variantToUse) return;
//     setQuantity(variantToUse.stock > 0 ? 1 : 0);
//   }, [variantToUse]);

//   const inCartQty =
//     cartitem?.[fproduct?._id]?.[selectedSize]?.[selectedColor] || 0;

//   const increment = () => {
//     if (quantity + inCartQty < (variantToUse?.stock || 1))
//       setQuantity((q) => q + 1);
//   };
//   const decrement = () => {
//     if (quantity > 1) setQuantity((q) => q - 1);
//   };

//   // Disable button only if variant selected and already added max stock
//   const isVariantSelected = selectedSize && selectedColor;
//   const isOutOfStock = isVariantSelected && variantToUse?.stock <= 0;
//   const isMaxInCart = isVariantSelected && inCartQty >= variantToUse?.stock;

//   return (
//     <div className="max-w-[1250px] mt-3 pt-4 px-4 bg-white">
//       {loading && <p>Loading...</p>}
//       {!loading && !fproduct && <p>Product not found</p>}
//       {!loading && fproduct && (
//         <div className="grid grid-cols-1 md:grid-cols-2">
//           {/* LEFT: Images */}
//           <div className="w-full flex flex-col items-center">
//             <div className="w-full max-w-[500px] aspect-square bg-white overflow-hidden rounded-xl mb-2 flex items-center justify-center shadow">
//               <Zoom>
//                 <img
//                   src={mainImage}
//                   alt={fproduct.name}
//                   className="max-w-full max-h-full object-contain"
//                 />
//               </Zoom>
//             </div>
//             {fproduct.images?.length > 1 && (
//               <div className="flex gap-3 flex-wrap justify-center">
//                 {fproduct.images.map((img) => (
//                   <div
//                     key={img}
//                     onClick={() => setMainImage(img)}
//                     className={`w-15 h-15 rounded-lg overflow-hidden cursor-pointer border transition transform hover:scale-105 ${
//                       mainImage === img
//                         ? "border-black ring-2 ring-black"
//                         : "border-gray-300"
//                     }`}
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

//           {/* RIGHT: Info */}
//           <div className="flex flex-col pr-5">
//             <h1 className="text-[13px] md:text-[20px] font-bold mb-2 mt-4">
//               {fproduct.name}
//             </h1>
//             <p className="text-2xl font-bold mb-4">
//               {currency} {displayPrice} /-
//             </p>

//             {/* Size Selector */}
//             <div className="mb-6">
//               <p className="font-medium mb-2">Available Size</p>
//               <div className="flex gap-2 flex-wrap">
//                 {allSizes.map((size) => (
//                   <button
//                     key={size}
//                     onClick={() => {
//                       setSelectedSize(size);
//                       if (
//                         selectedColor &&
//                         !fproduct.variants.some(
//                           (v) => v.size === size && v.color === selectedColor
//                         )
//                       ) {
//                         setSelectedColor("");
//                       }
//                     }}
//                     className={`px-4 py-2 border rounded-lg transition ${
//                       selectedSize === size
//                         ? "bg-black text-white"
//                         : availableSizes.includes(size)
//                         ? "bg-white hover:bg-gray-100"
//                         : "bg-gray-200 text-gray-500 cursor-not-allowed"
//                     }`}
//                   >
//                     {size}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Color Selector */}
//             <div className="mb-6">
//               <p className="font-medium mb-2">Available Color</p>
//               <div className="flex gap-2 flex-wrap">
//                 {allColors.map((color) => (
//                   <button
//                     key={color}
//                     onClick={() => setSelectedColor(color)}
//                     className={`px-4 py-2 border rounded-lg transition ${
//                       selectedColor === color
//                         ? "bg-black text-white"
//                         : availableColors.includes(color)
//                         ? "bg-white hover:bg-gray-100"
//                         : "bg-gray-200 text-gray-500 cursor-not-allowed"
//                     }`}
//                     disabled={!availableColors.includes(color)}
//                   >
//                     {color}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Quantity */}
//             {isVariantSelected && (
//               <div className="mb-6 flex items-center gap-3 mt-2">
//                 <button
//                   onClick={decrement}
//                   className="px-3 py-1 bg-gray-200 rounded"
//                   disabled={quantity <= 1 || isOutOfStock || isMaxInCart}
//                 >
//                   -
//                 </button>
//                 <span className="font-medium">{quantity}</span>
//                 <button
//                   onClick={increment}
//                   className="px-3 py-1 bg-gray-200 rounded"
//                   disabled={
//                     quantity + inCartQty >= variantToUse?.stock ||
//                     isOutOfStock ||
//                     isMaxInCart
//                   }
//                 >
//                   +
//                 </button>
//               </div>
//             )}

//             {/* Add to Cart */}
//             <button
//               onClick={() => {
//                 if (!isVariantSelected) {
//                   toast.error("Please select size and color");
//                   return;
//                 }
//                 if (isOutOfStock || isMaxInCart) {
//                   toast.error("Cannot add more than available stock");
//                   return;
//                 }
//                 addtocart(
//                   fproduct._id,
//                   variantToUse.size,
//                   variantToUse.color,
//                   quantity
//                 );
//               }}
//               className="px-6 w-50 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition mb-4"
//             >
//               Add to Cart
//             </button>

//             <p className="mb-6 text-gray-700">{fproduct.description}</p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Product;

//work but addedtocart and outofstock mismatch
// import { useEffect, useState, useContext } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { ShopContext } from "../Context/ShopContext";
// import { toast } from "react-toastify";
// import Zoom from "react-medium-image-zoom";
// import "react-medium-image-zoom/dist/styles.css";

// const Product = () => {
//   const { backendUrl, currency, addtocart, cartitem } = useContext(ShopContext);
//   const { categorySlug, productSlug } = useParams();

//   const [fproduct, setFProduct] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [selectedSize, setSelectedSize] = useState("");
//   const [selectedColor, setSelectedColor] = useState("");
//   const [mainImage, setMainImage] = useState("");
//   const [quantity, setQuantity] = useState(1);

//   useEffect(() => {
//     const fetchProduct = async () => {
//       if (!productSlug) return;
//       try {
//         setLoading(true);
//         const { data } = await axios.get(
//           `${backendUrl}/api/categories/${categorySlug}/${productSlug}`
//         );
//         if (data.success) {
//           setFProduct(data.product);
//           setMainImage(data.product.images?.[0] || "/placeholder.png");

//           const sizes = [...new Set(data.product.variants.map((v) => v.size))];
//           const colors = [
//             ...new Set(data.product.variants.map((v) => v.color)),
//           ];

//           if (sizes.length === 1) setSelectedSize(sizes[0]);
//           if (colors.length === 1) setSelectedColor(colors[0]);
//         } else {
//           toast.error("Product not found");
//         }
//       } catch (error) {
//         console.error(error);
//         toast.error("Failed to load product");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProduct();
//   }, [backendUrl, categorySlug, productSlug]);

//   const allSizes = fproduct
//     ? [...new Set(fproduct.variants.map((v) => v.size))]
//     : [];
//   const allColors = fproduct
//     ? [...new Set(fproduct.variants.map((v) => v.color))]
//     : [];

//   const availableColors = selectedSize
//     ? fproduct.variants
//         .filter((v) => v.size === selectedSize && v.stock > 0)
//         .map((v) => v.color)
//     : allColors;

//   const availableSizes = selectedColor
//     ? fproduct.variants
//         .filter((v) => v.color === selectedColor && v.stock > 0)
//         .map((v) => v.size)
//     : allSizes;

//   const priceVariant = selectedSize
//     ? fproduct?.variants.find((v) => v.size === selectedSize)
//     : fproduct?.variants?.[0];

//   const displayPrice = priceVariant?.price || 0;

//   const selectedVariant =
//     selectedSize && selectedColor
//       ? fproduct?.variants.find(
//           (v) => v.size === selectedSize && v.color === selectedColor
//         )
//       : null;

//   const variantToUse = selectedVariant || priceVariant;

//   // Initial quantity
//   useEffect(() => {
//     if (!variantToUse) return;
//     setQuantity(variantToUse.stock > 0 ? 1 : 0);
//   }, [variantToUse]);

//   const inCartQty =
//     cartitem?.[fproduct?._id]?.[selectedSize]?.[selectedColor] || 0;

//   const increment = () => {
//     if (quantity + inCartQty < (variantToUse?.stock || 1)) {
//       setQuantity((q) => q + 1);
//     }
//   };
//   const decrement = () => {
//     if (quantity > 1) {
//       setQuantity((q) => q - 1);
//     }
//   };

//   const isVariantSelected = selectedSize && selectedColor;
//   const isOutOfStock = isVariantSelected && variantToUse?.stock <= 0;
//   const isMaxInCart = isVariantSelected && inCartQty >= variantToUse?.stock;

//   return (
//     <div className="max-w-[1250px] mt-3 pt-4 px-4 bg-white">
//       {loading && <p>Loading...</p>}
//       {!loading && !fproduct && <p>Product not found</p>}
//       {!loading && fproduct && (
//         <div className="grid grid-cols-1 md:grid-cols-2">
//           {/* LEFT IMAGES */}
//           <div className="w-full flex flex-col items-center">
//             <div className="w-full max-w-[500px] aspect-square bg-white overflow-hidden rounded-xl mb-2 flex items-center justify-center shadow">
//               <Zoom>
//                 <img
//                   src={mainImage}
//                   alt={fproduct.name}
//                   className="max-w-full max-h-full object-contain"
//                 />
//               </Zoom>
//             </div>
//             {fproduct.images?.length > 1 && (
//               <div className="flex gap-3 flex-wrap justify-center">
//                 {fproduct.images.map((img) => (
//                   <div
//                     key={img}
//                     onClick={() => setMainImage(img)}
//                     className={`w-15 h-15 rounded-lg overflow-hidden cursor-pointer border transition transform hover:scale-105 ${
//                       mainImage === img
//                         ? "border-black ring-2 ring-black"
//                         : "border-gray-300"
//                     }`}
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

//             {/* SIZE */}
//             <div className="mb-6">
//               <p className="font-medium mb-2">Available Size</p>
//               <div className="flex gap-2 flex-wrap">
//                 {allSizes.map((size) => (
//                   <button
//                     key={size}
//                     onClick={() => {
//                       setSelectedSize(size);
//                       if (
//                         selectedColor &&
//                         !fproduct.variants.some(
//                           (v) => v.size === size && v.color === selectedColor
//                         )
//                       ) {
//                         setSelectedColor("");
//                       }
//                     }}
//                     className={`px-4 py-2 border rounded-lg transition ${
//                       selectedSize === size
//                         ? "bg-black text-white"
//                         : availableSizes.includes(size)
//                         ? "bg-white hover:bg-gray-100"
//                         : "bg-gray-200 text-gray-500 cursor-not-allowed"
//                     }`}
//                   >
//                     {size}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* COLOR */}
//             <div className="mb-6">
//               <p className="font-medium mb-2">Available Color</p>
//               <div className="flex gap-2 flex-wrap">
//                 {allColors.map((color) => (
//                   <button
//                     key={color}
//                     onClick={() => setSelectedColor(color)}
//                     className={`px-4 py-2 border rounded-lg transition ${
//                       selectedColor === color
//                         ? "bg-black text-white"
//                         : availableColors.includes(color)
//                         ? "bg-white hover:bg-gray-100"
//                         : "bg-gray-200 text-gray-500 cursor-not-allowed"
//                     }`}
//                     disabled={!availableColors.includes(color)}
//                   >
//                     {color}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* QUANTITY */}
//             {isVariantSelected && (
//               <div className="mb-6 flex items-center gap-3 mt-2">
//                 <button
//                   onClick={decrement}
//                   className="px-3 py-1 bg-gray-200 rounded"
//                   disabled={quantity <= 1 || isOutOfStock || isMaxInCart}
//                 >
//                   -
//                 </button>
//                 <span className="font-medium">{quantity}</span>
//                 <button
//                   onClick={increment}
//                   className="px-3 py-1 bg-gray-200 rounded"
//                   disabled={
//                     quantity + inCartQty >= variantToUse?.stock ||
//                     isOutOfStock ||
//                     isMaxInCart
//                   }
//                 >
//                   +
//                 </button>
//               </div>
//             )}

//             {/* ADD TO CART */}
//             <button
//               onClick={() => {
//                 if (!isVariantSelected) {
//                   toast.error("Please select size and color");
//                   return;
//                 }
//                 addtocart(
//                   fproduct._id,
//                   variantToUse.size,
//                   variantToUse.color,
//                   quantity
//                 );
//               }}
//               disabled={isOutOfStock || isMaxInCart}
//               className={`px-6 w-50 py-3 rounded-lg mb-4 transition ${
//                 isOutOfStock || isMaxInCart
//                   ? "bg-gray-400 cursor-not-allowed"
//                   : "bg-black text-white hover:bg-gray-800"
//               }`}
//             >
//               {isOutOfStock || isMaxInCart ? "Added to Cart" : "Add to Cart"}
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
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

const Product = () => {
  const { backendUrl, currency, addtocart, cartitem } = useContext(ShopContext);
  const { categorySlug, productSlug } = useParams();

  const [fproduct, setFProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productSlug) return;
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${backendUrl}/api/categories/${categorySlug}/${productSlug}`
        );
        if (data.success) {
          setFProduct(data.product);
          setMainImage(data.product.images?.[0] || "/placeholder.png");

          const sizes = [...new Set(data.product.variants.map((v) => v.size))];
          const colors = [
            ...new Set(data.product.variants.map((v) => v.color)),
          ];

          if (sizes.length === 1) setSelectedSize(sizes[0]);
          if (colors.length === 1) setSelectedColor(colors[0]);
        } else {
          toast.error("Product not found");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [backendUrl, categorySlug, productSlug]);

  const allSizes = fproduct
    ? [...new Set(fproduct.variants.map((v) => v.size))]
    : [];
  const allColors = fproduct
    ? [...new Set(fproduct.variants.map((v) => v.color))]
    : [];

  const availableColors = selectedSize
    ? fproduct.variants
        .filter((v) => v.size === selectedSize && v.stock > 0)
        .map((v) => v.color)
    : allColors;

  const availableSizes = selectedColor
    ? fproduct.variants
        .filter((v) => v.color === selectedColor && v.stock > 0)
        .map((v) => v.size)
    : allSizes;

  const priceVariant = selectedSize
    ? fproduct?.variants.find((v) => v.size === selectedSize)
    : fproduct?.variants?.[0];

  const displayPrice = priceVariant?.price || 0;

  const selectedVariant =
    selectedSize && selectedColor
      ? fproduct?.variants.find(
          (v) => v.size === selectedSize && v.color === selectedColor
        )
      : null;

  const variantToUse = selectedVariant || priceVariant;

  // Initial quantity
  useEffect(() => {
    if (!variantToUse) return;
    setQuantity(variantToUse.stock > 0 ? 1 : 0);
  }, [variantToUse]);

  const inCartQty =
    cartitem?.[fproduct?._id]?.[selectedSize]?.[selectedColor] || 0;

  const increment = () => {
    if (quantity + inCartQty < (variantToUse?.stock || 1)) {
      setQuantity((q) => q + 1);
    }
  };
  const decrement = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  const isVariantSelected = selectedSize && selectedColor;
  const isOutOfStock = isVariantSelected && variantToUse?.stock <= 0;
  const isMaxInCart = isVariantSelected && inCartQty >= variantToUse?.stock;

  return (
    <div className="max-w-[1250px] mt-3 pt-4 px-4 bg-white">
      {loading && <p>Loading...</p>}
      {!loading && !fproduct && <p>Product not found</p>}
      {!loading && fproduct && (
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* LEFT IMAGES */}
          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-[500px] aspect-square bg-white overflow-hidden rounded-xl mb-2 flex items-center justify-center shadow">
              <Zoom>
                <img
                  src={mainImage}
                  alt={fproduct.name}
                  className="max-w-full max-h-full object-contain"
                />
              </Zoom>
            </div>
            {fproduct.images?.length > 1 && (
              <div className="flex gap-3 flex-wrap justify-center">
                {fproduct.images.map((img) => (
                  <div
                    key={img}
                    onClick={() => setMainImage(img)}
                    className={`w-15 h-15 rounded-lg overflow-hidden cursor-pointer border transition transform hover:scale-105 ${
                      mainImage === img
                        ? "border-black ring-2 ring-black"
                        : "border-gray-300"
                    }`}
                  >
                    <img
                      src={img}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT INFO */}
          <div className="flex flex-col pr-5">
            <h1 className="text-[13px] md:text-[20px] font-bold mb-2 mt-4">
              {fproduct.name}
            </h1>
            <p className="text-2xl font-bold mb-4">
              {currency} {displayPrice} /-
            </p>

            {/* SIZE */}
            <div className="mb-6">
              <p className="font-medium mb-2">Available Size</p>
              <div className="flex gap-2 flex-wrap">
                {allSizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size);
                      if (
                        selectedColor &&
                        !fproduct.variants.some(
                          (v) => v.size === size && v.color === selectedColor
                        )
                      ) {
                        setSelectedColor("");
                      }
                    }}
                    className={`px-4 py-2 border rounded-lg transition ${
                      selectedSize === size
                        ? "bg-black text-white"
                        : availableSizes.includes(size)
                        ? "bg-white hover:bg-gray-100"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* COLOR */}
            <div className="mb-6">
              <p className="font-medium mb-2">Available Color</p>
              <div className="flex gap-2 flex-wrap">
                {allColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 border rounded-lg transition ${
                      selectedColor === color
                        ? "bg-black text-white"
                        : availableColors.includes(color)
                        ? "bg-white hover:bg-gray-100"
                        : "bg-gray-200 text-gray-500 cursor-not-allowed"
                    }`}
                    disabled={!availableColors.includes(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* STOCK INFO */}
            {isVariantSelected && (
              <p className="mb-2 text-sm text-gray-600">
                Stock Available: {variantToUse?.stock || 0}
              </p>
            )}

            {/* QUANTITY */}
            {isVariantSelected && (
              <div className="mb-6 flex items-center gap-3 mt-2">
                <button
                  onClick={decrement}
                  className="px-3 py-1 bg-gray-200 rounded"
                  disabled={quantity <= 1 || isOutOfStock || isMaxInCart}
                >
                  -
                </button>
                <span className="font-medium">{quantity}</span>
                <button
                  onClick={increment}
                  className="px-3 py-1 bg-gray-200 rounded"
                  disabled={
                    quantity + inCartQty >= variantToUse?.stock ||
                    isOutOfStock ||
                    isMaxInCart
                  }
                >
                  +
                </button>
              </div>
            )}

            {/* ADD TO CART */}
            <button
              onClick={() => {
                if (!isVariantSelected) {
                  toast.error("Please select size and color");
                  return;
                }
                addtocart(
                  fproduct._id,
                  variantToUse.size,
                  variantToUse.color,
                  quantity
                );
              }}
              disabled={isOutOfStock || isMaxInCart}
              className={`px-6 w-50 py-3 rounded-lg mb-4 transition ${
                isOutOfStock
                  ? "bg-gray-400 cursor-not-allowed"
                  : isMaxInCart
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
              }`}
            >
              {isOutOfStock
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
