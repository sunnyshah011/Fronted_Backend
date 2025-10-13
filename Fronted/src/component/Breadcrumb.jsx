// import { Link, useLocation } from "react-router-dom";
// import { useEffect, useState, useContext } from "react";
// import axios from "axios";
// import { ShopContext } from "../Context/ShopContext";

// const Breadcrumbs = () => {
//   const { backendUrl } = useContext(ShopContext);
//   const location = useLocation();
//   const pathname = location.pathname;
//   const paths = pathname.split("/").filter((x) => x);
//   const sign = ">"

//   const [productName, setProductName] = useState("");

//   // Fetch product name if URL has productId
//   useEffect(() => {
//     const fetchProductName = async () => {
//       if (paths[0] === "product" && paths[1]) {
//         try {
//           const res = await axios.get(
//             `${backendUrl}/api/product/single/${paths[1]}`
//           );
//           setProductName(res.data.product.name);
//         } catch (err) {
//           console.log(err);
//         }
//       }
//     };
//     fetchProductName();
//   }, [pathname, backendUrl]); // use pathname to detect URL change

//   if (pathname === "/") return null;

//   return (
//     <nav className="mt-23 px-4 text-sm text-gray-600" aria-label="breadcrumb">
//       <ol className="flex items-center space-x-2 flex-wrap">
//         {/* Home */}
//         <li>
//           <Link to="/" className="hover:text-blue-600 font-medium">
//             Home
//           </Link>
//         </li>

//         {paths.map((name, index) => {
//           const routeTo = "/" + paths.slice(0, index + 1).join("/");
//           const isLast = index === paths.length - 1;

//           // Replace productId with productName
//           let displayName = name;
//           if (paths[0] === "product" && index === 1) {
//             displayName = productName || "Loading...";
//           }

//           // Hide intermediate paths on very small screens
//           const hideOnSmall =
//             index !== paths.length - 1 && index !== 0 ? "hidden sm:inline" : "";

//           return (
//             <li key={index} className={`flex items-center space-x-2 ${hideOnSmall}`}>
//               <span className="text-gray-400">{sign}</span>
//               {isLast ? (
//                 <span className="text-gray-500 truncate max-w-[110px] sm:max-w-[250px] md:max-w-[400px] lg:max-w-[800px]">
//                 {/* <span className="line-clamp-1"> */}
//                   {displayName}
//                 </span>
//               ) : (
//                 <Link
//                   to={routeTo}
//                   className="hover:text-blue-600 capitalize font-medium truncate max-w-[100px] sm:max-w-[150px] md:max-w-[250px]"
//                 >
//                   {displayName}
//                 </Link>
//               )}
//             </li>
//           );
//         })}
//       </ol>
//     </nav>
//   );
// };

// export default Breadcrumbs;
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../Context/ShopContext";

const Breadcrumbs = () => {
  const { backendUrl } = useContext(ShopContext);
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const paths = pathname.split("/").filter((x) => x);
  const sign = ">";

  const [productName, setProductName] = useState("");
  const [categories, setCategories] = useState([]);

  // Fetch product name if URL has productId
  useEffect(() => {
    const fetchProductName = async () => {
      if (paths[0] === "product" && paths[1]) {
        try {
          const res = await axios.get(
            `${backendUrl}/api/product/single/${paths[1]}`
          );
          setProductName(res.data.product.name);
        } catch (err) {
          console.log(err);
        }
      }
    };
    fetchProductName();
  }, [pathname, backendUrl]);

  // Fetch all categories to match slug
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/categories`);
        if (res.data.success) setCategories(res.data.categories);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategories();
  }, [backendUrl]);

  if (pathname === "/") return null;

  return (
    <nav className="mt-23 px-4 text-sm text-gray-600" aria-label="breadcrumb">
      <ol className="flex items-center space-x-2 flex-wrap">
        {/* Home */}
        <li>
          <Link to="/" className="hover:text-blue-600 font-medium">
            Home
          </Link>
        </li>

        {paths.map((name, index) => {
          const isLast = index === paths.length - 1;

          let displayName = name;
          let routeTo = "/" + paths.slice(0, index + 1).join("/");

          // Main "categories" route → redirect to /collection
          if (name === "categories") {
            displayName = "collection";
            routeTo = "/collection";
          }

          // Specific category clickable
          if (categories.length > 0) {
            const categoryMatch = categories.find((cat) => cat.slug === name);
            if (categoryMatch) {
              displayName = categoryMatch.name;
              routeTo = `/collection?category=${categoryMatch.slug}`;
            }
          }

          // Product ID → display product name
          if (paths[0] === "product" && index === 1) {
            displayName = productName || "Loading...";
          }

          const hideOnSmall =
            index !== paths.length - 1 && index !== 0 ? "hidden sm:inline" : "";

          return (
            <li
              key={index}
              className={`flex items-center space-x-2 ${hideOnSmall}`}
            >
              <span className="text-gray-400">{sign}</span>
              {isLast ? (
                <span className="text-gray-500 truncate max-w-[110px] sm:max-w-[250px] md:max-w-[400px] lg:max-w-[800px]">
                  {displayName}
                </span>
              ) : (
                <span
                  onClick={() => navigate(routeTo)}
                  className="hover:text-blue-600 capitalize font-medium truncate max-w-[150px] cursor-pointer"
                >
                  {displayName}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
