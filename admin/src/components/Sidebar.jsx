import { NavLink } from "react-router-dom";
import { FiBox } from "react-icons/fi";
import { HiOutlineReceiptRefund } from "react-icons/hi";
import { HiOutlineLocationMarker  } from "react-icons/hi";
import { AiOutlineQrcode } from "react-icons/ai";
import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineAppstore } from "react-icons/ai";

const Sidebar = () => {
  return (
    <div className="w-[18%] min-h-screen border-r-2">
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-lg"
          to="/add"
        >
          <AiOutlinePlus size={20} />
          <p className="hidden md:block"> Add itmes </p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-lg"
          to="/list"
        >
          <FiBox size={20} />
          <p className="hidden md:block"> List itmes </p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-lg"
          to="/order"
        >
          <HiOutlineReceiptRefund size={20} />
          <p className="hidden md:block"> Order </p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-lg"
          to="/location"
        >
          <HiOutlineLocationMarker  size={20} />
          <p className="hidden md:block"> Location </p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-lg"
          to="/category-manager"
        >
          <AiOutlineAppstore  size={20} />
          <p className="hidden md:block"> Category </p>
        </NavLink>

        <NavLink
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-lg"
          to="/payment-methods"
        >
          <AiOutlineQrcode size={20} />
          <p className="hidden md:block"> Payment-Methods </p>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
