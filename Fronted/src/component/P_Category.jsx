// import { useContext, useState } from 'react';
// import Title from './Title';
// import { ShopContext } from '../Context/ShopContext';
// import { useEffect } from 'react';
// import { Link } from 'react-router-dom';

// const P_Category = () => {

//   const { products } = useContext(ShopContext)
//   const [p_image, setimage] = useState([])

//   useEffect(() => {
//     if (products.length > 0) {
//       setimage(products.slice(0, 6))
//     }
//   }, [products])  // <- Watch for products update

//   return (
//     <div className="w-full mt-4 mb-7 px-2">
//       <Link to='/collection' >
//         <Title Category="Category" More="View All" />
//       </Link>

//       {p_image.length >= 4 ? (
//         <div className="mt-5 grid gap-3 px-1 grid-cols-2 sm:grid-cols-2 lg:grid-cols-6">
//           {p_image.map((item, index) => (
//             <div
//               key={index}
//               className="relative group aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
//             >
//               <img
//                 src={item.images[0]}
//                 alt={item.name || "Product"}
//                 className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-110"
//               />

//               {/* Overlay */}
//               <div className="absolute inset-0 text-center bg-black bg-opacity-30 flex flex-col justify-center items-center opacity-0 group-hover:opacity-30 transition-opacity duration-300">
//                 <p className="bg-black bg-opacity-60 text-white text-sm font-medium px-4 py-1 rounded-full mb-1">
//                   Category
//                 </p>
//                 <p className="text-white font-semibold text-lg">
//                   {item.name || "Product"}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <p className="text-center mt-6 text-gray-500">Loading...</p>
//       )}
//     </div>
//   )

// }

// export default P_Category;
import { useEffect, useState, useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const P_Category = () => {
  const { backendUrl } = useContext(ShopContext);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const fetchCategory = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/categories`);
      console.log("API response:", data);

      if (data.success) {
        setCategories(data.categories);
      } else if (Array.isArray(data.categories)) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <div className="p-3 bg-white rounded-lg shadow">
      <h3 className="font-bold mb-2 text-lg">Categories</h3>

      {categories.length > 0 ? (
        <ul className="space-y-1">
          {categories.map((cat) => (
            <li
              key={cat._id}
              className="text-gray-700 hover:text-black cursor-pointer"
              onClick={() => navigate(`/category/${cat.slug}`)} // navigate on click
            >
              {cat.name}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">No categories found.</p>
      )}
    </div>
  );
};

export default P_Category;
