import { useContext, useState, useEffect, useMemo } from "react";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";
import Product_Page from "../component/P_Page_Component";
import { useLocation, useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categorySlug = params.get("category");
    if (categorySlug) {
      setActiveCategory(categorySlug);
    }
  }, [location.search]);

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

  // useEffect(() => {
  //   if (!activeCategory) {
  //     setSubcategories([]);
  //     setActiveSub(null);
  //     return;
  //   }

  //   // reset old subcategory when category changes
  //   setActiveSub(null);

  //   const fetchSubcategories = async () => {
  //     try {
  //       const { data } = await axios.get(
  //         `${backendUrl}/api/categories/${activeCategory}`
  //       );
  //       if (data.success) setSubcategories(data.subcategories);
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   };
  //   fetchSubcategories();
  // }, [activeCategory, backendUrl]);

  useEffect(() => {
    if (!activeCategory) {
      setSubcategories([]);
      setActiveSub(null);
      return; // ✅ Prevent API call when no category
    }

    setActiveSub(null);

    (async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/categories/${activeCategory}`
        );
        if (data.success) setSubcategories(data.subcategories);
      } catch (err) {
        console.error("Failed to fetch subcategories:", err);
      }
    })();
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

  // Filter Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const productCategorySlug =
        p.subcategory?.category?.slug || p.category?.slug || null;
      const productSubSlug = p.subcategory?.slug || null;

      const matchesCategory = activeCategory
        ? productCategorySlug === activeCategory
        : true;
      const matchesSub = activeSub ? productSubSlug === activeSub : true;

      const productColors = p.variants?.map((v) => v.color) || [];
      const productSizes = p.variants?.map((v) => v.size) || [];

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
  }, [products, activeCategory, activeSub, selectedColors, selectedSizes]);

  //Sort Products
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      const priceA = a?.variants?.[0]?.price || 0;
      const priceB = b?.variants?.[0]?.price || 0;
      if (sortType === "low-high") return priceA - priceB;
      if (sortType === "high-low") return priceB - priceA;
      return 0;
    });
  }, [filteredProducts, sortType]);

  // Reset
  const resetFilters = () => {
    setActiveCategory(null);
    setActiveSub(null);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSortType("relavent");
    setShowFilter(false);

    const params = new URLSearchParams(location.search);
    params.delete("category");
    navigate({ search: params.toString() });
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
              ? "fixed top-18 right-0 h-full w-64 bg-white shadow-lg z-50 transform translate-x-0"
              : "fixed top-18 right-0 h-full w-64 bg-white shadow-lg z-50 transform translate-x-full"
          } transition-transform duration-300
           sm:relative sm:top-auto sm:right-auto sm:h-auto sm:w-60 sm:translate-x-0 sm:shadow-none overflow-y-auto pb-100`}
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
                      onChange={() => {
                        const newCategory =
                          activeCategory === cat.slug ? null : cat.slug;
                        setActiveCategory(newCategory);

                        const params = new URLSearchParams(location.search);
                        if (newCategory) {
                          params.set("category", newCategory);
                        } else {
                          params.delete("category");
                        }
                        navigate({ search: params.toString() });

                        // 👇 Close sidebar on mobile
                        if (window.innerWidth < 640) {
                          setShowFilter(false);
                        }
                      }}
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
                        onChange={() => {
                          setActiveSub(
                            activeSub === sub.slug ? null : sub.slug
                          );

                          // 👇 Close sidebar on mobile
                          if (window.innerWidth < 640) {
                            setShowFilter(false);
                          }
                        }}
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
