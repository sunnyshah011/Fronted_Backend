// import { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { ShopContext } from "../Context/ShopContext";
// import { Link } from "react-router-dom";

// const CategoryPageGroup = () => {
//   const { backendUrl } = useContext(ShopContext);

//   const [category, setCategory] = useState([]); // ✅ start with empty array

//   const fetchCategoryData = async () => {
//     try {
//       const { data } = await axios.get(`${backendUrl}/api/categories`);
//       if (data.success) {
//         setCategory(data.categories);
//       } else {
//         console.log("error");
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     fetchCategoryData();
//   }, []);

//   return (
//     <div>
//       <h3>Category Page</h3>
//       {category.length > 0 ? (
//         category.map((item, index) => (
//           <Link to={`/categories/${item.slug}`}  key={item._id}>
//             <div className="p-5 cursor-pointer">
//               <p>{item.slug}</p>
//             </div>
//           </Link>
//         ))
//       ) : (
//         <p>Loading categories...</p>
//       )}
//     </div>
//   );
// };

// export default CategoryPageGroup;

import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../Context/ShopContext";
import { Link } from "react-router-dom";

const CategoryPageGroup = () => {
  const { backendUrl } = useContext(ShopContext);
  const [category, setCategory] = useState([]);

  const fetchCategoryData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/categories`);
      if (data.success) {
        setCategory(data.categories);
      } else {
        console.log("Error fetching categories");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  return (
    <div className="container mx-auto px-2 py-5">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 ">
       Shop by Category
      </h3>

      {category.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {category.map((item) => (
            <Link
              to={`/categories/${item.slug}`}
              key={item._id}
              className="block"
            >
              <div className="bg-white overflow-hidden transform hover:scale-105 transition duration-300 cursor-pointer">
                <div className="p-3 pb-0">
                  <img
                    src={item.image}
                    alt={item.slug}
                    className="w-full h-full aspect-square object-contain"
                  />
                </div>

                <div className="md:p-4 p-1 text-center">
                  <p className="text-lg font-semibold text-gray-700 capitalize">
                    {item.slug.replace("-", " ")}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">Loading categories...</p>
      )}
    </div>
  );
};

export default CategoryPageGroup;
