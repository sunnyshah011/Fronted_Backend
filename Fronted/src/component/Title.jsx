import { assets } from "../assets/frontend_assets/assets";

const Menubar = ({Category,More}) => {
  return (
    <div className="flex items-center justify-center mt-3 px-4">
      <div className="w-full flex justify-between items-center">
        <div> {Category} </div>

        <div className="flex items-center gap-2 ">
          {More}
          <div>
            <img src={assets.dropdown_icon} alt="" className="w-2 mt-[2px]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menubar;
