import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { useNavigate } from "react-router-dom";
import CategoryLoader from "./CategoryLoader";

const Main_Category = () => {
  const { categories, isLoading, isError } = useContext(ShopContext);
  const navigate = useNavigate();

  if (isError)
    return (
      <div className="text-center text-sm text-red-500 py-4">
        Error fetching categories
      </div>
    );

  return (
    <div className="bg-white pt-3 pb-2">
      {isLoading ? (
        <CategoryLoader />
      ) : (
        <>
          <div className="flex justify-between px-3">
            <h3 className="font-medium text-[18px] text-gray-800">All Category</h3>
            <p
              onClick={() => navigate(`/collection`)}
              className="cursor-pointer font-medium text-[18px] text-gray-800"
            >
              View All
            </p>
          </div>

          {categories.length > 0 ? (
            <div className="container mx-auto px-5 lg:px-15 my-5 grid grid-cols-3 md:grid-cols-6 lg:grid-cols-6 lg:gap-20 md:gap-10 gap-7">
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
                    <p className="max-[768px]:text-[13.5px] text-center max-[768px]:font-medium md:text-[18px] font-medium pt-3 text-gray-800">
                      {" "}
                      {cat.name}{" "}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm flex justify-center items-center py-5">
              Server Maintenance
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Main_Category;
