// import { useContext, useState, useEffect } from "react";
// import { ShopContext } from "../Context/ShopContext";
// import { assets } from "../assets/frontend_assets/assets";
// import Product_Page from "../component/Product_Page";

// const Collection = () => {
//   const { products } = useContext(ShopContext);
//   const [showFilter, setShowFilter] = useState(false);
//   const [filterProducts, setFilterProducts] = useState([]);
//   const [category, setcategory] = useState([]);
//   const [subcategory, setsubcategory] = useState([]);
//   const [sortType, setsortType] = useState("relavent");

//   const togglecategory = (e) => {
//     if (category.includes(e.target.value)) {
//       setcategory((pre) => pre.filter((item) => item !== e.target.value));
//     } else {
//       setcategory((pre) => [...pre, e.target.value]);
//     }
//   };

//   const subtogglecategory = (e) => {
//     if (subcategory.includes(e.target.value)) {
//       setsubcategory((pre) => pre.filter((item) => item !== e.target.value));
//     } else {
//       setsubcategory((pre) => [...pre, e.target.value]);
//     }
//   };

//   // resetallfilter
//   const resetcategory = () => {
//     setcategory([]);
//     setsubcategory([]);
//     setsortType("relavent");
//   };

//   // loading data base on filter
//   const applyfilter = () => {
//     let productscopy = products.slice();
//     if (category.length > 0) {
//       productscopy = productscopy.filter((item) =>
//         category.includes(item.category)
//       );
//     }

//     if (subcategory.length > 0) {
//       productscopy = productscopy.filter((item) =>
//         subcategory.includes(item.subCategory)
//       );
//     }
//     setFilterProducts(productscopy);
//   };

//   const sortproduct = () => {
//     let fpcopy = filterProducts.slice();

//     switch (sortType) {
//       case "low-high":
//         setFilterProducts(fpcopy.sort((a, b) => a.price - b.price));
//         break;
//       case "high-low":
//         setFilterProducts(fpcopy.sort((a, b) => b.price - a.price));
//         break;
//       default:
//         applyfilter();
//         break;
//     }
//   };

//   useEffect(() => {
//     applyfilter();
//   }, [category, subcategory,products]);

//   useEffect(() => {
//     sortproduct();
//   }, [sortType]);

//     useEffect(() => {
//     window.scrollTo(0, 0)
//   }, [])

//   return (
//     <div className=" flex flex-col sm:flex-row gap-1 sm:gap-10 mt-5 px-3">
//       {/* Filter Options */}
//       <div className="min-w-60">
//         <p
//           onClick={() => setShowFilter((pre) => !pre)}
//           className="my-2 text-xl flex items-center cursor-pointer gap-2"
//         >
//           FILTERS
//           <img
//             className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
//             src={assets.dropdown_icon}
//           />
//         </p>
//         {/* Category Filer */}
//         <div
//           className={` border border-gray-300 pl-5 py-3 mt-6 ${
//             showFilter ? "" : "hidden"
//           } sm:block`}
//         >
//           <p className="mb-3 text-sm font-medium">CATEGORIES</p>
//           <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
//             <p className="flex gap-2 text-sm font-medium">
//               <input
//                 type="checkbox"
//                 className="w-3"
//                 value={"Men"}
//                 checked={category.includes("Men")}
//                 onChange={togglecategory}
//               />
//               CATEGORY 1
//             </p>
//             <p className="flex gap-2 text-sm font-medium">
//               <input
//                 type="checkbox"
//                 className="w-3"
//                 value={"Women"}
//                 checked={category.includes("Women")}
//                 onChange={togglecategory}
//               />
//               CATEGORY 2
//             </p>
//             <p className="flex gap-2 text-sm font-medium">
//               <input
//                 className="w-3"
//                 type="checkbox"
//                 value={"Kids"}
//                 checked={category.includes("Kids")}
//                 onChange={togglecategory}
//               />
//               CATEGORY 3
//             </p>
//           </div>
//         </div>
//         {/* subCategory Filter */}
//         <div
//           className={` border border-gray-300 pl-5 py-3 my-5 ${
//             showFilter ? "" : "hidden"
//           } sm:block`}
//         >
//           <p className="mb-3 text-sm font-medium">SUB CATEGORIES</p>
//           <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
//             <p className="flex gap-2 text-sm font-medium">
//               <input
//                 type="checkbox"
//                 className="w-3"
//                 value={"Topwear"}
//                 checked={subcategory.includes("Topwear")}
//                 onChange={subtogglecategory}
//               />
//               SUB CATEGORY 1
//             </p>
//             <p className="flex gap-2 text-sm font-medium">
//               <input
//                 type="checkbox"
//                 className="w-3"
//                 value={"Bottomwear"}
//                 checked={subcategory.includes("Bottomwear")}
//                 onChange={subtogglecategory}
//               />
//               SUB CATEGORY 2
//             </p>
//             <p className="flex gap-2 text-sm font-medium">
//               <input
//                 className="w-3"
//                 type="checkbox"
//                 value={"Winterwear"}
//                 checked={subcategory.includes("Winterwear")}
//                 onChange={subtogglecategory}
//               />
//               SUB CATEGORY 3
//             </p>
//           </div>
//         </div>
//         <div
//           className="border-1 text-center mx-5 cursor-pointer"
//           onClick={resetcategory}
//         >
//           RESET FILTER
//         </div>
//       </div>

