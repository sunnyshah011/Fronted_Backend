import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { ShopContext } from "../Context/ShopContext";
import { useContext } from "react";

const Breadcrumbs = () => {
  const { backendUrl } = useContext(ShopContext);
  const location = useLocation();
  const pathname = location.pathname;
  const paths = pathname.split("/").filter((x) => x);

  const [productName, setProductName] = useState("");

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
  }, [paths, backendUrl]);

  if (pathname === "/") return null;

  return (
    <nav className="bg-gray-50 mt-17 border-b border-gray-200 py-2 px-4 text-sm text-gray-600">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className="hover:text-blue-600 font-medium">
            Home
          </Link>
        </li>

        {paths.map((name, index) => {
          const routeTo = "/" + paths.slice(0, index + 1).join("/");
          const isLast = index === paths.length - 1;

          // Replace productId with productName
          if (paths[0] === "product" && index === 1) {
            return (
              <li key={index} className="flex items-center space-x-2">
                <span className="text-gray-400">/</span>
                <span className="text-gray-500 truncate max-w-[110px] min-[320px]:max-w-[170px] min-[350px]:max-w-[190px] sm:max-w-[400px] md:max-w-[400px] lg:max-w-[700px]">
                  {productName || "Loading..."}
                </span>
              </li>
            );
          }

          return (
            <li key={index} className="flex items-center space-x-2">
              <span className="text-gray-400">/</span>
              {isLast ? (
                <span className="text-gray-500 capitalize">{name}</span>
              ) : (
                <Link
                  to={routeTo}
                  className="hover:text-blue-600 capitalize font-medium"
                >
                  {name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
