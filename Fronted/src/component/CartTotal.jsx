import { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";

const CartTotal = () => {
  const { currency, subtotal, delivery_fee, total } = useContext(ShopContext);

  return (
    <div className="w-full">
      <div className="text-xl font-medium text-gray-800">
        <p>CART TOTAL</p>
      </div>

      <div className="flex flex-col gap-2 mt-2 text-[15px]">

        {/* SUBTOTAL */}
        <div className="flex justify-between">
          <p className="text-[16px]">Subtotal</p>
          <p className="text-[16px]">
            {currency}
            {subtotal}/-
          </p>
        </div>

        <hr />

        {/* SHIPPING FEE */}
        <div className="flex justify-between">
          <p className="text-[16px]">Shipping Fee</p>
          <div className="text-[16px]">
            {delivery_fee > 0 ? (
              <span className="text-[16px] font-medium">
                + {currency} {delivery_fee}/-
              </span>
            ) : (
              <div className="flex flex-col items-center gap-1">
                <span className="relative text-gray-800 text-[16px] font-medium">
                  {currency} 150/-
                  <span className="absolute left-0 top-1/2 w-full h-px bg-gray-800 -translate-y-1/2"></span>
                </span>
                <span className="text-green-600 text-[15px] font-semibold">
                  (Free Delivery)
                </span>
              </div>
            )}
          </div>
        </div>

        <hr />

        {/* TOTAL */}
        <div className="flex justify-between">
          <p className="font-medium text-[16px]">Total</p>
          <p className="font-medium text-[16px]">
            {currency}
            {total}/-
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
