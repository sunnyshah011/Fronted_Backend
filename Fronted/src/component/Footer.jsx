import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaFacebookF, FaYoutube, FaTiktok } from "react-icons/fa";
import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";

const Footer = () => {
  const { backendUrl } = useContext(ShopContext); // Use your backend URL from context
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/categories`);
        if (data.success) setCategories(data.categories);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, [backendUrl]);

  const handleCategoryClick = (slug) => {
    navigate(`/collection?category=${slug}`);
  };

  return (
    <footer className="bg-white text-gray-300 py-10 mt-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo + About */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Fishing Tackle Store</h2>
          <p className="text-sm leading-6 text-gray-800">
            Your one-stop destination for quality products at the best prices. 
            Shop with trust and experience hassle-free delivery.
          </p>
        </div>

        {/* Product Categories */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Categories</h3>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li
                key={cat._id}
                className="hover:text-gray-900 cursor-pointer text-gray-600"
                onClick={() => handleCategoryClick(cat.slug)}
              >
                {cat.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Follow Us On:</h3>
          <div className="flex space-x-4">
            <a
              href="https://www.facebook.com/FishingTackleStoreNGT"
              className="hover:text-blue-900 text-blue-900"
              target="_blank"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="https://www.tiktok.com/@fishingtacklestore"
              className="hover:text-blue-900 text-blue-900"
              target="_blank"
            >
              <FaTiktok size={20} />
            </a>
            <a
              href="https://www.youtube.com/@fishingtacklestore4519"
              className="hover:text-blue-900 text-blue-900"
              target="_blank"
            >
              <FaYoutube size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-300 mt-8 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Fishing Tackle Store. All Rights Reserved. | Privacy Policy
      </div>
    </footer>
  );
};

export default Footer;
