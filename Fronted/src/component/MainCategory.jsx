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
import { assets } from "../assets/frontend_assets/assets";

const P_Category = () => {
  const { backendUrl } = useContext(ShopContext);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const fetchCategory = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/categories`);

      if (data.success) {
        setCategories(data.categories);
      } else if (Array.isArray(data.categories)) {
        setCategories(data.categories.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <div className="bg-white py-2">
      <div className="flex justify-between px-3">
        <h3 className="font-semibold text-sm" >All Category</h3>
        <p
          onClick={() => navigate(`/categories`)}
          className="cursor-pointer font-semibold text-sm"
        >
          View All
        </p>
      </div>

      {categories.length > 0 ? (
        <div className="container mx-auto px-3 my-1 grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="w-full h-full scale-90 p-1 rounded"
              onClick={() => navigate(`/categories/${cat.slug}`)} // navigate on click
            >
              <div>
                <img
                  src={cat.image}
                  className="w-full h-full object-scale-down"
                />
                <p> {cat.name} </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No categories found.</p>
      )}
    </div>
  );
};

export default P_Category;
