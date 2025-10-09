// import { useContext, useState, useEffect } from "react";
// import { ShopContext } from "../Context/ShopContext";
// import axios from "axios";
// import Product_Page from "../component/P_Page_Component";

// const Collection = () => {
//   const { backendUrl, products } = useContext(ShopContext);

//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [activeCategory, setActiveCategory] = useState(null);
//   const [activeSub, setActiveSub] = useState(null);
//   const [sortType, setSortType] = useState("relavent");
//   const [showFilter, setShowFilter] = useState(false);

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const { data } = await axios.get(`${backendUrl}/api/categories`);
//         if (data.success) setCategories(data.categories);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchCategories();
//   }, [backendUrl]);

//   // Fetch subcategories for selected category
//   useEffect(() => {
//     if (!activeCategory) {
//       setSubcategories([]);
//       setActiveSub(null);
//       return;
//     }

//     const fetchSubcategories = async () => {
//       try {
//         const { data } = await axios.get(
//           `${backendUrl}/api/categories/${activeCategory}`
//         );
//         if (data.success) setSubcategories(data.subcategories);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchSubcategories();
//   }, [activeCategory, backendUrl]);

//   // Filter products
//   const filteredProducts = products.filter((p) => {
//     const productCategorySlug =
//       p.subcategory?.category?.slug || p.category?.slug || null;
//     const productSubSlug = p.subcategory?.slug || null;

//     const matchesCategory = activeCategory
//       ? productCategorySlug === activeCategory
//       : true;
//     const matchesSub = activeSub ? productSubSlug === activeSub : true;

//     return matchesCategory && matchesSub;
//   });

//   // Sort products
//   const sortedProducts = filteredProducts.slice().sort((a, b) => {
//     const priceA = a?.variants?.[0]?.price || 0;
//     const priceB = b?.variants?.[0]?.price || 0;

//     if (sortType === "low-high") return priceA - priceB;
//     if (sortType === "high-low") return priceB - priceA;
//     return 0;
//   });

