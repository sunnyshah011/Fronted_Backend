import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import { Link } from "react-router-dom";
import Title from "./Title";
import Product_Page from "./P_Page_Component";
import axios from "axios";
import SkeletonCard from "./SkeletonCard"; // adjust the path if needed

const AllProducts = () => {
  const { backendUrl } = useContext(ShopContext);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!backendUrl) return;

    const fetchTop30Products = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          `${backendUrl}/api/product/top-30-products`
        );
        if (!res.data.success) throw new Error(res.data.message);

        setAllProducts(res.data.products || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTop30Products();
  }, [backendUrl]);

  if (!backendUrl)
    return <p className="text-center py-5">Preparing products...</p>;
  if (loading)
    return (
      <div className="w-full px-2 py-1">
        <Link to="all-top-products">
          <Title Category="Top Products" More="View" />
        </Link>

        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-y-2 gap-x-2">
          {Array.from({ length: 6 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      </div>
    );
  if (error)
    return (
      <p className="text-center text-red-500 py-5">
        Failed to load products: {error.message}
      </p>
    );
  if (!allProducts || allProducts.length === 0)
    return <p className="text-center py-5 text-gray-500">No products found.</p>;

  return (
    <div className="w-full px-2 pt-10">
      <Title Category="All Products" More="" />

      <div className="mt-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-y-2 gap-x-2">
        {allProducts.map((product) => (
          <Product_Page
            key={product._id}
            categorySlug={product.subcategory?.category?.slug}
            productSlug={product.slug}
            name={product.name}
            price={product.variants?.[0]?.price}
            images={product.images}
          />
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
