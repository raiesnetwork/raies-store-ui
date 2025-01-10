import React, { useState } from "react";
import "../Helpers/scss/header.scss";
// import profile from "../../../assets/blank-profile-picture-973460_1280.png"
// import logo from '../../../assets/favicon.ico'
// import { BsCart } from "react-icons/bs";
import useMystoreStore from "../Core/Store";
import { Link, useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { IoBagOutline } from "react-icons/io5";
import { FiUser } from "react-icons/fi";
import { getSubdomain } from "../../../Utils/Subdomain";
// import { IoBagCheck } from "react-icons/io5";
// import { FaUserLarge } from "react-icons/fa6";
// import { IoLogOut } from "react-icons/io5";
import { IoLogOutOutline } from "react-icons/io5";
import { IoBagCheckOutline } from "react-icons/io5";
import { useAuth } from "../../Auth/AuthContext";

const { hostname } = window.location;
// eslint-disable-next-line prefer-const
let subdomain = getSubdomain(hostname);
const Header: React.FC = () => {
  const {
  
    latestProduct,
    storeData,
    // cartData
  } = useMystoreStore((state) => state);
  const {logout,isAuthenticated,user}=useAuth()||{}
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  let navigate = useNavigate();
  const [search, setSearch] = useState<string>("");

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout(); // Call the logout action from the store
    navigate("/login"); // Redirect to login page after logout
  };
  const handilSearch = async () => {
    await latestProduct(subdomain, search);
  };

  return (
    <header className="header">
      {/* Left side: Logo and Store Name */}
      <Link to={"/"} className="header__left">
        <img
          src={
            storeData
              ? storeData?.storeIcon
              : "/media/Nike-logo-icon-on-transparent-background-PNG.png"
          }
          alt="Store Logo"
          className="header__logo"
        />
        <p>{storeData ? storeData?.storeName : ""}</p>
      </Link>

      {/* Center: Search Box */}
      <div className="header__center">
        <div className="header__search">
          <input
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search"
            className="header__search-input"
          />
          <CiSearch onClick={handilSearch} className="header__serchIcon" />
        </div>
      </div>

      {/* Right side: Cart, Profile, Login */}
      <div className="header__right">
        {user? (
          <>
            {/* <div className="header__icon header__cart">

              <Link to='/cart' >
                <div style={{ position: "relative" }} >
                  <IoIosNotificationsOutline className="header__notification-icon" />
                  <p className="header__profile-name">{cartData?.length} Items</p>
                </div>
              </Link>
            </div> */}


            <div className="header__icon header__cart">
              <Link to="/cart">
                <div style={{ position: "relative" }}>
                  <IoBagOutline className="header__cart-icon" />
                  {/* <p className="header__profile-name">{cartData?.length} Items</p> */}
                </div>
              </Link>
            </div>
            <div className="header__profile" onClick={toggleDropdown}>
              <FiUser className="header__profile_icon" />
              {/* <div className="header__profile-name">{userName}</div> */}
              {isDropdownOpen && (
          <div className="header__dropdown">
          <ul>
            <Link to='/orders' style={{ textDecoration: "none" }}>
              <li><IoBagCheckOutline className="header__dropdown-icon" /> 
                <div className="header__dropdown-text">My Orders</div>
              </li>
            </Link>
            <Link to='/profile' style={{ textDecoration: "none" }}>
              <li><FiUser className="header__dropdown-icon" /> 
                <div className="header__dropdown-text">My Profile</div>
              </li>
            </Link>
            <li onClick={()=>handleLogout()}>
              <IoLogOutOutline className="header__dropdown-icon" /> 
              <div className="header__dropdown-text">Logout</div>
            </li>
          </ul>
        </div>
        
              )}
            </div>
          </>
        ) : (
          <>
            <div className="header__guest_login">
              <Link to={"/login"}>
                <FiUser className="header__profile_icon" />
              </Link>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
