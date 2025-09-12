import { useContext, useEffect, useState } from "react";
import { ShopContext } from "../Context/ShopContext";
import Title from "./Title";
import Product_Page from "./P_Page_Component";

const R_D = () => {

  const { products } = useContext(ShopContext);
  const [R_D_product, setproduct] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      setproduct(products.slice(0, 4));
    }
  }, [products]); // <- Watch for products update

  return (
    <div className="w-full p-3">
      <Title Category="Flash Sale" More="View" />

      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-y-3 gap-x-2">
        {R_D_product.map((product, index) => (
          <Product_Page
          key={index}
            id={product._id}
            name={product.name}
            price={product.price}
            images={product.images}
          />
        ))}
      </div>
    </div>
  );
};

export default R_D;