//       {/* Right Side */}
//       <div className="flex-1">
//         <div className="flex justify-between text-base sm:text-2xl mb-4">
//           <p>ALL COLLECTION</p>
//           {/* Product Sort */}
//           <select
//             className="border-2 border-gray-300 text-sm px-2"
//             onChange={(e) => setsortType(e.target.value)}
//           >
//             <option value="relavent">Relavent</option>
//             <option value="low-high">Low-High</option>
//             <option value="high-low">High-Low</option>
//           </select>
//         </div>

//         {/* Map Products */}
//         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 gap-y-3">
//           {filterProducts.length <= 0 ? (
//             <div className="w-full min-[100px]:col-span-4 text-center pt-30 pb-30 text-2xl">
//               <p>NO PRODUCT FOUND</p>
//             </div>
//           ) : (
//             filterProducts.map((item, index) => (
//               <Product_Page
//                 key={index}
//                 id={item._id}
//                 name={item.name}
//                 price={item.price}
//                 images={item.images}
//               />
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Collection;

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

//   // Fetch all categories on mount
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const { data } = await axios.get(`${backendUrl}/api/categories`);
//         if (data.success) {
//           setCategories(data.categories);
//           if (data.categories.length > 0) {
//             setActiveCategory(data.categories[0].slug);
//           }
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchCategories();
//   }, [backendUrl]);

//   // Fetch subcategories for selected category
//   useEffect(() => {
//     if (!activeCategory) return;
//     const fetchSubcategories = async () => {
//       try {
//         const { data } = await axios.get(
//           `${backendUrl}/api/categories/${activeCategory}`
//         );
//         if (data.success) {
//           setSubcategories(data.subcategories);
//           if (data.subcategories.length > 0) {
//             setActiveSub(data.subcategories[0].slug);
//           } else {
//             setActiveSub(null);
//           }
//         }
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchSubcategories();
//   }, [activeCategory, backendUrl]);

//   // ✅ Filter products by category + subcategory (safe check for ObjectId or populated)
//   const filteredProducts = products.filter((p) => {
//     // Get category & subcategory slug safely
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
//     const priceA = a?.variants?.[0]?.price || 0; // fallback to 0 if undefined
//     const priceB = b?.variants?.[0]?.price || 0;

//     if (sortType === "low-high") return priceA - priceB;
//     if (sortType === "high-low") return priceB - priceA;
//     return 0; // default / relevant
//   });

//   return (
//     <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 mt-5 px-3">
//       {/* Filter Sidebar */}
//       <div className="min-w-60">
//         <p className="mb-3 text-sm font-medium">CATEGORIES</p>
//         <div className="flex flex-col gap-2">
//           {categories.map((cat) => (
//             <button
//               key={cat._id}
//               className={`text-left ${
//                 activeCategory === cat.slug ? "font-bold" : ""
//               }`}
//               onClick={() => setActiveCategory(cat.slug)}
//             >
//               {cat.name}
//             </button>
//           ))}
//         </div>

