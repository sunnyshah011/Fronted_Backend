// import { useContext, useEffect, useState } from "react";
// import { ShopContext } from "../Context/ShopContext";
// import { Link } from "react-router-dom";
// import axios from "axios";
// import Title from "./Title";
// import Product_Page from "./P_Page_Component";
// import SkeletonCard from "./SkeletonCard"; // adjust the path if needed

// const TopProducts = () => {
//   const { backendUrl } = useContext(ShopContext);
//   const [topProducts, setTopProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!backendUrl) return; // wait until backendUrl is available

//     const fetchTopProducts = async () => {
//       setLoading(true);
//       setError(null);

//       try {
//         const res = await axios.get(`${backendUrl}/api/product/top-products`);

//         if (!res.data.success) throw new Error(res.data.message);
//         setTopProducts(res.data.products || []);
//       } catch (err) {
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTopProducts();
//   }, [backendUrl]); // 🔹 run when backendUrl becomes available

//   if (!backendUrl)
//     return <p className="text-center py-5">Preparing top products...</p>;

//   if (loading)
//     return (
//       <div className="w-full px-2 py-1">
//         <Link to="all-top-products">
//           <Title Category="Top Products" More="View" />
//         </Link>

//         <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-y-2 gap-x-2">
//           {Array.from({ length: 6 }).map((_, idx) => (
//             <SkeletonCard key={idx} />
//           ))}
//         </div>
//       </div>
//     );

//   if (error)
//     return (
//       <p className="text-center text-red-500 py-5">
//         Failed to load top products: {error.message}
//       </p>
//     );

//   if (!topProducts || topProducts.length === 0)
//     return (
//       <p className="text-center py-5 text-gray-500">No top products found.</p>
//     );

//   return (
//     <div className="w-full px-2 py-1">
//       <Link to="all-top-products">
//         <Title Category="Top Products" More="View" />
//       </Link>

//       <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-y-2 gap-x-2">
//         {topProducts.map((product) => (
//           <Product_Page
//             key={product._id}
//             categorySlug={product.subcategory?.category?.slug}
//             productSlug={product.slug}
//             name={product.name}
//             price={product.variants?.[0]?.price}
//             images={product.images}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TopProducts;

import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { Link } from "react-router-dom";
import Title from "./Title";
import Product_Page from "./P_Page_Component";
import SkeletonCard from "./SkeletonCard";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchTopProducts = async (backendUrl) => {
  const res = await axios.get(`${backendUrl}/api/product/top-products`);
  if (!res.data.success) throw new Error(res.data.message);
  return res.data.products || [];
};

const TopProducts = () => {
  const { backendUrl } = useContext(ShopContext);

  const {
    data: topProducts = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["topProducts"],
    queryFn: () => fetchTopProducts(backendUrl),
    enabled: !!backendUrl, // fetch only if backendUrl exists
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
    cacheTime: 1000 * 60 * 30, // keep cache for 30 minutes
    refetchOnWindowFocus: false, // prevent unnecessary refetch
  });

  if (!backendUrl)
    return <p className="text-center py-5">Preparing top products...</p>;

  if (isLoading)
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

  if (isError)
    return (
      <p className="text-center text-red-500 py-5">
        Failed to load top products: {error.message}
      </p>
    );

  if (!topProducts || topProducts.length === 0)
    return (
      <p className="text-center py-5 text-gray-500">No top products found.</p>
    );

  return (
    <div className="w-full px-2 py-1">
      <Link to="all-top-products">
        <Title Category="Top Products" More="View" />
      </Link>

      <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-y-2 gap-x-2">
        {topProducts.map((product) => (
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

export default TopProducts;
