import { useEffect, useState, useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import CategoryLoader from "./CategoryLoader";

const Main_Category = () => {
  const { backendUrl } = useContext(ShopContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // 👈 added
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
    } finally {
      setLoading(false); // 👈 always stop loading
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <div className="bg-white py-2">
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
            <div className="container mx-auto px-3 my-1 grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-3">
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
                    <p className="max-[768px]:text-[12px] text-center max-[768px]:font-medium md:text-[17px] font-normal ">
                      {" "}
                      {cat.name}{" "}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No categories found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Main_Category;
