import { useContext } from "react"
import { ShopContext } from "../Context/ShopContext"

const CartTotal = () => {
    const { currency, delivery_fee, calculatetotalamount } = useContext(ShopContext)

    return (
        <div className="w-full">
            <div className="text-2xl">
                <p>CART TOTAL</p>
            </div>

            <div className="flex flex-col gap-2 mt-2 text-sm">
                <div className="flex justify-between">
                    <p>Subtotal</p>
                    <p> {currency} {calculatetotalamount()}.00 </p>
                </div>

                <hr />

                <div className="flex justify-between">
                    <p> Shipping Fee </p>
                    <p> {currency} {delivery_fee}.00 </p>
                </div>

                <hr />

                <div className="flex justify-between">
                    <p> Total </p>
                    <b> {currency} {calculatetotalamount() === 0 ? 0 : calculatetotalamount() + delivery_fee}.00 </b>
                </div>
            </div>
        </div>
    )
}

export default CartTotal
