import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { Link } from "react-router-dom";

const Product_Page = ({ categorySlug, productSlug, name, price, images }) => {
  const { currency } = useContext(ShopContext);
  return (
    <Link
      className="text-gray-700 cursor-pointer rounded-b-[6px]  bg-white block"
      to={`/categories/${categorySlug}/${productSlug}`}
    >
      <div className="w-full aspect-square overflow-hidden rounded-xl bg-white flex items-center justify-center">
        <img
          src={images[0]}
          alt={name}
          className="max-w-full max-h-full object-contain"
        />
      </div>
      <p className="pt-5 pb-1 pl-2 text-sm line-clamp-1">{name}</p>
      <p className="pl-2 mt-2 pb-3 text-[18px] font-semibold truncate">
        {currency} {price} /-
      </p>
    </Link>
  );
};

export default Product_Page;

