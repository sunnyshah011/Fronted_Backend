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
      <div className="aspect-square overflow-hidden rounded-t-[6px]">
        <img
          src={images[0]}
          alt={name}
          className="w-full h-full object-cover object-top bottom-0 hover:opacity-90 transition ease-in-out"
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
