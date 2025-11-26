import { useContext } from "react"
import { ShopContext } from "../Context/ShopContext"

const CartTotal = () => {
    const { currency, delivery_fee, calculatetotalamount } = useContext(ShopContext)

    return (
        <div className="w-full">
            <div className="text-xl font-medium text-gray-800">
                <p>CART TOTAL</p>
            </div>

            <div className="flex flex-col gap-2 mt-2 text-[15px]">
                <div className="flex justify-between">
                    <p className="text-[16px]">Subtotal</p>
                    <p className="text-[16px]"> {currency} {calculatetotalamount()}.00/- </p>
                </div>

                <hr />

                <div className="flex justify-between">
                    <p className="text-[16px]"> Shipping Fee </p>
                    <p className="text-[16px]"> + {currency} {delivery_fee}.00/- </p>
                </div>

                <hr />

                <div className="flex justify-between">
                    <p className="font-medium text-[16px]"> Total </p>
                    <p className="font-medium text-[16px]"> {currency} {calculatetotalamount() === 0 ? 0 : calculatetotalamount() + delivery_fee}.00/- </p>
                </div>
            </div>
        </div>
    )
}

export default CartTotal
