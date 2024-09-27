import React, { useEffect, useState } from "react";
import "../Helpers/scss/ProfilePage.scss";
import Header from "./Header";
import { Link } from "react-router-dom";
import { FiUser } from "react-icons/fi";
import { CiEdit } from "react-icons/ci";
import { toast, ToastContainer } from "react-toastify";
import useMystoreStore from "../Core/Store";
import { updateProfileInfo } from "../Core/Interfaces";

const ProfilePage: React.FC = () => {
  const { getProfileInfo, updateProfileInfo, profileData } = useMystoreStore(
    (s) => s
  );
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
    subscriptionId:profileData.subscriptionId
  });
  useEffect(() => {
    if (profileData) {
      setFormData(profileData);
    }
  }, [profileData]);
  const [loader,setLoader]=useState<boolean>(true)
  useEffect(() => {
    const apiHelper = async () => {
      const data = await getProfileInfo();
      setLoader(false)
      if (data.error) {
        toast.error("cant fetch user data");
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

  //   const [useName, setUserName] = useState<string | null>("");
  //   useEffect(() => {
  //     const name = localStorage.getItem("user");
  //     setUserName(name);
  //   }, []);
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
        toast.error("File size must be less than or equal to 1MB.");
      }
    } else {
      toast.error("Please upload a valid image file.");
    }
  };
  const [nameSaveBtnVisible, setnameSaveBtnVisible] = useState<boolean>(false);
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
          toast.error("We cant update now try after some time");
        } else {
          toast.success("Updated Successfully");
        }
      } else {
        toast.error("Add any valid name");
      }

      setnameBtnDisable(false);
    } else {
      toast.error("Please add any changes");
    }
  };
  console.log(profileData);

  return (
    <>{
        !loader?
   <>
      <Header />
      <div className="profile-page">
        <aside className="sidebar">
          <div className="profile-pic">
            {formData.profileImage ? (
              <img src={formData.profileImage} alt="Profile" />
            ) : (
              <FiUser className="header__profile_icon" />
            )}

            <h3>
              Hello{" "}
              <span style={{ color: "blue" }}>
                {profileData?.fullName}
                {profileData?.role === "Admin" ? ` (${profileData?.role})` : ""}
              </span>
            </h3>
          </div>
          <nav>
            <ul>
              <li
                style={{
                  fontWeight: "bold",
                  padding: "20px",
                  backgroundColor: "lightgray",
                }}
              >
                Personal Info.
              </li>
              <li>Change Password</li>
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
                      onClick={() => setnameSaveBtnVisible(!nameSaveBtnVisible)}
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
                    pointerEvents: nameSaveBtnVisible ? "auto" : "none",
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
                      pointerEvents: nameSaveBtnVisible ? "auto" : "none",
                    }}
                  >
                    <label
                      style={{ fontWeight: "normal", marginBottom: "5px" }}
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
                        pointerEvents: nameSaveBtnVisible ? "auto" : "none",
                      }}
                    >
                      <label
                        style={{ fontWeight: "normal", marginBottom: "5px" }}
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
                        pointerEvents: nameSaveBtnVisible ? "auto" : "none",
                      }}
                    >
                      <label
                        style={{ fontWeight: "normal", marginBottom: "5px" }}
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
                        pointerEvents: nameSaveBtnVisible ? "auto" : "none",
                      }}
                    >
                      <label
                        style={{ fontWeight: "normal", marginBottom: "5px" }}
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
                        pointerEvents: nameSaveBtnVisible ? "auto" : "none",
                      }}
                    >
                      <label
                        style={{ fontWeight: "normal", marginBottom: "5px" }}
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
                        pointerEvents: nameSaveBtnVisible ? "auto" : "none",
                      }}
                    >
                      <label
                        style={{ fontWeight: "normal", marginBottom: "5px" }}
                      >
                        storeIcon
                      </label>
                      <img
                        style={{ width: "70px", height: "70px" }}
                        src={formData.storeIcon ? formData.storeIcon : ""}
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
                        pointerEvents: nameSaveBtnVisible ? "auto" : "none",
                      }}
                    >
                      <label
                        style={{ fontWeight: "normal", marginBottom: "5px" }}
                      >
                        Store Banner
                      </label>
                      <img
                        style={{ width: "70px", height: "70px" }}
                        src={formData.storeBanner ? formData.storeBanner : ""}
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
                    pointerEvents: nameSaveBtnVisible ? "auto" : "none",
                  }}
                >
                  <label style={{ fontWeight: "normal", marginBottom: "5px" }}>
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
                  cursor: emailSaveBtnVisible ? "auto" : "not-allowed",
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
                    pointerEvents: emailSaveBtnVisible ? "auto" : "none",
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
                    onClick={handilNameSave}
                    disabled={!emailSaveBtnVisible}
                    style={{
                      height: "100%",
                      width: "20%",
                      opacity: emailSaveBtnVisible ? "1" : "0",
                      cursor: emailSaveBtnVisible ? "pointer" : "auto",
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
                  cursor: mobileSaveBtnVisible ? "auto" : "not-allowed",
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
                          setMobileSaveBtnVisible(!mobileSaveBtnVisible)
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
                    pointerEvents: mobileSaveBtnVisible ? "auto" : "none",
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
                    onClick={handilNameSave}
                    disabled={!mobileSaveBtnVisible}
                    style={{
                      height: "100%",
                      width: "20%",
                      opacity: mobileSaveBtnVisible ? "1" : "0",
                      cursor: mobileSaveBtnVisible ? "pointer" : "auto",
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
        </main>
      </div>
      </>
:<>
<div style={{height:"100vh",alignItems:"center",justifyContent:"center"}}>Loading...</div>
</>}
<ToastContainer/>
    </>
  );
};

export default ProfilePage;
