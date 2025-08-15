import { useContext } from "react"
import { ShopContext } from "../Context/ShopContext"
import { Link } from "react-router-dom"

const Product_Page = ({ id, name, price, image }) => {

  const { currency } = useContext(ShopContext)

  return (
    <Link
      className="text-gray-700 cursor-pointer rounded-b-[6px]  bg-white block" to={`/product/${id}`}>
      <div className="aspect-square overflow-hidden rounded-t-[6px]">
        <img
          src={image[0]}
          alt=""
          className="w-full h-full object-cover object-top bottom-0 hover:opacity-90 transition ease-in-out"
        />
      </div>
      <p className="pt-3 pb-1 pl-2 text-sm line-clamp-1">{name}</p>
      <p className="pl-2 pb-5 text-[16px] font-semibold truncate">
        {currency} {price} /-
      </p>
    </Link>
  )
}
export default Product_Page
//  <Link className="text-gray-700 cursor-pointer rounded-[10px] " to={`/product/${id}`} >
//       <div className="aspect-square rounded-[10px]" >
//         <img src={image[0]} alt="" className="hover:opacity-90 object-cover transition ease-in-out rounded-[10px]"/>
//       </div>
//       <p className="pt-3 pb-1 pl-1 text-sm line-clamp-1" > {name} </p>
//       <p className="pl-2 text-[16px] font-semibold truncate" > {currency} {price} /- </p>
//     </Link>