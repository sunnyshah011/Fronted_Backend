import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../Context/ShopContext";

const SubCategoryPage = () => {
  const { categorySlug, subSlug } = useParams();
  const { backendUrl } = useContext(ShopContext);

  const [subcategory, setSubcategory] = useState(null);
  const [products, setProducts] = useState([]);

  const fetchSubCategoryData = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/categories/${categorySlug}/${subSlug}`
      );
      if (data.success) {
        setSubcategory(data.subcategory);
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSubCategoryData();
  }, [categorySlug, subSlug]);

  return (
    <div className="p-4">
      {subcategory && (
        <h2 className="text-2xl font-bold mb-4">{subcategory.name}</h2>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.length > 0 ? (
          products.map((prod) => (
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

export default SubCategoryPage;
