import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../Context/ShopContext";

const CategoryPageGroup = () => {
  const { backendUrl } = useContext(ShopContext);

  const [category, setCategory] = useState([]); // ✅ start with empty array

  const fetchCategoryData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/categories`);
      if (data.success) {
        setCategory(data.categories);
      } else {
        console.log("error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, []);

  return (
    <div>
      <h3>Category Page</h3>
      {category.length > 0 ? (
        category.map((item, index) => (
          <div key={index} className="p-5 cursor-pointer">
            <p>{item.slug}</p>
          </div>
        ))
      ) : (
        <p>Loading categories...</p>
      )}
    </div>
  );
};

export default CategoryPageGroup;
