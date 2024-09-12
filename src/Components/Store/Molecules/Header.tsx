import React, { useState } from "react";
import '../Helpers/scss/Headder.scss'
import profile from "../../../assets/blank-profile-picture-973460_1280.png"
import logo from '../../../assets/favicon.ico'
import { BsCart } from "react-icons/bs";
import LoginModal from "./LoginModal"; // Import the modal
import useMystoreStore from "../Core/Store";
import SignupModal from "./SignupModal";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const {logedIn,isOpenSignupModal}=useMystoreStore((s)=>s)
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [profileName] = useState("John Doe");
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <header className="header">
      {/* Left side: Logo and Store Name */}
      <div className="header__left">
         <img src={logo} alt="Store Logo" className="header__logo" />
        <Link style={{textDecoration:"none" }} to='/'>       
        <span className="header__store-name">MyStore</span>
        </Link>

      </div>

      {/* Center: Search Box */}
      <div className="header__center">
        <input type="text" placeholder="Search products..." className="header__search" />
      </div>

      {/* Right side: Cart, Profile, Login */}
      <div className="header__right">
        {logedIn===true ? (
          <>
            <div className="header__icon header__cart">
              <Link to='/cart' ><BsCart /></Link>
            </div>
            <div className="header__profile" onClick={toggleDropdown}>
              <img src={profile} alt="Profile" className="header__profile-pic" />
              <div className="header__profile-name">{profileName}</div>
              {isDropdownOpen && (
                <div className="header__dropdown">
                  <ul>
                    <li><a href="/settings">Settings</a></li>
                    <li><a href="/logout">Logout</a></li>
                  </ul>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <button className="login-btn" onClick={openLoginModal}>Login</button>
          </>
        )}
      </div>

      {/* Login Modal */}
      {isOpenSignupModal && <SignupModal  />}
      {isLoginModalOpen && <LoginModal closeModal={closeLoginModal} />}
    </header>
  );
};

export default Header;
