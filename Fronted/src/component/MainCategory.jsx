import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { useNavigate } from "react-router-dom";
import CategoryLoader from "./CategoryLoader";

const Main_Category = () => {
  const { categories, loading, isError } = useContext(ShopContext);
  const navigate = useNavigate();

  if (isError)
    return (
      <div className="text-center text-sm text-red-500 py-4">
        Error fetching categories
      </div>
    );

  return (
    <div className="bg-white pt-3 pb-1">
      {loading ? (
        <CategoryLoader /> // 👈 show shimmer while fetching
      ) : (
        <>
          <div className="flex justify-between px-3">
            <h3 className="font-semibold text-sm">All Category</h3>
            <p
              onClick={() => navigate(`/collection`)}
              className="cursor-pointer font-semibold text-sm"
            >
              View All
            </p>
          </div>

          {categories.length > 0 ? (
            <div className="container mx-auto px-3 my-3 grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="flex flex-col items-center"
                  onClick={() => navigate(`/collection?category=${cat.slug}`)}
                >
                  <div>
                    <img
                      src={cat.image}
                      className="w-full h-full aspect-square object-scale-down"
                    />
                  </div>
                  <div>
                    <p className="max-[768px]:text-[12px] text-center max-[768px]:font-medium md:text-[16px] font-normal ">
                      {" "}
                      {cat.name}{" "}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm flex justify-center items-center py-5">Server Maintenance</p>
          )}
        </>
      )}
    </div>
  );
};

export default Main_Category;

// import { useContext } from "react";
// import { ShopContext } from "../Context/ShopContext";
// import { useNavigate } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import axios from "axios";
// import CategoryLoader from "./CategoryLoader";

// const fetchCategories = async (backendUrl) => {
//   const { data } = await axios.get(`${backendUrl}/api/categories`);
//   if (data.success) return data.categories;
//   if (Array.isArray(data.categories)) return data.categories.slice(0, 10);
//   return [];
// };

// const Main_Category = () => {
//   const { backendUrl } = useContext(ShopContext);
//   const navigate = useNavigate();

//   const {
//     data: categories = [],
//     isLoading,
//     isError,
//     error,
//   } = useQuery({
//     queryKey: ["categories"],
//     queryFn: () => fetchCategories(backendUrl),
//     staleTime: 1000 * 60 * 10, // ✅ 10 minutes caching
//     cacheTime: 1000 * 60 * 30, // ✅ keep cached data for 30 mins
//     refetchOnWindowFocus: false, // ✅ prevent refetch on tab focus
//     retry: 1, // ✅ one retry only
//   });

//   if (isLoading) return <CategoryLoader />;
//   if (isError)
//     return (
//       <div className="text-center text-sm text-red-500 py-4">
//         Error fetching categories: {error.message}
//       </div>
//     );

//   return (
//     <div className="bg-white py-2">
//       <div className="flex justify-between px-3">
//         <h3 className="font-semibold text-sm">All Category</h3>
//         <p
//           onClick={() => navigate(`/collection`)}
//           className="cursor-pointer font-semibold text-sm"
//         >
//           View All
//         </p>
//       </div>

//       {categories.length > 0 ? (
//         <div className="container mx-auto px-3 my-1 grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3">
//           {categories.map((cat) => (
//             <div
//               key={cat._id}
//               className="flex flex-col items-center"
//               onClick={() => navigate(`/collection?category=${cat.slug}`)}
//             >
//               <div>
//                 <img
//                   src={cat.image}
//                   className="w-full h-full aspect-square object-scale-down"
//                   alt={cat.name}
//                 />
//               </div>
//               <div>
//                 <p className="max-[768px]:text-[12px] text-center max-[768px]:font-medium md:text-[16px] font-normal ">
//                   {cat.name}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-gray-500 text-sm text-center py-3">
//           No categories found.
//         </p>
//       )}
//     </div>
//   );
// };

// export default Main_Category;
