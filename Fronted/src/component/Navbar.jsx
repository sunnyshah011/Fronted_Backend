import { useEffect, useState, useRef, useContext } from "react";
import { assets } from "../assets/frontend_assets/assets";
import { NavLink, Link } from "react-router-dom";
import { ShopContext } from "../Context/ShopContext";
import { UserIcon } from "@heroicons/react/24/outline"; // or /outline
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline"; // or /outline
import { HomeIcon } from "@heroicons/react/24/outline"; // Add at the top of your file
import { FaBars, FaTimes } from "react-icons/fa"; // hamburger and close icons
import { toast } from "react-toastify";
import axios from "axios";

const Navbar = () => {
  const { setToken, address, setAddress, token, getcartcount, setCartitem, navigate } =
    useContext(ShopContext);

  const { backendUrl } = useContext(ShopContext);
  const [categories, setCategories] = useState([]);
  const [mobilecategories, setmobileCategories] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(false);
  // const [search, setSearch] = useState("");

  const userRef = useRef(null);

  const fetchCategory = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/categories`);

      if (data.success) {
        setCategories(data.categories.slice(0, 7));
        setmobileCategories(data.categories);
      } else if (Array.isArray(data.categories)) {
        setCategories(data.categories.slice(0, 5));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  useEffect(() => {
    if (localStorage.getItem("showLogoutToast")) {
      toast.info("You Are Logged Out!", {
        className: "custom-toast-center",
        autoClose: 1000,
        pauseOnHover: false,
        closeOnClick: true,
        hideProgressBar: true,
      });
      localStorage.removeItem("showLogoutToast");
    }
  }, []);


  const logout = () => {
    navigate("/");
    window.scrollTo(0, 0);
    setShow(false);

    // Set flag to show toast after reload
    localStorage.setItem("showLogoutToast", "true");

    // Clear user data
    localStorage.removeItem("token");
    setToken("");
    setCartitem({});
    setAddress({}); // <-- clear user details

    // Reload page
    window.location.reload();
  };


  const order = () => {
    navigate("/order");
    setShow(false);
  };

  const myprofile = () => {
    navigate("/profile");
    setShow(false);
  };

  const account = () => {
    navigate("/manage-account");
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
    <header className="fixed top-0 left-0 w-full border-b border-gray-200 bg-white z-50">
      <div className="mx-auto w-full max-w-[1250px] flex items-center justify-between py-4.5 px-4 min-[500px]:px-5 sm:px-[4vw] md:px-[5vw] lg:px-[3vw] font-medium gap-3">
        {/* home icon for navigation */}
        <div className="border rounded-[9px] p-1.5 w-10 aspect-square border-gray-400 flex justify-center items-center overflow-visible">
          <Link to="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 30 30"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-house-fish cursor-pointer hover:scale-110 transition-transform duration-200"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              {/* Fish centered inside the house */}
              <g transform="translate(0 0) scale(1.3)">
                <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z" />
                <path d="M18 12v.5" />
                <path d="M16 17.93a9.77 9.77 0 0 1 0-11.86" />
                <path d="M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33" />
                <path d="M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4" />
                <path d="m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98" />
              </g>
            </svg>
          </Link>


          {/* Mobile menu icon */}
          {/* <div className="justify-end">
            <img
              onClick={openMenu}
              src={assets.menu_icon}
              className="w-5 cursor-pointer min-[850px]:hidden flex-shrink-0"
              alt="Menu"
            />
          </div> */}
        </div>

        {/* Search bar */}
        {/* <div className="flex-1/12 hidden min-[850px]:block">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="pl-5 py-1.5 w-full rounded-full shadow-sm border border-gray-300 focus:outline-none focus:ring-1
           focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          />
        </div> */}

        {categories.length > 0 ? (
          <div className="hidden min-[1000px]:flex md:gap-6 lg:gap-12 text-gray-700 flex-1 justify-center h-full">
            <div className="flex items-center gap-7 h-full">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="flex flex-col items-center"
                  onClick={() => navigate(`/collection?category=${cat.slug}`)}
                >
                  <div>
                    <p className="max-[768px]:text-[12px] text-center max-[768px]:font-medium md:text-[17px] font-normal cursor-pointer">
                      {" "}
                      {cat.name}{" "}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm"></p>
        )}

        {/* Cart and User icons */}
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2 min-[350px]:gap-2">
            <div className="relative border rounded-[9px] p-1.5 w-10 aspect-square border-gray-400 flex justify-center items-center">
              <Link to="/cart" className=" flex-shrink-0">
                {/* <img
                  src={assets.cart_icon}
                  className=" w-5 flex-shrink-0"
                  alt="Cart"
                /> */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-shopping-cart cursor-pointer hover:scale-110 transition-transform duration-200"
                >
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
              </Link>
              <span className="absolute right-[-8px] top-[-10px] w-5 text-center leading-5 bg-black text-white aspect-square rounded-full text-[8px]">
                {Number(getcartcount()) || 0}
              </span>
            </div>

            <div className="relative flex-shrink-0 ml-1 sm:ml-2" ref={userRef}>
              <div className="border rounded-[9px] p-1.5 w-10 aspect-square flex border-gray-400 justify-center items-center">
                <button
                  className="flex gap-2"
                  onClick={() => setShow((pre) => !pre)}
                >
                  {/* <img
                    src={assets.profile_icon}
                    className="w-5 cursor-pointer flex-shrink-0"
                    alt="Profile"
                  /> */}
                  <UserIcon className="h-6 w-6 text-black cursor-pointer hover:scale-110 transition-transform duration-200" />
                </button>
              </div>

              <div
                className={`absolute left-[-125px] pt-4 ${show ? "block" : "hidden"
                  }`}
              >
                <div className="flex flex-col gap-4 w-50 py-4 px-4 bg-white border border-gray-300 rounded-[12px] text-gray-700">
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
                      {/* <p
                        onClick={account}
                        className="cursor-pointer hover:text-black flex gap-3"
                      >
                        <Cog6ToothIcon className="h-6 w-6 text-gray-700" />
                        <span className="text-[15px]">Manage Account</span>
                      </p> */}
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
              <div className="text-[12px] ">{address?.name && <p>HI,</p>}</div>
              <p className="text-[12px] ">
                {address?.name ? address.name.slice(0, 6) : ""}
              </p>
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
        <aside
          className={`fixed top-0 left-0 h-full w-64 bg-white z-50 transform ${isOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 ease-in-out`}
        >
          <button className="px-3 py-2 text-[17px]" onClick={closeMenu}>
            &larr; Back
          </button>

          <nav className="flex flex-col p-4 space-y-5 items-center pb-10 overflow-y-auto h-[calc(100vh-4rem)]">
            <NavLink
              to="/"
              onClick={closeMenu}
              className="hover:text-blue-500 flex gap-3 items-center"
            >
              <HomeIcon className="h-5 w-5" /> {/* Home icon */}
              <p className="text-[17px]">Home</p>
            </NavLink>
            {mobilecategories.map((cat) => (
              <div
                key={cat._id}
                onClick={() => {
                  navigate(`/collection?category=${cat.slug}`);
                  closeMenu(); // <-- Close sidebar after navigation
                }}
                className="cursor-pointer hover:text-blue-500 "
              >
                {cat.name}
              </div>
            ))}
          </nav>
        </aside>
      </div>
    </header>
  );
};

export default Navbar;
