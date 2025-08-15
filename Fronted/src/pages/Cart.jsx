import { useContext, useState, useEffect } from "react";
import { ShopContext } from "../Context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";
import CartTotal from "../component/CartTotal";
import { Link } from "react-router-dom";

const Cart = () => {
  const { products, currency, cartitem, updateQuantity,navigate } =
    useContext(ShopContext);

  const [cartdata, setcartdata] = useState([]);

  useEffect(() => {
    const tempdata = [];
    for (const items in cartitem) {
      for (const item in cartitem[items]) {
        if (cartitem[items][item] > 0) {
          tempdata.push({
            _id: items,
            size: item,
            quantity: cartitem[items][item],
          });
        }
      }
    }
    setcartdata(tempdata);
  }, [cartitem]);

    useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="mt-20 px-4">
      <div className="text-[22px] font-medium mb-2">My Cart</div>

      <div>
        {cartdata.map((item, index) => {
          const productdata = products.find(
            (product) => product._id === item._id
          );

          return (
            <div
              key={`${item._id}-${item.size}`}
              className="py-3 border-t-1 text-gray-700 border-gray-400 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
            >
              <div className="flex items-start gap-6">
                <Link to={`/product/${item._id}`}>
                <img
                  className="w-16 sm:w-20"
                  src={productdata.image[0]}
                  alt=""
                />
                </Link>
                <div>
                  <p className="text-[13px] sm:text-lg font-medium">
                    {productdata.name}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <p className="text-[15px]">
                      {currency} {productdata.price}
                    </p>
                    <p className="px-1 sm:px-3 sm:py-1 text-[13px] border border-gray-300 bg-slate-50">
                      Size : {item.size}
                    </p>
                  </div>
                </div>
              </div>
              <input
                type="number"
                min={1}
                value={item.quantity} // controlled
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= 1) {
                    updateQuantity(item._id, item.size, val);
                  }
                }}
                className="border max-w-12 sm:max-w-20 px-1 sm:px-2 border-gray-300"
              />

              <img
                onClick={() => updateQuantity(item._id, item.size, 0)}
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                src={assets.bin_icon}
                alt=""
                srcSet=""
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          <CartTotal />
          <div className="w-full text-end">
            <button onClick={()=>navigate('./placeorder')} className="bg-black text-white text-sm my-8 px-8 py-3" >PROCEED TO CHECKOUT</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
