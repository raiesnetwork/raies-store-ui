import React, { useState } from "react";
import "../Helpers/scss/header.scss";
import useMystoreStore from "../Core/Store";
import { Link, useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { IoBagOutline } from "react-icons/io5";
import { FiUser } from "react-icons/fi";
import { getSubdomain } from "../../../Utils/Subdomain";
import { IoLogOutOutline } from "react-icons/io5";
import { IoBagCheckOutline } from "react-icons/io5";
import { useAuth } from "../../Auth/AuthContext";

const { hostname } = window.location;
const subdomain = getSubdomain(hostname);

const Header: React.FC = () => {
  const {
    latestProduct,
    storeData,
    cartData = [] // Default to empty array if undefined
  } = useMystoreStore((state) => state);
  
  const { logout, user } = useAuth() || {};
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>("");

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout?.(); // Safe call in case logout is undefined
    navigate("/login");
  };

  const handleSearch = async () => {
    await latestProduct(subdomain, search);
  };

  // Calculate total items in cart
  const cartItemCount = cartData?.reduce((total, item) => {
    return total + (item.quantity || 1); // Handle cases where quantity might not exist
  }, 0) || 0;

  return (
    <header className="header">
      {/* Left side: Logo and Store Name */}
      <Link to={"/"} className="header__left">
        <img
          src={
            storeData?.storeIcon || 
            "/media/Nike-logo-icon-on-transparent-background-PNG.png"
          }
          alt="Store Logo"
          className="header__logo"
        />
        <div>{storeData?.storeName || ""}</div>
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
          <CiSearch onClick={handleSearch} className="header__serchIcon" />
        </div>
      </div>

      {/* Right side: Cart, Profile, Login */}
      <div className="header__right">
        {user ? (
          <>
            <div className="header__icon header__cart">
              <Link to="/cart">
                <div style={{ position: "relative" }}>
                  <IoBagOutline className="header__cart-icon" />
                  {cartItemCount > 0 && (
                    <span className="header__cart-count">
                      {cartItemCount}
                    </span>
                  )}
                </div>
              </Link>
            </div>
            
            <div className="header__profile" onClick={toggleDropdown}>
              <FiUser className="header__profile_icon" />
              {isDropdownOpen && (
                <div className="header__dropdown">
                  <ul>
                    <Link to='/orders' style={{ textDecoration: "none" }}>
                      <li>
                        <IoBagCheckOutline className="header__dropdown-icon" /> 
                        <div className="header__dropdown-text">My Orders</div>
                      </li>
                    </Link>
                    <Link to='/profile' style={{ textDecoration: "none" }}>
                      <li>
                        <FiUser className="header__dropdown-icon" /> 
                        <div className="header__dropdown-text">My Profile</div>
                      </li>
                    </Link>
                    <li onClick={handleLogout}>
                      <IoLogOutOutline className="header__dropdown-icon" /> 
                      <div className="header__dropdown-text">Logout</div>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="header__guest_login">
            <Link to={"/login"}>
              <FiUser className="header__profile_icon" />
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;