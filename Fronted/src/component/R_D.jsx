import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import Title from "./Title";
import Product_Page from "./Product_Page";

const R_D = () => {

  const { products } = useContext(ShopContext);
  const [R_D_product, setproduct] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      setproduct(products.slice(0, 4));
    }
  }, [products]); // <- Watch for products update

  return (
    <div className="w-full p-3 mt-5">
      <Title Category="R_D" More="View" />

      <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-y-3 gap-x-2">
        {R_D_product.map((product, index) => (
          <Product_Page
          key={index}
            id={product._id}
            name={product.name}
            price={product.price}
            image={product.image}
          />
        ))}
      </div>
    </div>
  );
};

export default R_D;
