import React, { useState } from "react";
import { TextField, CircularProgress } from '@mui/material';
import { PhoneInput } from "react-international-phone";
import 'react-international-phone/style.css'; // Make sure to include the required styles
import "../Login/Login.scss";
import Header from "../../Store/Molecules/Header";
import { Link, useNavigate } from "react-router-dom";
import { MdErrorOutline } from "react-icons/md";
import useMystoreStore from "../../Store/Core/Store";
import { getSubdomain } from "../../../Utils/Subdomain";

const { hostname } = window.location;
let subdomain = getSubdomain(hostname);

export const Register: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [mobileNumber, setMobileNumber] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false); // Spinner state
    const [error, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMsg] = useState<string>("");

    const { registrationVerify } = useMystoreStore((state) => state);


    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true);
        e.preventDefault();
        const data = await registrationVerify(mobileNumber, subdomain);
        if (data.error) {
            setLoading(false);
            setError(true)
            setErrorMsg(data.message)
        } else {
            setLoading(false);
            setError(false);
            navigate("/otp", { state: { mobileNumber, subdomain, username, password, registration: true } });
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
                    REGISTER
                </div>
                <div className="login__container">
                    <div className="login__input_container">
                        <TextField
                            id="outlined-password-input"
                            label="Name"
                            type="text"
                            autoComplete="current-password"
                            className="login__input_field"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="login__input_container">
                        <PhoneInput
                            value={mobileNumber}
                            onChange={setMobileNumber}
                            className="login__phone_input_field"
                            defaultCountry="in" // You can set default country if required
                            placeholder="Enter phone number"
                        />
                    </div>
                    <div className="login__input_container">
                        <TextField
                            id="outlined-password-input"
                            label="Password"
                            type="password"
                            autoComplete="current-password"
                            className="login__input_field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="login__btn_container">
                        <button className="login__btn" onClick={handleSubmit} disabled={loading}>
                            {loading ? (
                                <CircularProgress size={24} />
                            ) : (
                                "SIGN UP"
                            )}
                        </button>
                    </div>
                    <div className="login__redirect_text_sec">
                        <div className="login__redirect_text">
                            <span className="login__redirect_txt">Already have an account ?</span>
                            <Link to="/login" className="login__redirect_link">LOG IN</Link>
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
}
