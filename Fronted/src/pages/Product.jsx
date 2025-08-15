import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import { assets } from "../assets/frontend_assets/assets";

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addtocart } = useContext(ShopContext);
  const [fproduct, setfproduct] = useState(null);
  const [image, setimage] = useState("");
  const [size, setsize] = useState("");

  const filterproduct = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setfproduct(item);
        setimage(item.image[0]);
        return null;
      }
    });
  };

  useEffect(() => {
    filterproduct();
  }, [productId, products]);

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])


  return fproduct ? (
    <div className="transition-opacity ease-in duration-500 opacity-100 mt-25 px-4">
      {/* product data */}
      <div className="flex gap-4 sm:gap-12 flex-col sm:flex-row mb-[100px]">
        {/* product images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row items-center">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-center gap-5 sm:justify-normal sm:w-[17%] w-[90%] ">
            {fproduct.image.map((item, index) => (
              <img
                onClick={() => setimage(item)}
                src={item}
                key={index}
                className={`w-[20%] rounded-[10px] sm:w-full flex-shrink-o cursor-pointer ${item === image ? "border border-red-600" : ""
                  } `}
              />
            ))}
          </div>
          {/* <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto rounded-2xl" src={image} alt="" />
          </div> */}
          <div className="w-full sm:w-[80%] aspect-square overflow-hidden rounded-[16px]">
            <img
              src={image}
              alt="Product"
              className="w-full h-full object-cover object-top"
            />
          </div>

        </div>

        {/* product info */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{fproduct.name}</h1>
          <div className="flex gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_icon} alt="" className="w-3" />
            <img src={assets.star_icon} alt="" className="w-3" />
          </div>

          <p className="mt-5 text-3xl font-medium">
            {" "}
            {currency} {fproduct.price}{" "}
          </p>
          <p className="mt-5 text-gray-500 md:4/5">{fproduct.description}</p>
          <div className="flex flex-col gap-4 my-8">
            <p>select size</p>
            <div className="flex gap-2">
              {fproduct.sizes.map((item, index) => (
                <button
                  className={`py-2 px-4 bg-blue-50 ${item === size ? "bg-blue-600 text-white" : ""
                    } `}
                  key={index}
                  onClick={() => setsize(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <button onClick={() => addtocart(fproduct._id, size)} className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700 w-40">
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="mt-50 text-2xl"> Retry </div>
  );
};

export default Product;
