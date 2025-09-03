import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addtocart } = useContext(ShopContext);

  const [fproduct, setfproduct] = useState(null);
  const [image, setimage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  // find product
  const filterproduct = () => {
    const found = products.find((item) => item._id === productId);
    if (found) {
      setfproduct(found);
      setimage(found.images[0]);
    }
  };

  useEffect(() => {
    filterproduct();
  }, [productId, products]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // handle quantity safely
  const handleQuantity = (type) => {
    if (type === "inc" && quantity < fproduct.stock) {
      setQuantity((prev) => prev + 1);
    } else if (type === "dec" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return fproduct ? (
    <div className="transition-opacity ease-in duration-500 opacity-100 mt-5 px-4">
      <div className="flex gap-6 sm:gap-12 flex-col sm:flex-row mb-[100px]">
        {/* product images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row items-center">
          {/* thumbnails */}
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-center gap-4 sm:justify-normal sm:w-[17%] w-[90%]">
            {fproduct.images &&
              fproduct.images.map((item, index) => (
                <img
                  onClick={() => setimage(item)}
                  src={item}
                  key={index}
                  alt="thumb"
                  className={`w-[22%] rounded-lg sm:w-full flex-shrink-0 cursor-pointer hover:opacity-80 transition ${
                    item === image ? "border-2 border-red-600" : "border"
                  }`}
                />
              ))}
          </div>

          {/* main image */}
          <div className="w-full sm:w-[80%] aspect-square overflow-hidden rounded-xl shadow-md">
            <img
              src={image}
              alt="Product"
              className="w-full h-full object-cover object-top"
            />
          </div>
        </div>

        {/* product info */}
        <div className="flex-1 space-y-4">
          <h1 className="font-semibold text-2xl mt-2">{fproduct.name}</h1>

          {/* rating dummy */}
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <img key={i} src={assets.star_icon} alt="star" className="w-4" />
            ))}
          </div>

          {/* price */}
          <p className="text-3xl font-bold">
            {currency} {fproduct.price}
          </p>

          {/* description */}
          <p className="text-gray-600 leading-relaxed">
            {fproduct.description}
          </p>

          {/* stock info */}
          <p
            className={`text-sm font-medium ${
              fproduct.stock > 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            Stock: {fproduct.stock > 0 ? fproduct.stock : "Out of stock"}
          </p>

          {/* attributes (sizes with unit) */}
          {fproduct.attributes && fproduct.attributes.length > 0 && (
            <div>
              <p className="font-medium mb-2">Select Size</p>
              <div className="flex gap-2 flex-wrap">
                {fproduct.attributes.map((attr, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedSize(attr.value)}
                    className={`px-4 py-2 border rounded-lg transition ${
                      selectedSize === attr.value
                        ? "bg-black text-white"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {attr.value}{" "}
                    {attr.unit && (
                      <span className="text-gray-500 text-sm">
                        ({attr.unit})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* colors */}
          {fproduct.colors && fproduct.colors.length > 0 && (
            <div>
              <p className="font-medium mb-2">Select Color</p>
              <div className="flex gap-2 flex-wrap">
                {fproduct.colors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(color.trim())}
                    className={`px-4 py-2 border rounded-lg transition ${
                      selectedColor === color.trim()
                        ? "bg-black text-white"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* quantity selector */}
          <div className="flex items-center gap-4 mt-4">
            <button
              onClick={() => handleQuantity("dec")}
              className="w-10 h-10 flex items-center justify-center border rounded-lg hover:bg-gray-100"
            >
              -
            </button>
            <span className="text-lg font-medium">{quantity}</span>
            <button
              onClick={() => handleQuantity("inc")}
              className="w-10 h-10 flex items-center justify-center border rounded-lg hover:bg-gray-100"
            >
              +
            </button>
          </div>

          {/* add to cart */}
          <button
            onClick={() =>
              addtocart(fproduct._id, selectedSize, selectedColor, quantity)
            }
            disabled={fproduct.stock <= 0}
            className={`mt-6 px-8 py-3 text-sm w-full sm:w-40 rounded-xl shadow-md transition ${
              fproduct.stock > 0
                ? "bg-black text-white hover:bg-gray-800"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
          >
            {fproduct.stock > 0 ? "ADD TO CART" : "OUT OF STOCK"}
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="mt-50 text-2xl">Retry</div>
  );
};

export default Product;