//         <p className="mb-3 text-sm font-medium mt-5">SUBCATEGORIES</p>
//         <div className="flex flex-col gap-2">
//           {subcategories.map((sub) => (
//             <button
//               key={sub._id}
//               className={`text-left ${
//                 activeSub === sub.slug ? "font-bold" : ""
//               }`}
//               onClick={() => setActiveSub(sub.slug)}
//             >
//               {sub.name}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* Products Grid */}
//       <div className="flex-1">
//         <div className="flex justify-between text-base sm:text-2xl mb-4">
//           <p>ALL COLLECTION</p>
//           <select
//             className="border-2 border-gray-300 text-sm px-2"
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
//             <p className="w-full text-center text-2xl py-20">
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

//    useEffect(() => {
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
//         className={`fixed top-17 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
//           showFilter ? "translate-x-0" : "translate-x-full"
//         } sm:relative sm:translate-x-0 sm:flex sm:flex-col min-w-60`}
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
//               <button
//                 className="text-xs text-blue-600"
//                 onClick={resetFilters}
//               >
//                 Reset
//               </button>
//             </p>
//             <div className="flex flex-col gap-2">
//               {categories.map((cat) => (
//                 <button
//                   key={cat._id}
//                   className={`text-left ${
//                     activeCategory === cat.slug ? "font-bold" : ""
//                   }`}
//                   onClick={() => {
//                     setActiveCategory(cat.slug);
//                     setActiveSub(null);
//                     setShowFilter(false); // close sidebar on select
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
//                   className={`text-left ${
//                     activeSub === sub.slug ? "font-bold" : ""
//                   }`}
//                   onClick={() => {
//                     setActiveSub(sub.slug);
//                     setShowFilter(false); // close sidebar on select
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
//               setShowFilter(false); // auto-close sidebar
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
//             <p className="w-full text-center text-2xl py-20">
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



import { useContext, useState, useEffect } from "react";
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

  // Filter products
  const filteredProducts = products.filter((p) => {
    const productCategorySlug =
      p.subcategory?.category?.slug || p.category?.slug || null;
    const productSubSlug = p.subcategory?.slug || null;

    const matchesCategory = activeCategory
      ? productCategorySlug === activeCategory
      : true;
    const matchesSub = activeSub ? productSubSlug === activeSub : true;

    return matchesCategory && matchesSub;
  });

  // Sort products
  const sortedProducts = filteredProducts.slice().sort((a, b) => {
    const priceA = a?.variants?.[0]?.price || 0;
    const priceB = b?.variants?.[0]?.price || 0;

    if (sortType === "low-high") return priceA - priceB;
    if (sortType === "high-low") return priceB - priceA;
    return 0;
  });

  // Reset filter
  const resetFilters = () => {
    setActiveCategory(null);
    setActiveSub(null);
    setSortType("relavent");
    setShowFilter(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 mt-5 px-3 relative">
      {/* Toggle Button */}
      <button
        className="sm:hidden mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => setShowFilter(true)}
      >
        Filter
      </button>

      {/* Sidebar */}
      <div
        className={`${showFilter
            ? "fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform translate-x-0"
            : "fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform translate-x-full"
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

        <div className="p-4 flex flex-col gap-4">
          <div>
            <p className="mb-2 text-sm font-medium flex justify-between items-center">
              CATEGORIES
              <button className="text-xs text-blue-600" onClick={resetFilters}>
                Reset
              </button>
            </p>
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  className={`text-left ${activeCategory === cat.slug ? "font-bold" : ""
                    }`}
                  onClick={() => {
                    setActiveCategory(cat.slug);
                    setActiveSub(null);
                    setShowFilter(false);
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">SUBCATEGORIES</p>
            <div className="flex flex-col gap-2">
              {subcategories.map((sub) => (
                <button
                  key={sub._id}
                  className={`text-left ${activeSub === sub.slug ? "font-bold" : ""
                    }`}
                  onClick={() => {
                    setActiveSub(sub.slug);
                    setShowFilter(false);
                  }}
                >
                  {sub.name}
                </button>
              ))}
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
            className="border-2 border-gray-300 text-sm px-2"
            onChange={(e) => {
              setSortType(e.target.value);
              setShowFilter(false);
            }}
            value={sortType}
          >
            <option value="relavent">Relavent</option>
            <option value="low-high">Low-High</option>
            <option value="high-low">High-Low</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 gap-y-3">
          {sortedProducts.length === 0 ? (
            <p className="w-full text-center text-2xl py-20">
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
