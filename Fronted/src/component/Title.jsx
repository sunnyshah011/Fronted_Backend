import { IoFlashSharp } from "react-icons/io5";
import { FaCrown } from "react-icons/fa";
import { MdCategory } from "react-icons/md";
import { IoIosArrowForward } from "react-icons/io";


const Menubar = ({ Category, More }) => {
  // Select icon based on Category
  const getIcon = () => {
    switch (Category) {
      case "Flash-Sale":
        return <IoFlashSharp className="text-yellow-500 text-xl" />;
      case "Top Products":
        return <FaCrown className="text-orange-500 text-lg" />;
      case "All Products":
        return <MdCategory className="text-blue-500 text-xl" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-center mt-3 mb-3 px-1">
      <div className="w-full flex justify-between items-center font-medium">
        <div className="text-[18px] flex gap-2 items-center text-gray-800">
          {getIcon()}
          {Category}
        </div>

        {More ? (
          <div className="flex items-center gap-2">
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
