import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../Context/ShopContext";
import Title from "../component/Title";
import Product_Page from "../component/P_Page_Component";
import { Link } from "react-router-dom";

const AllTopProducts = () => {
  const { products } = useContext(ShopContext);
  const [topProduct, setProduct] = useState([]);

  useEffect(() => {
    if (products?.length > 0) {
      // ✅ filter only products with isTopProduct true
      const filtered = products.filter((p) => p?.isTopProduct);
      setProduct(filtered); // take all products which tick as toproduct while adding
    }
  }, [products]);

  return (
    <div className="w-full px-2 py-1">
      <Link to="all-top-products">
        <Title Category="Top Products" More="" />
      </Link>

      <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-y-2 gap-x-2">
        {topProduct.map((product) => (
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

export default AllTopProducts;
