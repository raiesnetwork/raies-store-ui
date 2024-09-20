import React, { useState } from "react";
import '../Helpers/scss/Headder.scss'
import profile from "../../../assets/blank-profile-picture-973460_1280.png"
import logo from '../../../assets/favicon.ico'
import { BsCart } from "react-icons/bs";
import LoginModal from "./LoginModal"; // Import the modal
import useMystoreStore from "../Core/Store";
import SignupModal from "./SignupModal";
import { Link } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { IoBagOutline } from "react-icons/io5";
import { FiUser } from "react-icons/fi";
import { IoIosNotificationsOutline } from "react-icons/io";
const Header: React.FC = () => {
  const { userName, logedIn, isOpenSignupModal, cartData } = useMystoreStore((s) => s)
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
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
      <Link to={"/"} className="header__left">
        <img src={"/media/Nike-logo-icon-on-transparent-background-PNG.png"} alt="Store Logo" className="header__logo" />
   

      </Link>

      {/* Center: Search Box */}
      <div className="header__center">
        <div className="header__search">
          <input type="text" placeholder="Search" className="header__search-input" />
          <CiSearch className="header__serchIcon" />
        </div>

      </div>

      {/* Right side: Cart, Profile, Login */}
      <div className="header__right">
        {logedIn === true ? (
          <>
            <div className="header__icon header__cart">

              <Link to='/cart' >
                <div style={{ position: "relative" }} >
                <IoIosNotificationsOutline className="header__notification-icon"/>
                  {/* <p className="header__profile-name">{cartData?.length} Items</p> */}
                </div>
              </Link>
            </div>
            <div className="header__icon header__cart">

              <Link to='/cart' >
                <div style={{ position: "relative" }} >
                <IoBagOutline className="header__cart-icon"/>
                  {/* <p className="header__profile-name">{cartData?.length} Items</p> */}
                </div>
              </Link>
            </div>
            <div className="header__profile" onClick={toggleDropdown}>
              <FiUser className="header__profile_icon"/>
              {/* <div className="header__profile-name">{userName}</div> */}
              {isDropdownOpen && (
                <div className="header__dropdown">
                  <ul>
                    <li><Link to='/orders'>My Orders</Link></li>
                    <li><a href="/settings">Profile</a></li>
                    <li><a href="/logout">Logout</a></li>
                  </ul>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* <button className="login-btn" onClick={openLoginModal}>Login</button> */}
            <div className="header__guest_login">
            <FiUser className="header__profile_icon"/>
            </div>
          </>
        )}
      </div>

      {/* Login Modal */}
      {isOpenSignupModal && <SignupModal />}
      {isLoginModalOpen && <LoginModal closeModal={closeLoginModal} />}
    </header>
  );
};

export default Header;
