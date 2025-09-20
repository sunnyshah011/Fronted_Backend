import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../Context/ShopContext";
import Title from "./Title";
import Product_Page from "./P_Page_Component";

const AllProducts = () => {
  const { products } = useContext(ShopContext);
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    if (products?.length > 0) {
      // ✅ Sort: best selling products first
      const sorted = [...products].sort((a, b) => {
        if (a.isBestSelling === b.isBestSelling) return 0;
        return a.isBestSelling ? -1 : 1;
      });
      setAllProducts(sorted);
    }
  }, [products]);

  return (
    <div className="w-full px-2 py-10">
      <Title Category="All Products" More="" />

      <div className="mt-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-y-2 gap-x-2">
        {allProducts.map((product) => (
          <Product_Page
            key={product?._id}
            categorySlug={product?.subcategory?.category?.slug}
            productSlug={product?.slug}
            name={product?.name}
            price={product?.variants?.[0]?.price}
            images={product?.images}
          />
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
