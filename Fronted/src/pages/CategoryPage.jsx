import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../Context/ShopContext";

const CategoryPage = () => {
  const { categorySlug } = useParams(); 
  const { backendUrl } = useContext(ShopContext);

  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeSub, setActiveSub] = useState(null);

  const fetchCategoryData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/categories/${categorySlug}`
      );
      if (data.success) {
        setCategory(data.category);
        setSubcategories(data.subcategories || []);
        setProducts(data.products || []);
        if (data.subcategories.length > 0) {
          setActiveSub(data.subcategories[0]._id);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategoryData();
  }, [categorySlug]);

  const filteredProducts = activeSub
    ? products.filter((p) => p.subcategory === activeSub)
    : products;

  return (
    <div className="p-4">
      {category && <h2 className="text-2xl font-bold mb-4">{category.name}</h2>}

      <div className="flex gap-3 mb-5">
        {subcategories.map((sub) => (
          <button
            key={sub._id}
            className={`px-4 py-2 rounded-md ${
              activeSub === sub._id ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveSub(sub._id)}
          >
            {sub.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((prod) => (
            <div
              key={prod._id}
              className="border p-3 rounded-lg shadow-sm hover:shadow-md"
            >
              <img
                src={prod.images[0]}
                alt={prod.name}
                className="w-full h-40 object-cover rounded-md"
              />
              <h3 className="font-semibold mt-2">{prod.name}</h3>
              <p className="text-gray-600">${prod.price}</p>
            </div>
          ))
        ) : (
          <p>No products found in this subcategory.</p>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
