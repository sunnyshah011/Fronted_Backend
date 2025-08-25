import { useEffect, useState, useRef, useContext } from "react";
import { assets } from "../assets/frontend_assets/assets";
import { NavLink, Link } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import { UserIcon } from "@heroicons/react/24/outline"; // or /outline
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline"; // or /outline
import { toast } from "react-toastify";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faFacebook} from '@fortawesome/free-brands-svg-icons';
// import { ArrowRightOnRectangleIcon   } from '@heroicons/react/24/outline'; // or /outline
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faCoffee } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
  const {
    user,
    setUser,
    setToken,
    token,
    getcartcount,
    setcartitem,
    navigate,
  } = useContext(ShopContext);

  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("");

  const userRef = useRef(null);

  const logout = () => {
    navigate("/");
    window.scrollTo(0, 0);
    setShow(false);
    // Toast for logout
    toast.info("You are Logout", {
      position: "top-center",
      className: "custom-toast-center",
      bodyClassName: "text-sm",
      autoClose: 1000,
      closeOnClick: true,
      pauseOnHover: true,
    });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken("");
    setUser("");
    setcartitem({});
  };

  const order = () => {
    navigate("/order");
    setShow(false);
  };

  const myprofile = () => {
    navigate("/profile");
    setShow(false);
  };

  const openMenu = () => setIsOpen(true);
  const closeMenu = () => setIsOpen(false);

  // Lock scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userRef.current && !userRef.current.contains(event.target)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full border-b border-gray-100 bg-white z-50">
      <div className="mx-auto w-full max-w-[1250px] flex items-center justify-between py-4 px-4 min-[500px]:px-5 sm:px-[4vw] md:px-[5vw] lg:px-[3vw] font-medium gap-3">
        {/* home icon for navigation */}
        <div className="flex gap-5 items-center">
          <Link to="/">
            <img
              src={assets.home}
              className="w-5.5 cursor-pointer flex-shrink-0"
              alt="H"
            />
          </Link>

          {/* Mobile menu icon */}
          <div className="justify-end">
            <img
              onClick={openMenu}
              src={assets.menu_icon}
              className="w-5 cursor-pointer min-[850px]:hidden flex-shrink-0"
              alt="Menu"
            />
          </div>
        </div>

        {/* Search bar */}
        <div className="flex-1/7 hidden min-[850px]:block">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="pl-5 py-1.5 w-full rounded-full shadow-sm border border-gray-300 focus:outline-none focus:ring-1
           focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div>

        {/* Desktop nav links */}
        <nav className="hidden min-[850px]:flex md:gap-6 lg:gap-12 text-gray-700 flex-1 justify-center h-full">
          <div className="flex items-center gap-7 h-full">
            <NavLink to="/" className="flex flex-col items-center gap-1">
              Home
            </NavLink>
            <NavLink
              to="/collection"
              className="flex flex-col items-center gap-1"
            >
              Collection
            </NavLink>
            <NavLink to="/contact" className="flex flex-col items-center gap-1">
              Contact
            </NavLink>
            <NavLink to="/about" className="flex flex-col items-center gap-1">
              About
            </NavLink>
          </div>
        </nav>

        {/* Cart and User icons */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 min-[350px]:gap-2">
            <Link to="/cart" className="relative flex-shrink-0">
              <img
                src={assets.cart_icon}
                className=" w-6 flex-shrink-0"
                alt="Cart"
              />
              <span className="absolute right-[-4px] bottom-[-6px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
                {getcartcount()}
              </span>
            </Link>

            <div className="relative flex-shrink-0 ml-5 sm:ml-8" ref={userRef}>
              <button
                className="flex gap-2"
                onClick={() => setShow((pre) => !pre)}
              >
                <img
                  src={assets.profile_icon}
                  className="w-6 cursor-pointer flex-shrink-0"
                  alt="Profile"
                />
              </button>
              <div
                className={`absolute left-[-110px] pt-4 ${
                  show ? "block" : "hidden"
                }`}
              >
                <div className="flex flex-col gap-4 w-45 py-4 pl-6 bg-white border border-gray-300 rounded-[12px] text-gray-700">
                  {token ? (
                    <div className="flex flex-col gap-4">
                      <p
                        onClick={myprofile}
                        className="cursor-pointer hover:text-black flex gap-3"
                      >
                        <UserIcon className="h-6 w-6 text-gray-700" />
                        <span className="text-[15px]">My Profile</span>
                      </p>
                      <p
                        onClick={order}
                        className="cursor-pointer hover:text-black flex gap-3"
                      >
                        <ClipboardDocumentListIcon className="h-6 w-6 text-gray-700" />
                        <span className="text-[15px]">My Orders</span>
                      </p>
                      <p
                        onClick={logout}
                        className="cursor-pointer hover:text-black flex gap-3"
                      >
                        <i className="ri-logout-box-r-line text-xl"></i>
                        <span className="text-[15px]">Logout</span>
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <Link onClick={() => setShow(false)} to="/login">
                        <p className="cursor-pointer hover:text-black flex gap-3">
                          <ClipboardDocumentListIcon className="h-6 w-6 text-gray-700 items-center" />
                          <span className="text-[15px]">Login</span>
                        </p>
                      </Link>
                      <Link onClick={() => setShow(false)} to="/register">
                        <p className="cursor-pointer hover:text-black flex gap-3 items-center">
                          <i className="ri-logout-box-r-line text-xl"></i>
                          <span className="text-[15px]">Register</span>
                        </p>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="text-sm flex flex-col">
              <div className="text-[13px] "> {user ? <p>HI,</p> : ""}</div>
              <p className="text-[13px] "> {user ? user.slice(0, 5) : ""} </p>
            </div>
          </div>
        </div>

        {/* Mobile sidebar overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-transform duration-400 ease-linear"
            onClick={closeMenu}
          ></div>
        )}

        {/* Mobile sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full w-64 bg-white z-50 transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out`}
        >
          <button className="p-4 text-xl" onClick={closeMenu}>
            &larr; Back
          </button>

          <nav className="flex flex-col p-4 space-y-2">
            <NavLink
              to="/"
              onClick={closeMenu}
              className="text-gray-800 hover:text-blue-500 flex gap-3 items-center"
            >
              <i className="fa fa-home"></i>
              <p className="text-[20px]">Home</p>
            </NavLink>
            <NavLink
              to="/collection"
              onClick={closeMenu}
              className="text-gray-800 hover:text-blue-500 flex gap-3 items-center"
            >
              <i className="fa fa-th-large"></i>
              <p className="text-[20px]">Collection</p>
            </NavLink>
            <NavLink
              to="/about"
              onClick={closeMenu}
              className="text-gray-800 hover:text-blue-500 flex gap-3 items-center"
            >
              <i className="fa fa-address-card"></i>
              <p className="text-[20px]">About</p>
            </NavLink>
            <NavLink
              to="/contact"
              onClick={closeMenu}
              className="text-gray-800 hover:text-blue-500 flex gap-3 items-center"
            >
              <i className="fa fa-phone"></i>
              <p className="text-[20px]">Contact</p>
            </NavLink>
            <NavLink
              to="/location"
              onClick={closeMenu}
              className="text-gray-800 hover:text-blue-500 flex gap-3 items-center"
            >
              <i className="fa fa-map-marker"></i>
              <p className="text-[20px]">Location</p>
            </NavLink>
          </nav>
        </aside>
      </div>
    </header>
  );
};

export default Navbar;
