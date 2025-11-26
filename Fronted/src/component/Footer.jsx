import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaFacebookF, FaYoutube, FaTiktok, FaInstagram} from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";

const Footer = () => {
  const { backendUrl } = useContext(ShopContext);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

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
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* Logo + About */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <img
              src="/favicon.png"
              alt="Fishing Tackle Store Logo"
              className="w-12 sm:w-16 border rounded-full shadow-sm"
            />
            <h2 className="text-[27px] sm:text-[33px] font-semibold text-gray-800 tracking-wide">
              Fishing Tackle Store
            </h2>
          </div>
          <p className="text-[15px] leading-6 text-gray-600 tracking-[0.2px]">
            Your one-stop destination for quality fishing products at the best
            prices. Shop with trust and enjoy fast, hassle-free delivery.
          </p>
        </div>

        {/* Product Categories */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4 tracking-wide flex gap-1">
             <MdCategory size={22} className="text-gray-700" /> Product Categories
          </h3>

          <ul className="space-y-2 pl-1">
            {categories.map((cat) => (
              <li
                key={cat._id}
                className="cursor-pointer text-gray-800 hover:text-blue-900 font-medium transition-all duration-200 tracking-[0.3px] text-xl"
                onClick={() => handleCategoryClick(cat.slug)}
              >
                • {cat.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-6 tracking-wide flex justify-center">
            Follow Us On:
          </h3>
          <div className="flex justify-center space-x-10">
            <a
              href="https://www.facebook.com/FishingTackleStoreNGT"
              className="hover:text-blue-700 text-blue-900 transition-all duration-200"
              target="_blank"
            >
              <FaFacebookF size={25} />
            </a>
            <a
              href="https://www.instagram.com/fishingtacklestore_ngt"
              className="hover:text-pink-600 text-pink-700 transition-all duration-200"
              target="_blank"
            >
              <FaInstagram size={25} />
            </a>
            <a
              href="https://www.tiktok.com/@fishingtacklestore"
              className="hover:text-gray-800 text-gray-900 transition-all duration-200"
              target="_blank"
            >
              <FaTiktok size={25} />
            </a>
            <a
              href="https://www.youtube.com/@fishingtacklestore4519"
              className="hover:text-red-700 text-red-800 transition-all duration-200"
              target="_blank"
            >
              <FaYoutube size={25} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 pt-5 pb-2 text-center text-sm text-gray-500 tracking-wide">
        © {new Date().getFullYear()} Fishing Tackle Store. All Rights Reserved.
        <span className="mx-2">|</span>
        Privacy Policy
      </div>
    </footer>
  );
};

export default Footer;
