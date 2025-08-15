import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../Context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";
import Product_Page from "../component/Product_Page";

const Collection = () => {
  const { products } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setcategory] = useState([]);
  const [subcategory, setsubcategory] = useState([]);
  const [sortType, setsortType] = useState("relavent");

  const togglecategory = (e) => {
    if (category.includes(e.target.value)) {
      setcategory((pre) => pre.filter((item) => item !== e.target.value));
    } else {
      setcategory((pre) => [...pre, e.target.value]);
    }
  };

  const subtogglecategory = (e) => {
    if (subcategory.includes(e.target.value)) {
      setsubcategory((pre) => pre.filter((item) => item !== e.target.value));
    } else {
      setsubcategory((pre) => [...pre, e.target.value]);
    }
  };

  // resetallfilter
  const resetcategory = () => {
    setcategory([]);
    setsubcategory([]);
    setsortType("relavent");
  };

  // loading data base on filter
  const applyfilter = () => {
    let productscopy = products.slice();
    if (category.length > 0) {
      productscopy = productscopy.filter((item) =>
        category.includes(item.category)
      );
    }

    if (subcategory.length > 0) {
      productscopy = productscopy.filter((item) =>
        subcategory.includes(item.subCategory)
      );
    }
    setFilterProducts(productscopy);
  };

  const sortproduct = () => {
    let fpcopy = filterProducts.slice();

    switch (sortType) {
      case "low-high":
        setFilterProducts(fpcopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts(fpcopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyfilter();
        break;
    }
  };

  useEffect(() => {
    applyfilter();
  }, [category, subcategory]);

  useEffect(() => {
    sortproduct();
  }, [sortType]);

    useEffect(() => {
    window.scrollTo(0, 0)
  }, [])


  return (
    <div className=" flex flex-col sm:flex-row gap-1 sm:gap-10 mt-20 px-3">
      {/* Filter Options */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter((pre) => !pre)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
          />
        </p>
        {/* Category Filer */}
        <div
          className={` border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2 text-sm font-medium">
              <input
                type="checkbox"
                className="w-3"
                value={"Men"}
                checked={category.includes("Men")}
                onChange={togglecategory}
              />
              CATEGORY 1
            </p>
            <p className="flex gap-2 text-sm font-medium">
              <input
                type="checkbox"
                className="w-3"
                value={"Women"}
                checked={category.includes("Women")}
                onChange={togglecategory}
              />
              CATEGORY 2
            </p>
            <p className="flex gap-2 text-sm font-medium">
              <input
                className="w-3"
                type="checkbox"
                value={"Kids"}
                checked={category.includes("Kids")}
                onChange={togglecategory}
              />
              CATEGORY 3
            </p>
          </div>
        </div>
        {/* subCategory Filter */}
        <div
          className={` border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium">SUB CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2 text-sm font-medium">
              <input
                type="checkbox"
                className="w-3"
                value={"Topwear"}
                checked={subcategory.includes("Topwear")}
                onChange={subtogglecategory}
              />
              SUB CATEGORY 1
            </p>
            <p className="flex gap-2 text-sm font-medium">
              <input
                type="checkbox"
                className="w-3"
                value={"Bottomwear"}
                checked={subcategory.includes("Bottomwear")}
                onChange={subtogglecategory}
              />
              SUB CATEGORY 2
            </p>
            <p className="flex gap-2 text-sm font-medium">
              <input
                className="w-3"
                type="checkbox"
                value={"Winterwear"}
                checked={subcategory.includes("Winterwear")}
                onChange={subtogglecategory}
              />
              SUB CATEGORY 3
            </p>
          </div>
        </div>
        <div
          className="border-1 text-center mx-5 cursor-pointer"
          onClick={resetcategory}
        >
          RESET FILTER
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <p>ALL COLLECTION</p>
          {/* Product Sort */}
          <select
            className="border-2 border-gray-300 text-sm px-2"
            onChange={(e) => setsortType(e.target.value)}
          >
            <option value="relavent">Relavent</option>
            <option value="low-high">Low-High</option>
            <option value="high-low">High-Low</option>
          </select>
        </div>

        {/* Map Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 gap-y-3">
          {filterProducts.length <= 0 ? (
            <div className="w-full min-[100px]:col-span-4 text-center pt-30 pb-30 text-2xl">
              <p>NO PRODUCT FOUND</p>
            </div>
          ) : (
            filterProducts.map((item, index) => (
              <Product_Page
                key={index}
                id={item._id}
                name={item.name}
                price={item.price}
                image={item.image}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
