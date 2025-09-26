import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-300 py-10 mt-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo + About */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">FTS</h2>
          <p className="text-sm leading-6 text-gray-800">
            Your one-stop destination for quality products at the best prices. 
            Shop with trust and experience hassle-free delivery.
          </p>
        </div>

        {/* Product Categories */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Categories</h3>
          <ul className="space-y-2">
            <li className="hover:text-gray-900 cursor-pointer text-gray-600">Electronics</li>
            <li className="hover:text-gray-900 cursor-pointer text-gray-600">Fashion</li>
            <li className="hover:text-gray-900 cursor-pointer text-gray-600">Groceries</li>
            <li className="hover:text-gray-900 cursor-pointer text-gray-600">Home & Living</li>
            <li className="hover:text-gray-900 cursor-pointer text-gray-600">Health & Beauty</li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-900 text-blue-900">
              <FaFacebookF size={20} />
            </a>
            <a href="#" className="hover:text-blue-900 text-blue-900">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="hover:text-blue-900 text-blue-900">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="hover:text-blue-900 text-blue-900">
              <FaLinkedinIn size={20} />
            </a>
            <a href="#" className="hover:text-blue-900 text-blue-900">
              <FaYoutube size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Khushi Bazar. All Rights Reserved. | Privacy Policy
      </div>
    </footer>
  );
};

export default Footer;
