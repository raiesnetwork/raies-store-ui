import React, { useState } from "react";
import { TextField, CircularProgress, Select, MenuItem, FormControl } from "@mui/material";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css"; // Make sure to include the required styles
import "../Login/Login.scss";
import Header from "../../Store/Molecules/Header";
import { Link, useNavigate } from "react-router-dom";
import { MdErrorOutline } from "react-icons/md";
import useMystoreStore from "../../Store/Core/Store";
import { getSubdomain } from "../../../Utils/Subdomain";
import { toast } from "react-toastify";
import { FaCrown } from "react-icons/fa6";

const { hostname } = window.location;
let subdomain = getSubdomain(hostname);

export const Register: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [mobileNumber, setMobileNumber] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false); // Spinner state
    const [error, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMsg] = useState<string>("");
    const [userType, setUserType] = useState<string>("false"); // User type state
    const [paymentType, setPaymentType] = useState<string>("false"); // Payment type state
    const [businessPartnerType, setBusinessPartnerType] = useState<string>(""); // New state for business partner type

    const { registrationVerify } = useMystoreStore((state) => state);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        try {
            setLoading(true);
            e.preventDefault();

            if (!mobileNumber.trim() || !username.trim()) {
                return toast.error("Fill the input fields properly");
            }
            if (!password.trim()) {
                return toast.error("Enter a valid password");
            }
            if (userType === "false") {
                return toast.error("Select a user type");
            }
            if (userType === "Dealer" && paymentType === "false") {
                return toast.error("Select a payment type");
            }
            if (userType === "Dealer" && !businessPartnerType.trim()) {
                return toast.error("Enter your Business Partner Type");
            }

            const data = await registrationVerify(mobileNumber, subdomain);
            if (data.error) {
                setLoading(false);
                setError(true);
                setErrorMsg(data.message);
            } else {
                setLoading(false);
                setError(false);
                navigate("/otp", { 
                    state: { 
                        mobileNumber, 
                        subdomain, 
                        username, 
                        password, 
                        userType, 
                        paymentType, 
                        businessPartnerType, // Include the new field
                        registration: true 
                    } 
                });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handlePremiumplan = () => {
        if (!mobileNumber.trim() || !username.trim()) {
            return toast.error("Fill the input fields properly");
        }
        if (userType === "Dealer" && paymentType === "false") {
            return toast.error("Select a payment type");
        }
        if (!password.trim()) {
            return toast.error("Enter a valid password");
        }
        if (userType === "Dealer" && !businessPartnerType.trim()) {
            return toast.error("Enter your Business Partner Type");
        }

        navigate("/billing", { 
            state: { 
                mobileNumber, 
                username, 
                userType, 
                paymentType, 
                businessPartnerType, // Include the new field
                password 
            } 
        });
    };

    return (
        <>
            <Header />
            <div className="login">
                <div className="login__header">
                    WELCOME TO <span style={{ color: "blueviolet" }}>iXES</span> IRP COMMERCE
                </div>
                <div className="login__header_login">REGISTER</div>
                <div className="login__container">
                    <div className="login__input_container">
                        <TextField
                            id="outlined-username"
                            label="Name"
                            type="text"
                            className="login__input_field"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    {/* User Type Selector */}
                    <div className="login__input_container">
                        <FormControl fullWidth>
                            <Select
                                id="user-type"
                                value={userType}
                                onChange={(e) => setUserType(e.target.value)}
                            >
                                <MenuItem value="false">Select User Role</MenuItem>
                                <MenuItem value="Normal">Standard User</MenuItem>
                                <MenuItem value="Dealer">Business Partner</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    {/* Business Partner Type (Only if user selects "Dealer") */}
                    {userType === "Dealer" && (
                        <div className="login__input_container">
                            <TextField
                                id="business-partner-type"
                                label="Business Partner Type"
                                type="text"
                                className="login__input_field"
                                value={businessPartnerType}
                                onChange={(e) => setBusinessPartnerType(e.target.value)}
                            />
                        </div>
                    )}

                    {/* Payment Type Dropdown (Only for Dealers) */}
                    {userType === "Dealer" && (
                        <div className="login__input_container">
                            <FormControl fullWidth>
                                <Select
                                    id="payment-type"
                                    value={paymentType}
                                    onChange={(e) => setPaymentType(e.target.value)}
                                >
                                    <MenuItem value="false">Payment Type</MenuItem>
                                    <MenuItem value="Up Front">Up Front</MenuItem>
                                    <MenuItem value="Monthly Payment">Monthly Payment</MenuItem>
                                    <MenuItem value="Credit">Credit</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    )}

                    <div className="login__input_container">
                        <PhoneInput
                            value={mobileNumber}
                            onChange={setMobileNumber}
                            className="login__phone_input_field"
                            defaultCountry="in"
                            placeholder="Enter phone number"
                        />
                    </div>

                    <div className="login__input_container">
                        <TextField
                            id="outlined-password-input"
                            label="Password"
                            type="password"
                            className="login__input_field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className="login__btn_container">
                        {userType === "Dealer" ? (
                            <button className="login__btn" onClick={handlePremiumplan}>
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: "5px"
                                }}>
                                    <FaCrown size={22} style={{ paddingBottom: "5px" }} />
                                    GET PREMIUM PLAN
                                </div>
                            </button>
                        ) : (
                            <button className="login__btn" onClick={handleSubmit} disabled={loading}>
                                {loading ? <CircularProgress size={24} /> : "SIGN UP"}
                            </button>
                        )}
                    </div>

                    <div className="login__redirect_text_sec">
                        <div className="login__redirect_text">
                            <span className="login__redirect_txt">Already have an account?</span>
                            <Link to="/login" className="login__redirect_link">
                                LOG IN
                            </Link>
                        </div>
                    </div>

                    {error && (
                        <div className="login__error_sec">
                            <MdErrorOutline />
                            <div className="login__error_msg">
                                {errorMessage || "Login Error"}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
