import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../Context/ShopContext";
import Title from "./Title";
import Product_Page from "./P_Page_Component";

const AllProducts = () => {
  const { products } = useContext(ShopContext);
  const [recentProducts, setRecentProducts] = useState([]);

  useEffect(() => {
    if (products && products.length > 0) {
      setRecentProducts(products.slice(0, 6));
    }
  }, [products]);

  return (
    <div className="w-full p-3">
      <Title Category="All Products" More="View" />

      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-y-3 gap-x-2">
        {recentProducts.length > 0 ? (
          recentProducts.map((product) => (
            <Product_Page
              key={product._id}
              categorySlug={product.subcategory?.category?.slug}
              productSlug={product.slug}
              name={product.name}
              price={product.price}
              images={product.images}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products found
          </p>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
