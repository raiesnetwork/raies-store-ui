import React, { useState } from "react";
import '../Helpers/scss/Headder.scss'
import profile from "../../../assets/blank-profile-picture-973460_1280.png"
import logo from '../../../assets/favicon.ico'
import { BsCart } from "react-icons/bs";
const Header: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [profileName] = useState("John Doe")
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header className="header">
      {/* Left side: Logo and Store Name */}
      <div className="header__left">
        <img
          src={logo}
          alt="Store Logo"
          className="header__logo"
        />
        <span className="header__store-name">MyStore</span>
      </div>

      {/* Center: Search Box */}
      <div className="header__center">
        <input
          type="text"
          placeholder="Search products..."
          className="header__search"
        />
      </div>

      {/* Right side: Cart, Profile, Login */}
      <div className="header__right">
        {/* Cart Icon */}
        <div className="header__icon header__cart">
          <BsCart />
        </div>

        {/* Profile Section */}
        <div className="header__profile" onClick={toggleDropdown}>
          <img
            src={profile}
            alt="Profile"
            className="header__profile-pic"
          />
          <div className="header__profile-name">{profileName}</div>

          {/* Dropdown menu */}
          {isDropdownOpen && (
            <div className="header__dropdown">
              <ul>
                <li><a href="/settings">Settings</a></li>
                <li><a href="/logout">Logout</a></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
