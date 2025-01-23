import React, { useEffect, useState } from "react";
import "../Helpers/scss/ProfilePage.scss";
import Header from "./Header";
import { Link } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { toast } from "react-toastify";
import useMystoreStore from "../Core/Store";
import { updateProfileInfo } from "../Core/Interfaces";
import OtpVerify from "./OTPmodal";
import { passwordChangeApi } from "../Core/StoreApi";
import StoreFooter from "../../Footer/Footer";
import CouponCardList from "./CouponView";
import PlansAndBiillings from "./PlansAndBiillings";
import Loader from "../../Loader/Loader";
import { InventoryTable } from "./InventoryTable";
import DealerDashboard from "./DealerDashBoard";
type pages = "info" | "password" | "coupon"|"Plans & billings"|"inventory"|'dashbord';
const ProfilePage: React.FC = () => {
  const {
    isOTPmodalVisible,
    setIsOtpModalVisible,
    getProfileInfo,
    updateProfileInfo,
    profileData,
  } = useMystoreStore((s) => s);
  const [formData, setFormData] = useState<updateProfileInfo>({
    fullName: profileData.fullName,
    profileImage: profileData.profileImage,
    gender: profileData.gender,
    email: profileData.email,
    mobileNumber: profileData.mobileNumber,
    storeName: profileData.storeName,
    role: profileData.role,
    storeBanner: profileData.storeBanner,
    storeIcon: profileData.storeIcon,
    wareHouseAddress: profileData.wareHouseAddress,
    wareHouseContactNumber: profileData.wareHouseContactNumber,
    wareHouseOwnerName: profileData.wareHouseOwnerName,
    subscriptionId: profileData.subscriptionId,
  });
  console.log(profileData);

  useEffect(() => {
    if (profileData) {
      setFormData(profileData);
    }
  }, [profileData]);
  const [loader, setLoader] = useState<boolean>(true);
  useEffect(() => {
    const apiHelper = async () => {
      const data = await getProfileInfo();
      setLoader(false);
      if (data.error) {
        toast.error(
          "Unable to retrieve user data at this time. Please try again later."
        );
      } else {
        // setFormData(profileData);
      }
    };
    apiHelper();
  }, []);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setnameBtnDisable(true);

    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setnameBtnDisable(true);
    const file = e.target.files?.[0];

    if (file && file.type.startsWith("image/")) {
      const maxFileSize = 1 * 1024 * 1024; // 1MB in bytes
      if (file.size <= maxFileSize) {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (e.target.name === "profileImage") {
            return setFormData((prev) => ({
              ...prev,
              profileImage: reader.result as string,
            }));
          }
          if (e.target.name === "storeBanner") {
            return setFormData((prev) => ({
              ...prev,
              storeBanner: reader.result as string,
            }));
          }
          if (e.target.name === "storeIcon") {
            setFormData((prev) => ({
              ...prev,
              storeIcon: reader.result as string,
            }));
          }
        };
        reader.readAsDataURL(file);
      } else {
        toast.error("Please ensure the file size is 1MB or less.");
      }
    } else {
      toast.error("Please upload a valid image file.");
    }
  };
  const [passwordSaveBtnVisible, setpasswordSaveBtnVisible] =
    useState<boolean>(false);
  const [emailSaveBtnVisible, setEmailSaveBtnVisible] =
    useState<boolean>(false);
  const [mobileSaveBtnVisible, setMobileSaveBtnVisible] =
    useState<boolean>(false);
  const [nameBtnDisable, setnameBtnDisable] = useState<boolean>(false);
  const handilNameSave = async () => {
    if (nameBtnDisable) {
      if (formData.fullName.trim()) {
        const data = await updateProfileInfo(formData);
        if (data.error) {
          toast.error(
            "We're unable to update right now. Please try again later."
          );
        } else {
          toast.success("Your update was successful!");
        }
      } else {
        toast.error("Please provide a valid name to continue.");
      }

      setnameBtnDisable(false);
    } else {
      toast.error("Let us know if you’d like to make any changes!");
    }
  };
  //  password Section
  const [pageSelector, setPageSelector] = useState<pages>("info");
  const [nameSaveBtnVisible, setnameSaveBtnVisible] = useState<boolean>(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);

  const validateForm = () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;
    if (!newPassword || !confirmPassword || !currentPassword) {
      return "Password fields are required.";
    }
    if (newPassword !== confirmPassword) {
      return "Passwords do not match.";
    }
    if (newPassword.length < 6) {
      return "Password must be at least 6 characters long.";
    }

    return null;
  };
  const passwordHandilChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
      [name]: value,
    });
    setError(null);
  };
  const handilePasswordSubmit = async () => {
    const erroes = validateForm();
    if (erroes) {
      setError(erroes);
    } else {
      const data = await passwordChangeApi(
        passwordForm.currentPassword,
        passwordForm.newPassword
      );
      if (data?.error) {
        toast.error(
          "We're unable to process updates at the moment. Please try again later."
        );
      } else {
        if (!data?.data) {
          setError(
            "The password you entered is incorrect. Please check and try again."
          );
        } else if (data?.data === "NotFound") {
          setError("User does not exist.");
        }
        {
          setPasswordForm({
            confirmPassword: "",
            currentPassword: "",
            newPassword: "",
          });
          setError(null);
          toast.success("Password change successful");
        }
      }
    }
  };

  return (
    <>
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Header />
        <div style={{ flex: 1 }}>
          {!loader ? (
            <>
              <div className="profile-page">
                <aside className="sidebar">
                  <div className="profile-pic">
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      {formData.profileImage ? (
                        <img src={formData.profileImage} alt="Profile" />
                      ) : (
                        <FiUser className="header__profile_icon" />
                      )}
                      {profileData?.role === "Admin" && (
                        <a
                          href={`${import.meta.env.VITE_APP_REACT_URL}/mystore`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Go to Dashboard
                        </a>
                      )}
                    </div>

                    <h3>
                      Hello{" "}
                      <span style={{ color: "blue" }}>
                        {profileData?.fullName}
                        {profileData?.role === "Admin"
                          ? ` (${profileData?.role})`
                          : ""}
                      </span>
                    </h3>
                  </div>
                  <nav>
                    <ul>
                      <li
                        style={
                          pageSelector === "info"
                            ? {
                                backgroundColor: "white",
                                color: "black",
                                border: "1px solid black",
                              }
                            : {}
                        }
                        onClick={() => setPageSelector("info")}
                      >
                     { profileData?.role === "Admin"?"Store Info": 'Personal Info.'}
                      </li>
                      {
                        profileData?.role === "Admin" &&
                       <li
                       style={
                         pageSelector === "Plans & billings"
                         ? {
                           backgroundColor: "white",
                           color: "black",
                           border: "1px solid black",
                          }
                          : {}
                        }
                        onClick={() => setPageSelector("Plans & billings")}
                        >
                       Plans & billings
                      </li>
                      }
                      <li
                        style={
                          pageSelector === "password"
                            ? {
                                backgroundColor: "white",
                                color: "black",
                                border: "1px solid black",
                              }
                            : {}
                        }
                        onClick={() => setPageSelector("password")}
                      >
                        Change Password
                      </li>
                      <li
                        style={
                          pageSelector === "coupon"
                            ? {
                                backgroundColor: "white",
                                color: "black",
                                border: "1px solid black",
                              }
                            : {}
                        }
                        onClick={() => setPageSelector("coupon")}
                      >
                        Coupons
                      </li> 
                      {/* {profileData.dealerView&& */}
                      <li
                        style={
                          pageSelector === "inventory"
                            ? {
                                backgroundColor: "white",
                                color: "black",
                                border: "1px solid black",
                              }
                            : {}
                        }
                        onClick={() => setPageSelector("inventory")}
                      >
                        Inventory
                      </li>
{/* } */}
{/* {profileData.dealerView&&  */}
                      <li
                        style={
                          pageSelector === "dashbord"
                            ? {
                                backgroundColor: "white",
                                color: "black",
                                border: "1px solid black",
                              }
                            : {}
                        }
                        onClick={() => setPageSelector("dashbord")}
                      >
                        Dashboard
                      </li>
{/* } */}
                      <Link
                        style={{
                          textDecoration: "none",
                          color: "black",
                        }}
                        to="/orders"
                      >
                        <li>My Orders</li>
                      </Link>
                    </ul>
                  </nav>
                </aside>

                <main className="main-content">
                  {pageSelector === "info" ? (
                    <section className="profile-info">
                      <form className="profile-form">
                        <div
                          className="form-group"
                          style={{
                            cursor: nameSaveBtnVisible ? "auto" : "not-allowed",
                            padding: "10px",
                            borderRadius: "5px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <label>
                              {profileData.role === "Admin"
                                ? "Admin Information"
                                : "Personal Information"}
                            </label>

                            {nameSaveBtnVisible ? (
                              <div
                                onClick={() =>
                                  setnameSaveBtnVisible(!nameSaveBtnVisible)
                                }
                                style={{ color: "blue", cursor: "pointer" }}
                              >
                                {" "}
                                &nbsp;Cancel
                              </div>
                            ) : (
                              <div>
                                &nbsp;
                                <CiEdit
                                  onClick={() =>
                                    setnameSaveBtnVisible(!nameSaveBtnVisible)
                                  }
                                  size={22}
                                  color="blue"
                                  cursor={"pointer"}
                                />
                              </div>
                            )}
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              opacity: nameSaveBtnVisible ? "1" : "0.5",
                              pointerEvents: nameSaveBtnVisible
                                ? "auto"
                                : "none",
                            }}
                          >
                            <input
                              type="text"
                              name="fullName"
                              placeholder="Change Name"
                              value={formData.fullName}
                              onChange={handleChange}
                              style={{ height: "10px", width: "80%" }}
                            />

                            <button
                              onClick={handilNameSave}
                              disabled={!nameSaveBtnVisible}
                              style={{
                                height: "100%",
                                width: "20%",
                                opacity: nameSaveBtnVisible ? "1" : "0",
                                cursor: nameSaveBtnVisible ? "pointer" : "auto",
                              }}
                              type="button"
                              className="btn btn-primary"
                            >
                              Save
                            </button>
                          </div>
                          {/* gender */}
                          {profileData?.role !== "Admin" ? (
                            <div
                              style={{
                                marginTop: "5px",
                                opacity: nameSaveBtnVisible ? "1" : "0.5",
                                pointerEvents: nameSaveBtnVisible
                                  ? "auto"
                                  : "none",
                              }}
                            >
                              <label
                                style={{
                                  fontWeight: "normal",
                                  marginBottom: "5px",
                                }}
                              >
                                Gender
                              </label>
                              <div className="gender-inputs">
                                <input
                                  type="radio"
                                  name="gender"
                                  value="male"
                                  checked={formData.gender === "male"}
                                  onChange={handleChange}
                                />{" "}
                                Male
                                <input
                                  type="radio"
                                  name="gender"
                                  value="female"
                                  checked={formData.gender === "female"}
                                  onChange={handleChange}
                                />{" "}
                                Female
                              </div>
                            </div>
                          ) : (
                            <>
                              <div
                                style={{
                                  marginTop: "5px",
                                  opacity: nameSaveBtnVisible ? "1" : "0.5",
                                  pointerEvents: nameSaveBtnVisible
                                    ? "auto"
                                    : "none",
                                }}
                              >
                                <label
                                  style={{
                                    fontWeight: "normal",
                                    marginBottom: "5px",
                                  }}
                                >
                                  Store Name
                                </label>
                                <input
                                  type="text"
                                  name="storeName"
                                  value={formData.storeName}
                                  style={{ width: "65%" }}
                                  onChange={handleChange}
                                />{" "}
                              </div>
                              <div
                                style={{
                                  marginTop: "5px",
                                  opacity: nameSaveBtnVisible ? "1" : "0.5",
                                  pointerEvents: nameSaveBtnVisible
                                    ? "auto"
                                    : "none",
                                }}
                              >
                                <label
                                  style={{
                                    fontWeight: "normal",
                                    marginBottom: "5px",
                                  }}
                                >
                                  WareHouse Address
                                </label>
                                <input
                                  type="text"
                                  name="wareHouseAddress"
                                  value={formData.wareHouseAddress}
                                  style={{ width: "65%" }}
                                  onChange={handleChange}
                                />{" "}
                              </div>
                              <div
                                style={{
                                  marginTop: "5px",
                                  opacity: nameSaveBtnVisible ? "1" : "0.5",
                                  pointerEvents: nameSaveBtnVisible
                                    ? "auto"
                                    : "none",
                                }}
                              >
                                <label
                                  style={{
                                    fontWeight: "normal",
                                    marginBottom: "5px",
                                  }}
                                >
                                  WareHouse Contact Number
                                </label>
                                <input
                                  type="text"
                                  name="wareHouseContactNumber"
                                  value={formData.wareHouseContactNumber}
                                  style={{ width: "65%" }}
                                  onChange={handleChange}
                                />{" "}
                              </div>

                              <div
                                style={{
                                  marginTop: "5px",
                                  opacity: nameSaveBtnVisible ? "1" : "0.5",
                                  pointerEvents: nameSaveBtnVisible
                                    ? "auto"
                                    : "none",
                                }}
                              >
                                <label
                                  style={{
                                    fontWeight: "normal",
                                    marginBottom: "5px",
                                  }}
                                >
                                  Warehouse Owner Name
                                </label>
                                <input
                                  type="text"
                                  name="wareHouseOwnerName"
                                  value={formData.wareHouseOwnerName}
                                  style={{ width: "65%" }}
                                  onChange={handleChange}
                                />{" "}
                              </div>
                              <div
                                style={{
                                  marginTop: "5px",
                                  opacity: nameSaveBtnVisible ? "1" : "0.5",
                                  pointerEvents: nameSaveBtnVisible
                                    ? "auto"
                                    : "none",
                                }}
                              >
                                <label
                                  style={{
                                    fontWeight: "normal",
                                    marginBottom: "5px",
                                  }}
                                >
                                  storeIcon
                                </label>
                                <img
                                  style={{ width: "70px", height: "70px" }}
                                  src={
                                    formData.storeIcon ? formData.storeIcon : ""
                                  }
                                />
                                <br />
                                <input
                                  type="file"
                                  name="storeIcon"
                                  style={{ width: "65%" }}
                                  onChange={handleImageChange}
                                />{" "}
                              </div>
                              <div
                                style={{
                                  marginTop: "5px",
                                  opacity: nameSaveBtnVisible ? "1" : "0.5",
                                  pointerEvents: nameSaveBtnVisible
                                    ? "auto"
                                    : "none",
                                }}
                              >
                                <label
                                  style={{
                                    fontWeight: "normal",
                                    marginBottom: "5px",
                                  }}
                                >
                                  Store Banner
                                </label>
                                <img
                                  style={{ width: "70px", height: "70px" }}
                                  src={
                                    formData.storeBanner
                                      ? formData.storeBanner
                                      : ""
                                  }
                                />
                                <br />
                                <input
                                  type="file"
                                  name="storeBanner"
                                  style={{ width: "65%" }}
                                  onChange={handleImageChange}
                                />{" "}
                              </div>
                            </>
                          )}
                          {/*user profile pic */}
                          <div
                            style={{
                              marginTop: "15px",
                              opacity: nameSaveBtnVisible ? "1" : "0.5",
                              pointerEvents: nameSaveBtnVisible
                                ? "auto"
                                : "none",
                            }}
                          >
                            <label
                              style={{
                                fontWeight: "normal",
                                marginBottom: "5px",
                              }}
                            >
                              Profile Image
                            </label>
                            <img
                              src={formData.profileImage}
                              style={{ width: "70px", height: "70px" }}
                            />
                            <div className="gender-inputs">
                              <input
                                type="file"
                                name="profileImage"
                                accept="image/*"
                                onChange={handleImageChange}
                              />
                            </div>
                          </div>
                        </div>
                        {/* email Section */}
                        <div
                          className="form-group"
                          style={{
                            cursor: emailSaveBtnVisible
                              ? "auto"
                              : "not-allowed",
                            padding: "10px",
                            borderRadius: "5px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <label>Email</label>

                            {emailSaveBtnVisible ? (
                              <div
                                onClick={() =>
                                  setEmailSaveBtnVisible(!emailSaveBtnVisible)
                                }
                                style={{ color: "blue", cursor: "pointer" }}
                              >
                                {" "}
                                &nbsp;Cancel
                              </div>
                            ) : (
                              <div>
                                &nbsp;
                                <CiEdit
                                  onClick={() =>
                                    setEmailSaveBtnVisible(!emailSaveBtnVisible)
                                  }
                                  size={22}
                                  color="blue"
                                  cursor={"pointer"}
                                />
                              </div>
                            )}
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              opacity: emailSaveBtnVisible ? "1" : "0.5",
                              pointerEvents: emailSaveBtnVisible
                                ? "auto"
                                : "none",
                            }}
                          >
                            <input
                              type="text"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                              style={{ height: "10px", width: "80%" }}
                            />

                            <button
                              onClick={() =>
                                setIsOtpModalVisible(formData.email)
                              }
                              disabled={!emailSaveBtnVisible}
                              style={{
                                height: "100%",
                                width: "20%",
                                opacity: emailSaveBtnVisible ? "1" : "0",
                                cursor: emailSaveBtnVisible
                                  ? "pointer"
                                  : "auto",
                              }}
                              type="button"
                              className="btn btn-primary"
                            >
                              Save
                            </button>
                          </div>
                        </div>

                        {/* mobile Number Section */}
                        <div
                          className="form-group"
                          style={{
                            cursor: mobileSaveBtnVisible
                              ? "auto"
                              : "not-allowed",
                            padding: "10px",
                            borderRadius: "5px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <label>Mobile Number</label>

                            {mobileSaveBtnVisible ? (
                              <div
                                onClick={() =>
                                  setMobileSaveBtnVisible(!mobileSaveBtnVisible)
                                }
                                style={{ color: "blue", cursor: "pointer" }}
                              >
                                {" "}
                                &nbsp;Cancel
                              </div>
                            ) : (
                              <div>
                                &nbsp;
                                <CiEdit
                                  onClick={() =>
                                    setMobileSaveBtnVisible(
                                      !mobileSaveBtnVisible
                                    )
                                  }
                                  size={22}
                                  color="blue"
                                  cursor={"pointer"}
                                />
                              </div>
                            )}
                          </div>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              opacity: mobileSaveBtnVisible ? "1" : "0.5",
                              pointerEvents: mobileSaveBtnVisible
                                ? "auto"
                                : "none",
                            }}
                          >
                            <input
                              type="text"
                              name="mobileNumber"
                              value={formData.mobileNumber}
                              onChange={handleChange}
                              style={{ height: "10px", width: "80%" }}
                            />

                            <button
                              onClick={() =>
                                setIsOtpModalVisible(formData.mobileNumber)
                              }
                              disabled={!mobileSaveBtnVisible}
                              style={{
                                height: "100%",
                                width: "20%",
                                opacity: mobileSaveBtnVisible ? "1" : "0",
                                cursor: mobileSaveBtnVisible
                                  ? "pointer"
                                  : "auto",
                              }}
                              type="button"
                              className="btn btn-primary"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </form>
                    </section>
                  ) : pageSelector === "password" ? (
                    //   Password section
                    <>
                      <section className="profile-info">
                        <form className="profile-form">
                          <div
                            className="form-group"
                            style={{
                              cursor: passwordSaveBtnVisible
                                ? "auto"
                                : "not-allowed",
                              padding: "10px",
                              borderRadius: "5px",
                            }}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                              }}
                            >
                              <label>Change Password</label>

                              {passwordSaveBtnVisible ? (
                                <div
                                  onClick={() =>
                                    setpasswordSaveBtnVisible(
                                      !passwordSaveBtnVisible
                                    )
                                  }
                                  style={{ color: "blue", cursor: "pointer" }}
                                >
                                  {" "}
                                  &nbsp;Cancel
                                </div>
                              ) : (
                                <div>
                                  &nbsp;
                                  <CiEdit
                                    onClick={() =>
                                      setpasswordSaveBtnVisible(
                                        !passwordSaveBtnVisible
                                      )
                                    }
                                    size={22}
                                    color="blue"
                                    cursor={"pointer"}
                                  />
                                </div>
                              )}
                            </div>

                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                opacity: passwordSaveBtnVisible ? "1" : "0.5",
                                pointerEvents: passwordSaveBtnVisible
                                  ? "auto"
                                  : "none",
                              }}
                            >
                              {/* current password */}
                              <input
                                type="text"
                                name="currentPassword"
                                placeholder="Current password"
                                value={passwordForm.currentPassword}
                                onChange={passwordHandilChange}
                                style={{ height: "10px", width: "80%" }}
                              />

                              <button
                                onClick={handilePasswordSubmit}
                                disabled={!passwordSaveBtnVisible}
                                style={{
                                  height: "100%",
                                  width: "20%",
                                  opacity: passwordSaveBtnVisible ? "1" : "0",
                                  cursor: passwordSaveBtnVisible
                                    ? "pointer"
                                    : "auto",
                                }}
                                type="button"
                                className="btn btn-primary"
                              >
                                Save
                              </button>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                opacity: passwordSaveBtnVisible ? "1" : "0.5",
                                pointerEvents: passwordSaveBtnVisible
                                  ? "auto"
                                  : "none",
                              }}
                            >
                              {/* new password */}
                              <input
                                type="text"
                                name="newPassword"
                                placeholder="New Password"
                                value={passwordForm.newPassword}
                                onChange={passwordHandilChange}
                                style={{ height: "10px", width: "66%" }}
                              />
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                opacity: passwordSaveBtnVisible ? "1" : "0.5",
                                pointerEvents: passwordSaveBtnVisible
                                  ? "auto"
                                  : "none",
                                marginTop: "10px",
                              }}
                            >
                              {/* confirm password */}
                              <input
                                type="text"
                                name="confirmPassword"
                                placeholder="confirm Password"
                                value={passwordForm.confirmPassword}
                                onChange={passwordHandilChange}
                                style={{ height: "10px", width: "66%" }}
                              />
                            </div>
                            <p
                              style={{
                                fontWeight: "10px",
                                color: "red",
                                maxWidth: "65%",
                                textAlign: "center",
                                fontSize: "normal",
                              }}
                            >
                              {error}
                            </p>
                          </div>
                        </form>
                      </section>
                    </>
                  ) : pageSelector === "inventory"
                   ?<InventoryTable/>
                    :pageSelector === "dashbord"?
                    <DealerDashboard/>
                    :
                    pageSelector === "coupon" ? (
                      <CouponCardList coupon={profileData.coupon} />
                    ):pageSelector==='Plans & billings'&&profileData?.role === "Admin" &&
                    
                    <PlansAndBiillings/>
                  }
                </main>
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  height: "100vh",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "100%",
                }}
              >
                      <Loader/>

              </div>
            </>
          )}
          {isOTPmodalVisible && <OtpVerify />}
        </div>
        <StoreFooter />
      </div>
    </>
  );
};

export default ProfilePage;
