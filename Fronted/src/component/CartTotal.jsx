// import { useContext } from "react"
// import { ShopContext } from "../Context/ShopContext"

// const CartTotal = () => {
//     const { currency, delivery_fee, calculatetotalamount } = useContext(ShopContext)

//     return (
//         <div className="w-full">
//             <div className="text-xl font-medium text-gray-800">
//                 <p>CART TOTAL</p>
//             </div>

//             <div className="flex flex-col gap-2 mt-2 text-[15px]">
//                 <div className="flex justify-between">
//                     <p className="text-[16px]">Subtotal</p>
//                     <p className="text-[16px]"> {currency} {calculatetotalamount()}.00/- </p>
//                 </div>

//                 <hr />

//                 <div className="flex justify-between">
//                     <p className="text-[16px]"> Shipping Fee </p>
//                     <p className="text-[16px]"> + {currency} {delivery_fee}.00/- </p>
//                 </div>

//                 <hr />

//                 <div className="flex justify-between">
//                     <p className="font-medium text-[16px]"> Total </p>
//                     <p className="font-medium text-[16px]"> {currency} {calculatetotalamount() === 0 ? 0 : calculatetotalamount() + delivery_fee}.00/- </p>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default CartTotal

import { useContext, useEffect, useState, useMemo } from "react";
import { ShopContext } from "../Context/ShopContext";

const CartTotal = () => {
  const { backendUrl, currency, calculatetotalamount, cartitem } =
    useContext(ShopContext);

  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [loadingDelivery, setLoadingDelivery] = useState(true);

  // 🔹 Flatten cartitem into array
  const cartdata = useMemo(() => {
    const arr = [];
    for (const productId in cartitem) {
      for (const size in cartitem[productId]) {
        for (const color in cartitem[productId][size]) {
          arr.push({
            _id: productId,
            size,
            color,
            quantity: cartitem[productId][size][color],
          });
        }
      }
    }
    return arr;
  }, [cartitem]);

  // 🔹 Fetch product details
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingDelivery(true);
      try {
        const results = await Promise.all(
          cartdata.map(async (item) => {
            const res = await fetch(
              `${backendUrl}/api/product/single/${item._id}`
            );
            if (!res.ok) throw new Error("Failed to fetch product");
            const data = await res.json();
            return data.product;
          })
        );
        setFetchedProducts(results);
      } catch (err) {
        console.error(err);
        setFetchedProducts([]);
      } finally {
        setLoadingDelivery(false);
      }
    };

    if (cartdata.length > 0) fetchProducts();
    else setLoadingDelivery(false);
  }, [cartdata, backendUrl]);

  // 🔹 Determine delivery fee
  const deliveryChargeApplicable = !fetchedProducts.some((product) => {
    const category = product?.subcategory?.category?.name ?? "";
    return category === "Combo Set"; // if any product is Combo Set, no charge
  });

  const delivery_fee = deliveryChargeApplicable ? 150 : 0;

  if (loadingDelivery) {
    return (
      <div className="text-center py-4 text-gray-600">
        Calculating delivery fee...
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="text-xl font-medium text-gray-800">
        <p>CART TOTAL</p>
      </div>
      <div className="flex flex-col gap-2 mt-2 text-[15px]">
        <div className="flex justify-between">
          <p className="text-[16px]">Subtotal</p>
          <p className="text-[16px]">
            {currency}
            {calculatetotalamount()}/-
          </p>
        </div>

        <hr />

        <div className="flex justify-between">
          <p className="text-[16px]">Shipping Fee</p>
          <div className="text-[16px]">
            <div className="flex items-center gap-2">
              {delivery_fee > 0 ? (
                <span className="text-[16px] font-medium">
                  + {currency} {delivery_fee}.00/-
                </span>
              ) : (
                <div className="flex flex-col items-center gap-1">
                  {/* Original price with line through */}
                  <span className="relative text-gray-800 text-[16px] font-medium">
                    {currency} 150/-
                    <span className="absolute left-0 top-1/2 w-full h-px bg-gray-800 -translate-y-1/2"></span>
                  </span>
                  {/* Free delivery text */}
                  <span className="text-green-600 text-[15px] font-semibold">
                    (Free Delivery)
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <hr />

        <div className="flex justify-between">
          <p className="font-medium text-[16px]">Total</p>
          <p className="font-medium text-[16px]">
            {currency}
            {calculatetotalamount() + delivery_fee}/-
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
