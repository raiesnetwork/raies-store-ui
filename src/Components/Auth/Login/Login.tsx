import React, { useState } from "react";
import { TextField, CircularProgress, Select, MenuItem, FormControl, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material'; // Import eye icons
import { PhoneInput } from "react-international-phone";
import 'react-international-phone/style.css';
import "./Login.scss";
import Header from "../../Store/Molecules/Header";
import { Link, useNavigate } from "react-router-dom";
import useMystoreStore from "../../Store/Core/Store";
import { getSubdomain } from "../../../Utils/Subdomain";
import { MdErrorOutline } from "react-icons/md";
import { useAuth } from "../AuthContext";

const { hostname } = window.location;
let subdomain = getSubdomain(hostname);
console.log("ss",subdomain);

const Login: React.FC = () => {
    const { login } = useAuth() || {};
    const [mobileNumber, setMobileNumber] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMsg] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [checkBox, setCheckBox] = useState<boolean>(false);
    const [userType, setUserType] = useState<string>("Normal");
    const [showPassword, setShowPassword] = useState<boolean>(false); // Password visibility state

    const {
        verifyNumber,
        loginWithPassword,
        storeData
    } = useMystoreStore((state) => state);
    
    let navigate = useNavigate();

    // Toggle password visibility
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!checkBox) {
            handleLogin()
        } else {
            LoginWithOtp()
        }
    }

    const handleLogin = async () => {
        if (userType === "false") {
            setError(true)
            return setErrorMsg("Select a user type");
        }
        setLoading(true);
        setError(false);

        if (mobileNumber.trim() && password.trim() && mobileNumber.length > 7) {
            const response = await loginWithPassword(mobileNumber, password, subdomain, userType);
            console.log('response',response);

            setLoading(false);
            if (response.error) {
                if(response.subscription===false){
                    navigate('/upgrade-plan',{state:{userId:response.userId,username:response.username}})
                }
                setError(true);
                setErrorMsg(response.message);
            } else {
                const credentials={
                    username:response.data?.username,
                    api_token: response.data?.token,
                }
                login(credentials);
            }
        } else {
            setLoading(false);
            setError(true);
            setErrorMsg("Invalid mobile number or password");
        }
    };

    const LoginWithOtp = async () => {
        if (userType === "false") {
            setError(true)
            return setErrorMsg("Select a user type");
        }
        setLoading(true);
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
            navigate("/otp", { state: { mobileNumber, subdomain, registration: false, userType } }); 
        }
    };

    return (
        <>
            <Header />
            <div className="login">
                <div className="login__header">
                 {`WELCOME TO ${storeData?.storeName?.toUpperCase()}`}
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
                    {!checkBox ?
                        <div className="login__input_container">
                            <TextField
                                id="outlined-password-input"
                                label="Password"
                                type={showPassword ? "text" : "password"}
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="login__input_field"
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
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

export default Login