//   // Reset filter
//   const resetFilters = () => {
//     setActiveCategory(null);
//     setActiveSub(null);
//     setSortType("relavent");
//     setShowFilter(false);
//   };

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   return (
//     <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 mt-5 px-3 relative">
//       {/* Toggle Button */}
//       <button
//         className="sm:hidden mb-4 px-4 py-2 bg-blue-600 text-white rounded"
//         onClick={() => setShowFilter(true)}
//       >
//         Filter
//       </button>

//       {/* Sidebar */}
//       <div
//         className={`${showFilter
//             ? "fixed top-17 right-0 h-full w-64 bg-white shadow-lg z-50 transform translate-x-0"
//             : "fixed top-17 right-0 h-full w-64 bg-white shadow-lg z-50 transform translate-x-full"
//           } transition-transform duration-300
//            sm:relative sm:top-auto sm:right-auto sm:h-auto sm:w-60 sm:translate-x-0 sm:shadow-none`}
//       >
//         <div className="flex justify-between items-center p-4 border-b sm:hidden">
//           <p className="font-medium">Filter</p>
//           <button
//             className="text-gray-600"
//             onClick={() => setShowFilter(false)}
//           >
//             ✕
//           </button>
//         </div>

//         <div className="p-4 flex flex-col gap-4">
//           <div>
//             <p className="mb-2 text-sm font-medium flex justify-between items-center">
//               CATEGORIES
//               <button className="text-xs text-blue-600" onClick={resetFilters}>
//                 Reset
//               </button>
//             </p>
//             <div className="flex flex-col gap-2">
//               {categories.map((cat) => (
//                 <button
//                   key={cat._id}
//                   className={`text-left ${activeCategory === cat.slug ? "font-bold" : ""
//                     }`}
//                   onClick={() => {
//                     setActiveCategory(cat.slug);
//                     setActiveSub(null);
//                     setShowFilter(false);
//                   }}
//                 >
//                   {cat.name}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div>
//             <p className="mb-2 text-sm font-medium">SUBCATEGORIES</p>
//             <div className="flex flex-col gap-2">
//               {subcategories.map((sub) => (
//                 <button
//                   key={sub._id}
//                   className={`text-left ${activeSub === sub.slug ? "font-bold" : ""
//                     }`}
//                   onClick={() => {
//                     setActiveSub(sub.slug);
//                     setShowFilter(false);
//                   }}
//                 >
//                   {sub.name}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Backdrop */}
//       {showFilter && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-30 z-40 sm:hidden"
//           onClick={() => setShowFilter(false)}
//         ></div>
//       )}

//       {/* Products Grid */}
//       <div className="flex-1">
//         <div className="flex justify-between text-base sm:text-2xl mb-4">
//           <p>ALL COLLECTION</p>
//           <select
//             className="border-2 border-gray-300 text-sm px-2"
//             onChange={(e) => {
//               setSortType(e.target.value);
//               setShowFilter(false);
//             }}
//             value={sortType}
//           >
//             <option value="relavent">Relavent</option>
//             <option value="low-high">Low-High</option>
//             <option value="high-low">High-Low</option>
//           </select>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 gap-y-3">
//           {sortedProducts.length === 0 ? (
//             <p className="w-full text-center col-span-4 text-2xl py-20">
//               NO PRODUCT FOUND
//             </p>
//           ) : (
//             sortedProducts.map((product) => (
//               <Product_Page
//                 key={product._id}
//                 categorySlug={
//                   product.subcategory?.category?.slug || product.category?.slug
//                 }
//                 productSlug={product.slug}
//                 name={product.name}
//                 price={product?.variants?.[0]?.price || product.price}
//                 images={product.images}
//               />
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Collection;

//with right tick mark
// import { useContext, useState, useEffect, useMemo } from "react";
// import { ShopContext } from "../Context/ShopContext";
// import axios from "axios";
// import Product_Page from "../component/P_Page_Component";

// const Collection = () => {
//   const { backendUrl, products } = useContext(ShopContext);

//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [activeCategory, setActiveCategory] = useState(null);
//   const [activeSub, setActiveSub] = useState(null);
//   const [sortType, setSortType] = useState("relavent");
//   const [showFilter, setShowFilter] = useState(false);
//   const [selectedColors, setSelectedColors] = useState([]);
//   const [selectedSizes, setSelectedSizes] = useState([]);

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const { data } = await axios.get(`${backendUrl}/api/categories`);
//         if (data.success) setCategories(data.categories);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchCategories();
//   }, [backendUrl]);

//   // Fetch subcategories for selected category
//   useEffect(() => {
//     if (!activeCategory) {
//       setSubcategories([]);
//       setActiveSub(null);
//       return;
//     }

//     const fetchSubcategories = async () => {
//       try {
//         const { data } = await axios.get(
//           `${backendUrl}/api/categories/${activeCategory}`
//         );
//         if (data.success) setSubcategories(data.subcategories);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchSubcategories();
//   }, [activeCategory, backendUrl]);

//   // ✅ Extract unique colors and sizes from all product variants
//   const { allColors, allSizes } = useMemo(() => {
//     const colorSet = new Set();
//     const sizeSet = new Set();

//     products.forEach((p) => {
//       p.variants?.forEach((v) => {
//         if (v.color) colorSet.add(v.color.trim());
//         if (v.size) sizeSet.add(v.size.trim());
//       });
//     });

//     return {
//       allColors: Array.from(colorSet).sort(),
//       allSizes: Array.from(sizeSet).sort(),
//     };
//   }, [products]);

//   // Filter products
//   const filteredProducts = products.filter((p) => {
//     const productCategorySlug =
//       p.subcategory?.category?.slug || p.category?.slug || null;
//     const productSubSlug = p.subcategory?.slug || null;

//     const matchesCategory = activeCategory
//       ? productCategorySlug === activeCategory
//       : true;
//     const matchesSub = activeSub ? productSubSlug === activeSub : true;

//     // ✅ Check color/size match
//     const productColors = p.variants.map((v) => v.color);
//     const productSizes = p.variants.map((v) => v.size);

//     const matchesColor =
//       selectedColors.length > 0
//         ? selectedColors.some((c) => productColors.includes(c))
//         : true;

//     const matchesSize =
//       selectedSizes.length > 0
//         ? selectedSizes.some((s) => productSizes.includes(s))
//         : true;

//     return matchesCategory && matchesSub && matchesColor && matchesSize;
//   });

//   // Sort products
//   const sortedProducts = filteredProducts.slice().sort((a, b) => {
//     const priceA = a?.variants?.[0]?.price || 0;
//     const priceB = b?.variants?.[0]?.price || 0;

//     if (sortType === "low-high") return priceA - priceB;
//     if (sortType === "high-low") return priceB - priceA;
//     return 0;
//   });

//   // Reset filter
//   const resetFilters = () => {
//     setActiveCategory(null);
//     setActiveSub(null);
//     setSelectedColors([]);
//     setSelectedSizes([]);
//     setSortType("relavent");
//     setShowFilter(false);
//   };

//   const toggleColor = (color) => {
//     setSelectedColors((prev) =>
//       prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
//     );
//   };

//   const toggleSize = (size) => {
//     setSelectedSizes((prev) =>
//       prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
//     );
//   };

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   return (
//     <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 mt-5 px-3 relative">
//       {/* Toggle Button */}
//       <button
//         className="sm:hidden mb-4 px-4 py-2 bg-blue-600 text-white rounded"
//         onClick={() => setShowFilter(true)}
//       >
//         Filter
//       </button>

//       {/* Sidebar */}
//       <div
//         className={`${
//           showFilter
//             ? "fixed top-17 right-0 h-full w-64 bg-white shadow-lg z-50 transform translate-x-0"
//             : "fixed top-17 right-0 h-full w-64 bg-white shadow-lg z-50 transform translate-x-full"
//         } transition-transform duration-300
//            sm:relative sm:top-auto sm:right-auto sm:h-auto sm:w-60 sm:translate-x-0 sm:shadow-none`}
//       >
//         <div className="flex justify-between items-center p-4 border-b sm:hidden">
//           <p className="font-medium">Filter</p>
//           <button
//             className="text-gray-600"
//             onClick={() => setShowFilter(false)}
//           >
//             ✕
//           </button>
//         </div>

//         <div className="p-4 flex flex-col gap-4">
//           {/* Categories */}
//           <div>
//             <p className="mb-2 text-sm font-medium flex justify-between items-center">
//               CATEGORIES
//               <button className="text-xs text-blue-600" onClick={resetFilters}>
//                 Reset
//               </button>
//             </p>
//             <div className="flex flex-col gap-2">
//               {categories.map((cat) => (
//                 <button
//                   key={cat._id}
//                   className={`text-left flex justify-between items-center ${
//                     activeCategory === cat.slug ? "font-bold text-blue-600" : ""
//                   }`}
//                   onClick={() => {
//                     setActiveCategory(cat.slug);
//                     setActiveSub(null);
//                     setShowFilter(false);
//                   }}
//                 >
//                   {cat.name}
//                   {activeCategory === cat.slug && <span>✔</span>}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Subcategories */}
//           <div>
//             <p className="mb-2 text-sm font-medium">SUBCATEGORIES</p>
//             <div className="flex flex-col gap-2">
//               {subcategories.map((sub) => (
//                 <button
//                   key={sub._id}
//                   className={`text-left flex justify-between items-center ${
//                     activeSub === sub.slug ? "font-bold text-blue-600" : ""
//                   }`}
//                   onClick={() => {
//                     setActiveSub(sub.slug);
//                     setShowFilter(false);
//                   }}
//                 >
//                   {sub.name}
//                   {activeSub === sub.slug && <span>✔</span>}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* ✅ Colors */}
//           <div>
//             <p className="mb-2 text-sm font-medium">COLORS</p>
//             <div className="flex flex-col gap-2">
//               {allColors.map((color) => (
//                 <button
//                   key={color}
//                   className={`text-left flex justify-between items-center ${
//                     selectedColors.includes(color)
//                       ? "font-bold text-blue-600"
//                       : ""
//                   }`}
//                   onClick={() => toggleColor(color)}
//                 >
//                   {color}
//                   {selectedColors.includes(color) && <span>✔</span>}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* ✅ Sizes */}
//           <div>
//             <p className="mb-2 text-sm font-medium">SIZES</p>
//             <div className="flex flex-col gap-2">
//               {allSizes.map((size) => (
//                 <button
//                   key={size}
//                   className={`text-left flex justify-between items-center ${
//                     selectedSizes.includes(size)
//                       ? "font-bold text-blue-600"
//                       : ""
//                   }`}
//                   onClick={() => toggleSize(size)}
//                 >
//                   {size}
//                   {selectedSizes.includes(size) && <span>✔</span>}
//                 </button>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Backdrop */}
//       {showFilter && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-30 z-40 sm:hidden"
//           onClick={() => setShowFilter(false)}
//         ></div>
//       )}

//       {/* Products Grid */}
//       <div className="flex-1">
//         <div className="flex justify-between text-base sm:text-2xl mb-4">
//           <p>ALL COLLECTION</p>
//           <select
//             className="border-2 border-gray-300 text-sm px-2"
//             onChange={(e) => {
//               setSortType(e.target.value);
//               setShowFilter(false);
//             }}
//             value={sortType}
//           >
//             <option value="relavent">Relavent</option>
//             <option value="low-high">Low-High</option>
//             <option value="high-low">High-Low</option>
//           </select>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 gap-y-3">
//           {sortedProducts.length === 0 ? (
//             <p className="w-full text-center col-span-4 text-2xl py-20">
//               NO PRODUCT FOUND
//             </p>
//           ) : (
//             sortedProducts.map((product) => (
//               <Product_Page
//                 key={product._id}
//                 categorySlug={
//                   product.subcategory?.category?.slug || product.category?.slug
//                 }
//                 productSlug={product.slug}
//                 name={product.name}
//                 price={product?.variants?.[0]?.price || product.price}
//                 images={product.images}
//               />
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Collection;

//with box tick mark...................
// import { useContext, useState, useEffect, useMemo } from "react";
// import { ShopContext } from "../Context/ShopContext";
// import axios from "axios";
// import Product_Page from "../component/P_Page_Component";

// const Collection = () => {
//   const { backendUrl, products } = useContext(ShopContext);

//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);
//   const [activeCategory, setActiveCategory] = useState(null);
//   const [activeSub, setActiveSub] = useState(null);
//   const [sortType, setSortType] = useState("relavent");
//   const [showFilter, setShowFilter] = useState(false);
//   const [selectedColors, setSelectedColors] = useState([]);
//   const [selectedSizes, setSelectedSizes] = useState([]);

//   // Fetch categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const { data } = await axios.get(`${backendUrl}/api/categories`);
//         if (data.success) setCategories(data.categories);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchCategories();
//   }, [backendUrl]);

//   // Fetch subcategories for selected category
//   useEffect(() => {
//     if (!activeCategory) {
//       setSubcategories([]);
//       setActiveSub(null);
//       return;
//     }

//     const fetchSubcategories = async () => {
//       try {
//         const { data } = await axios.get(
//           `${backendUrl}/api/categories/${activeCategory}`
//         );
//         if (data.success) setSubcategories(data.subcategories);
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchSubcategories();
//   }, [activeCategory, backendUrl]);

//   // Extract unique colors and sizes
//   const { allColors, allSizes } = useMemo(() => {
//     const colorSet = new Set();
//     const sizeSet = new Set();

//     products.forEach((p) => {
//       p.variants?.forEach((v) => {
//         if (v.color) colorSet.add(v.color.trim());
//         if (v.size) sizeSet.add(v.size.trim());
//       });
//     });

//     return {
//       allColors: Array.from(colorSet).sort(),
//       allSizes: Array.from(sizeSet).sort(),
//     };
//   }, [products]);

//   // Filter products
//   const filteredProducts = products.filter((p) => {
//     const productCategorySlug =
//       p.subcategory?.category?.slug || p.category?.slug || null;
//     const productSubSlug = p.subcategory?.slug || null;

//     const matchesCategory = activeCategory
//       ? productCategorySlug === activeCategory
//       : true;
//     const matchesSub = activeSub ? productSubSlug === activeSub : true;

//     const productColors = p.variants.map((v) => v.color);
//     const productSizes = p.variants.map((v) => v.size);

//     const matchesColor =
//       selectedColors.length > 0
//         ? selectedColors.some((c) => productColors.includes(c))
//         : true;

//     const matchesSize =
//       selectedSizes.length > 0
//         ? selectedSizes.some((s) => productSizes.includes(s))
//         : true;

//     return matchesCategory && matchesSub && matchesColor && matchesSize;
//   });

//   // Sort
//   const sortedProducts = filteredProducts.slice().sort((a, b) => {
//     const priceA = a?.variants?.[0]?.price || 0;
//     const priceB = b?.variants?.[0]?.price || 0;

//     if (sortType === "low-high") return priceA - priceB;
//     if (sortType === "high-low") return priceB - priceA;
//     return 0;
//   });

//   // Reset
//   const resetFilters = () => {
//     setActiveCategory(null);
//     setActiveSub(null);
//     setSelectedColors([]);
//     setSelectedSizes([]);
//     setSortType("relavent");
//     setShowFilter(false);
//   };

//   const toggleColor = (color) => {
//     setSelectedColors((prev) =>
//       prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
//     );
//   };

//   const toggleSize = (size) => {
//     setSelectedSizes((prev) =>
//       prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
//     );
//   };

//   useEffect(() => {
//     window.scrollTo(0, 0);
//   }, []);

//   return (
//     <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 mt-5 px-3 relative min-h-screen">
//       {/* Toggle Button */}
//       <button
//         className="sm:hidden mb-4 px-4 py-2 bg-blue-600 text-white rounded"
//         onClick={() => setShowFilter(true)}
//       >
//         Filter
//       </button>

//       {/* Sidebar */}
//       <div
//         className={`${
//           showFilter
//             ? "fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform translate-x-0"
//             : "fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform translate-x-full"
//         } transition-transform duration-300
//      sm:sticky sm:top-20 sm:h-[calc(100vh-5rem)] sm:w-60 sm:translate-x-0 sm:shadow-none`}
//       >
//         <div className="flex justify-between items-center p-4 border-b sm:hidden">
//           <p className="font-medium">Filter</p>
//           <button
//             className="text-gray-600"
//             onClick={() => setShowFilter(false)}
//           >
//             ✕
//           </button>
//         </div>

//         <div className="p-4 flex flex-col gap-6 text-sm">
//           {/* Categories */}
//           <div>
//             <div className="flex justify-between items-center mb-2">
//               <p className="font-semibold">Category</p>
//               <button className="text-xs text-blue-600" onClick={resetFilters}>
//                 Reset
//               </button>
//             </div>
//             <div className="flex flex-col gap-1">
//               {categories.map((cat) => (
//                 <label
//                   key={cat._id}
//                   className="flex items-center gap-2 cursor-pointer"
//                 >
//                   <input
//                     type="checkbox"
//                     checked={activeCategory === cat.slug}
//                     onChange={() =>
//                       setActiveCategory(
//                         activeCategory === cat.slug ? null : cat.slug
//                       )
//                     }
//                     className="accent-blue-600 w-4 h-4"
//                   />
//                   <span>{cat.name}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Subcategories */}
//           {subcategories.length > 0 && (
//             <div>
//               <p className="font-semibold mb-2">Subcategory</p>
//               <div className="flex flex-col gap-1">
//                 {subcategories.map((sub) => (
//                   <label
//                     key={sub._id}
//                     className="flex items-center gap-2 cursor-pointer"
//                   >
//                     <input
//                       type="checkbox"
//                       checked={activeSub === sub.slug}
//                       onChange={() =>
//                         setActiveSub(activeSub === sub.slug ? null : sub.slug)
//                       }
//                       className="accent-blue-600 w-4 h-4"
//                     />
//                     <span>{sub.name}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Colors */}
//           <div>
//             <p className="font-semibold mb-2">Color</p>
//             <div className="flex flex-col gap-1">
//               {allColors.map((color) => (
//                 <label
//                   key={color}
//                   className="flex items-center gap-2 cursor-pointer"
//                 >
//                   <input
//                     type="checkbox"
//                     checked={selectedColors.includes(color)}
//                     onChange={() => toggleColor(color)}
//                     className="accent-blue-600 w-4 h-4"
//                   />
//                   <span>{color}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           {/* Sizes */}
//           <div>
//             <p className="font-semibold mb-2">Size</p>
//             <div className="flex flex-col gap-1">
//               {allSizes.map((size) => (
//                 <label
//                   key={size}
//                   className="flex items-center gap-2 cursor-pointer"
//                 >
//                   <input
//                     type="checkbox"
//                     checked={selectedSizes.includes(size)}
//                     onChange={() => toggleSize(size)}
//                     className="accent-blue-600 w-4 h-4"
//                   />
//                   <span>{size}</span>
//                 </label>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Backdrop */}
//       {showFilter && (
//         <div
//           className="fixed inset-0 bg-black z-40 sm:hidden"
//           onClick={() => setShowFilter(false)}
//         ></div>
//       )}

//       {/* Products Grid */}
//       <div className="flex-1">
//         <div className="flex justify-between text-base sm:text-2xl mb-4">
//           <p>ALL COLLECTION</p>
//           <select
//             className="border-2 border-gray-300 text-sm px-2 rounded-md"
//             onChange={(e) => setSortType(e.target.value)}
//             value={sortType}
//           >
//             <option value="relavent">Relavent</option>
//             <option value="low-high">Low-High</option>
//             <option value="high-low">High-Low</option>
//           </select>
//         </div>

//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 gap-y-3">
//           {sortedProducts.length === 0 ? (
//             <p className="w-full text-center col-span-4 text-2xl py-20">
//               NO PRODUCT FOUND
//             </p>
//           ) : (
//             sortedProducts.map((product) => (
//               <Product_Page
//                 key={product._id}
//                 categorySlug={
//                   product.subcategory?.category?.slug || product.category?.slug
//                 }
//                 productSlug={product.slug}
//                 name={product.name}
//                 price={product?.variants?.[0]?.price || product.price}
//                 images={product.images}
//               />
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Collection;

import { useContext, useState, useEffect, useMemo } from "react";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";
import Product_Page from "../component/P_Page_Component";

const Collection = () => {
  const { backendUrl, products } = useContext(ShopContext);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSub, setActiveSub] = useState(null);
  const [sortType, setSortType] = useState("relavent");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/categories`);
        if (data.success) setCategories(data.categories);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, [backendUrl]);

  // Fetch subcategories for selected category
  useEffect(() => {
    if (!activeCategory) {
      setSubcategories([]);
      setActiveSub(null);
      return;
    }

    const fetchSubcategories = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/categories/${activeCategory}`
        );
        if (data.success) setSubcategories(data.subcategories);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSubcategories();
  }, [activeCategory, backendUrl]);

  // Extract unique colors and sizes
  const { allColors, allSizes } = useMemo(() => {
    const colorSet = new Set();
    const sizeSet = new Set();

    products.forEach((p) => {
      p.variants?.forEach((v) => {
        if (v.color) colorSet.add(v.color.trim());
        if (v.size) sizeSet.add(v.size.trim());
      });
    });

    return {
      allColors: Array.from(colorSet).sort(),
      allSizes: Array.from(sizeSet).sort(),
    };
  }, [products]);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const productCategorySlug =
      p.subcategory?.category?.slug || p.category?.slug || null;
    const productSubSlug = p.subcategory?.slug || null;

    const matchesCategory = activeCategory
      ? productCategorySlug === activeCategory
      : true;
    const matchesSub = activeSub ? productSubSlug === activeSub : true;

    const productColors = p.variants.map((v) => v.color);
    const productSizes = p.variants.map((v) => v.size);

    const matchesColor =
      selectedColors.length > 0
        ? selectedColors.some((c) => productColors.includes(c))
        : true;

    const matchesSize =
      selectedSizes.length > 0
        ? selectedSizes.some((s) => productSizes.includes(s))
        : true;

    return matchesCategory && matchesSub && matchesColor && matchesSize;
  });

  // Sort
  const sortedProducts = filteredProducts.slice().sort((a, b) => {
    const priceA = a?.variants?.[0]?.price || 0;
    const priceB = b?.variants?.[0]?.price || 0;

    if (sortType === "low-high") return priceA - priceB;
    if (sortType === "high-low") return priceB - priceA;
    return 0;
  });

  // Reset
  const resetFilters = () => {
    setActiveCategory(null);
    setActiveSub(null);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSortType("relavent");
    setShowFilter(false);
  };

  const toggleColor = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 mt-5 px-3 relative min-h-screen">
      {/* Toggle Button */}
      <button
        className="sm:hidden mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => setShowFilter(true)}
      >
        Filter
      </button>

      {/* Sidebar wrapper for sticky */}
      <div className="sm:sticky sm:top-20 sm:self-start">
        {/* Sidebar */}
        <div
          className={`${
            showFilter
              ? "fixed top-17 right-0 h-full w-64 bg-white shadow-lg z-50 transform translate-x-0"
              : "fixed top-17 right-0 h-full w-64 bg-white shadow-lg z-50 transform translate-x-full"
          } transition-transform duration-300
           sm:relative sm:top-auto sm:right-auto sm:h-auto sm:w-60 sm:translate-x-0 sm:shadow-none`}
        >
          <div className="flex justify-between items-center p-4 border-b sm:hidden">
            <p className="font-medium">Filter</p>
            <button
              className="text-gray-600"
              onClick={() => setShowFilter(false)}
            >
              ✕
            </button>
          </div>

          <div className="p-4 flex flex-col gap-6 text-sm">
            {/* Categories */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold">Category</p>
                <button
                  className="text-xs text-blue-600"
                  onClick={resetFilters}
                >
                  Reset
                </button>
              </div>
              <div className="flex flex-col gap-1">
                {categories.map((cat) => (
                  <label
                    key={cat._id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={activeCategory === cat.slug}
                      onChange={() =>
                        setActiveCategory(
                          activeCategory === cat.slug ? null : cat.slug
                        )
                      }
                      className="accent-blue-600 w-4 h-4"
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Subcategories */}
            {subcategories.length > 0 && (
              <div>
                <p className="font-semibold mb-2">Subcategory</p>
                <div className="flex flex-col gap-1">
                  {subcategories.map((sub) => (
                    <label
                      key={sub._id}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={activeSub === sub.slug}
                        onChange={() =>
                          setActiveSub(activeSub === sub.slug ? null : sub.slug)
                        }
                        className="accent-blue-600 w-4 h-4"
                      />
                      <span>{sub.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Colors */}
            <div>
              <p className="font-semibold mb-2">Color</p>
              <div className="flex flex-col gap-1">
                {allColors.map((color) => (
                  <label
                    key={color}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedColors.includes(color)}
                      onChange={() => toggleColor(color)}
                      className="accent-blue-600 w-4 h-4"
                    />
                    <span>{color}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <p className="font-semibold mb-2">Size</p>
              <div className="flex flex-col gap-1">
                {allSizes.map((size) => (
                  <label
                    key={size}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSizes.includes(size)}
                      onChange={() => toggleSize(size)}
                      className="accent-blue-600 w-4 h-4"
                    />
                    <span>{size}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {showFilter && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 sm:hidden"
          onClick={() => setShowFilter(false)}
        ></div>
      )}

      {/* Products Grid */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <p>ALL COLLECTION</p>
          <select
            className="border-2 border-gray-300 text-sm px-2 rounded-md"
            onChange={(e) => setSortType(e.target.value)}
            value={sortType}
          >
            <option value="relavent">Relavent</option>
            <option value="low-high">Low-High</option>
            <option value="high-low">High-Low</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 gap-y-3">
          {sortedProducts.length === 0 ? (
            <p className="w-full text-center col-span-4 text-2xl py-20">
              NO PRODUCT FOUND
            </p>
          ) : (
            sortedProducts.map((product) => (
              <Product_Page
                key={product._id}
                categorySlug={
                  product.subcategory?.category?.slug || product.category?.slug
                }
                productSlug={product.slug}
                name={product.name}
                price={product?.variants?.[0]?.price || product.price}
                images={product.images}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
