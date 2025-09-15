import { assets } from "../assets/frontend_assets/assets";
import { IoIosArrowForward } from "react-icons/io";

const Menubar = ({ Category, More }) => {
  return (
    <div className="flex items-center justify-center mt-3 px-1">
      <div className="w-full flex justify-between items-center font-semibold font-roboto">
        <div className="text-[18px] flex gap-1"> {Category} </div>

        {More ? (
          <div className="flex items-center gap-2 ">
            {More}
            <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
              <IoIosArrowForward color="white" />
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Menubar;
