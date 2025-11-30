import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { Link } from "react-router-dom";

const Product_Page_flashsale = ({ categorySlug, productSlug, name, price, images }) => {
  const { currency } = useContext(ShopContext);
  return (
    <Link
      className="text-gray-700 cursor-pointer rounded-md bg-white block max-[600px]:border max-[600px]:border-gray-100"
      to={`/categories/${categorySlug}/${productSlug}`}
    >
      <div className="p-2 w-full aspect-square overflow-hidden rounded-md  bg-white flex items-center justify-center">
        <img
          src={images[0]}
          alt={name}
          className="max-w-full max-h-full object-contain"
        />
      </div>

      <p className="pt-4 mb-1 pl-3 text-[14px] line-clamp-1 text-black">{name}</p>

      <div className="flex items-center pl-3 mt-2 pb-1 mb-3">
        <div className="text-[18px] truncate font-medium text-gray-700 ">
          <span className="text-[15px]">{currency}</span>{price} /-
        </div>
        <div className="text-[10px] font-medium ml-3 bg-red-50 w-fit p-0.5 px-1.5 rounded-md text-red-500">
          10% OFF
        </div>
      </div>
      {/* <div className="ml-3 mb-3 text-sm text-gray-500">
        7 sold
      </div> */}
    </Link>
  );
};

export default Product_Page_flashsale;

