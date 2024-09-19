import React, { useState } from "react";
import '../Helpers/scss/Headder.scss'
import profile from "../../../assets/blank-profile-picture-973460_1280.png"
import logo from '../../../assets/favicon.ico'
import { BsCart } from "react-icons/bs";
import LoginModal from "./LoginModal"; // Import the modal
import useMystoreStore from "../Core/Store";
import SignupModal from "./SignupModal";
import { Link } from "react-router-dom";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdNotificationsActive } from "react-icons/md"

const Header: React.FC = () => {
  const {userName,logedIn,isOpenSignupModal,cartData}=useMystoreStore((s)=>s)
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
          <IoIosNotificationsOutline size={28} color="black" />
         < MdNotificationsActive size={28} color="red" />
            <div className="header__icon header__cart">

              <Link to='/cart' >
              <div style={{position:"relative"}} >
              <BsCart  size={28} color="black" />
              <p style={{
                position:"absolute",
                top:"0",
                left:"0",
                right:"0",bottom:"0",
              fontSize:"20px",
              color:"red",
             
              
              }}>{cartData?.length}</p>
              </div>
              </Link>
            </div>
            <div className="header__profile" onClick={toggleDropdown}>
              <img src={profile} alt="Profile" className="header__profile-pic" />
              <div className="header__profile-name">{userName}</div>
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
