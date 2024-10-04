import React, { useState } from "react";
import { TextField, CircularProgress } from '@mui/material'; // Import CircularProgress for spinner
import { PhoneInput } from "react-international-phone";
import 'react-international-phone/style.css';
import "./Login.scss";
import Header from "../../Store/Molecules/Header";
import { Link, useNavigate } from "react-router-dom";
import useMystoreStore from "../../Store/Core/Store";
import { getSubdomain } from "../../../Utils/Subdomain";
import { MdErrorOutline } from "react-icons/md";

const { hostname } = window.location;
let subdomain = getSubdomain(hostname);
console.log("ss",subdomain);

export const Login: React.FC = () => {

    const [mobileNumber, setMobileNumber] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false); // Spinner state
    const [error, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMsg] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [checkBox, setCheckBox] = useState<boolean>(false);
    const {
        setUserName,
        verifyNumber,
        checkLoggedIn,
        loginWithPassword,
        storeData
    } = useMystoreStore((state) => state);
    let navigate = useNavigate();
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!checkBox) {
            handleLogin()
        } else {
            LoginWithOtp()
        }
    }
    const handleLogin = async () => {
        setLoading(true); // Start loading spinner
        setError(false);  // Reset error state

        if (mobileNumber.trim() && password.trim() && mobileNumber.length > 7) {
            const response = await loginWithPassword(mobileNumber, password, subdomain);
            console.log("s", response);

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
            window.location.reload()
            }
        } else {
            setLoading(false); // Stop spinner if the form validation fails
            setError(true);
            setErrorMsg("Invalid mobile number or password");
        }
    };
    const LoginWithOtp = async () => {
        setLoading(true); // Start loading spinner
        setError(false); 
        let data = null;
        data = await verifyNumber(mobileNumber);
        console.log("otpres",data);
        
        if (data.error) {
            setLoading(false); 
            setError(true)
            setErrorMsg("Enter a valid mobile number")
        } else {
            setLoading(false); 
            setError(false); 
            navigate("/otp", { state: { mobileNumber,subdomain,registration:false } }); 
        }

    };
    return (
        <>
            <Header />
            <div className="login">
                <div className="login__header">
                 {`WELCOME TO ${storeData.storeName.toUpperCase()}`}
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
                            defaultCountry="in"
                            placeholder="Enter phone number"
                        />
                    </div>
                    {!checkBox ?
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
                        : <></>}
                    <div className="login__With_otp_sec">
                        <input type="checkbox" onChange={(e) => setCheckBox(e.target.checked)} /> Login With OTP
                    </div>
                    <div className="login__btn_container">
                        <button className="login__btn" onClick={handleSubmit} disabled={loading}>
                            {loading ? (
                                <CircularProgress size={24} />
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
