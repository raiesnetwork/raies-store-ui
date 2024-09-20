import React, { useState } from "react";
import { TextField } from '@mui/material';
import { PhoneInput } from "react-international-phone";
import 'react-international-phone/style.css'; // Make sure to include the required styles
import "./Login.scss";
import Header from "../../Store/Molecules/Header";
import { Link } from "react-router-dom";

export const Login: React.FC = () => {
    const [phone, setPhone] = useState<string>("");

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
                            value={phone}
                            onChange={setPhone}
                            className="login__phone_input_field"
                            defaultCountry="US" // You can set default country if required
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
                        />
                    </div>
                    <div className="login__btn_container">
                        <button className="login__btn">SIGN IN</button>
                    </div>
                    <div className="login__redirect_text_sec">
                        <div className="login__redirect_text">
                            <span className="login__redirect_txt">Don't have an account ?</span>
                            <Link to="/register" className="login__redirect_link">SIGN UP</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
