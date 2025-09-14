import { assets } from "../assets/frontend_assets/assets";

const Menubar = ({Category,More}) => {
  return (
    <div className="flex items-center justify-center mt-3 px-1">
      <div className="w-full flex justify-between items-center font-semibold font-roboto">
        <div> {Category} </div>

        <div className="flex items-center gap-1 ">
          {More}
          <div className="w-7 h-7 bg-blue-400 rounded-full flex items-center justify-center">
            <img src={assets.dropdown_icon} alt="" className="w-2 mt-[2px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menubar;
