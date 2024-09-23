import React, { useState } from "react";
import { TextField, CircularProgress } from '@mui/material'; // Import CircularProgress for spinner
import { PhoneInput } from "react-international-phone";
import 'react-international-phone/style.css';
import "./Login.scss";
import Header from "../../Store/Molecules/Header";
import { Link } from "react-router-dom";
import useMystoreStore from "../../Store/Core/Store";
import { toast } from "react-toastify";
import { getSubdomain } from "../../../Utils/Subdomain";
import { MdErrorOutline } from "react-icons/md";

const { hostname } = window.location;
let subdomain = getSubdomain(hostname);

export const Login: React.FC = () => {
    const [mobileNumber, setMobileNumber] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false); // Spinner state
    const [error, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMsg] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const {
        setUserName,
        loginUser,
        verifyNumber,
        checkLoggedIn,
        loginWithPassword,
    } = useMystoreStore((state) => state);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true); // Start loading spinner
        setError(false);  // Reset error state

        if (mobileNumber.trim() && password.trim() && mobileNumber.length > 7) {
            const response = await loginWithPassword(mobileNumber, password, subdomain);
            console.log("s",response);
            
            setLoading(false); // Stop spinner once response is received
            if (response.error) {
                setError(true);
                setErrorMsg(response.message);
            } else {
                checkLoggedIn(true);
                setUserName(response.data?.username);
                localStorage.setItem("user", response.data?.username);
                localStorage.setItem(
                    "kt-auth-react-st",
                    JSON.stringify({ api_token: response.data?.token })
                );
                window.location.reload();
                console.log("Login successful:", response.data); // Log the response
            }
        } else {
            setLoading(false); // Stop spinner if the form validation fails
            setError(true);
            setErrorMsg("Invalid mobile number or password");
        }
    };

    return (
        <>
            <Header />
            <div className="login">
                <div className="login__header">
                    WELCOME TO RAIES NETWORK
                </div>
                <div className="login__header_login">
                    SIGN IN
                </div>
                <div className="login__container">
                    <div className="login__input_container">
                        <PhoneInput
                            value={mobileNumber}
                            onChange={setMobileNumber}
                            className="login__phone_input_field"
                            defaultCountry="IN"
                            placeholder="Enter phone number"
                        />
                    </div>
                    <div className="login__input_container">
                        <TextField
                            id="outlined-password-input"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login__input_field"
                        />
                    </div>
                    <div className="login__btn_container">
                        <button className="login__btn" onClick={handleLogin} disabled={loading}>
                            {loading ? (
                                <CircularProgress size={24}  />
                            ) : (
                                "SIGN IN"
                            )}
                        </button>
                    </div>
                    <div className="login__redirect_text_sec">
                        <div className="login__redirect_text">
                            <span className="login__redirect_txt">Don't have an account ?</span>
                            <Link to="/register" className="login__redirect_link">SIGN UP</Link>
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
