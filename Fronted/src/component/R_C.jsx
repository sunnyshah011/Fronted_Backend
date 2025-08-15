import { useContext, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import Title from './Title'
import Product_Page from "./Product_Page";
import { useEffect } from "react";

const R_C = () => {

  const { products } = useContext(ShopContext)
  const [R_L_Product, setproduct] = useState([])

useEffect(() => {
  if (products.length > 0) {
    setproduct(products.slice(18, 22))
  }
}, [products])  // <- Watch for products update

  return (
    <div className="w-full p-3 mt-5">

      <Title Category="R_C" More="View" />

      <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-y-3 gap-x-2">
        {R_L_Product.map((product, index) => (
          <Product_Page id={product._id} key={index} name={product.name} price={product.price} image={product.image} />
        ))}
      </div>
    </div>
  );
};

export default R_C;
