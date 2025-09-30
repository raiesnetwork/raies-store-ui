import React, { useState } from "react";
import { TextField, CircularProgress, Select, MenuItem, FormControl, InputAdornment, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { PhoneInput } from "react-international-phone";
import 'react-international-phone/style.css';
import "./Login.scss";
import Header from "../../Store/Molecules/Header";
import { Link, useNavigate } from "react-router-dom";
import useMystoreStore from "../../Store/Core/Store";
import { getSubdomain } from "../../../Utils/Subdomain";
import { MdErrorOutline } from "react-icons/md";
import { useAuth } from "../AuthContext";
import { forgotPassword } from "../../Store/Core/StoreApi";

const { hostname } = window.location;
let subdomain = getSubdomain(hostname);
console.log("ss", subdomain);

const Login: React.FC = () => {
    const { login } = useAuth() || {};
    const [mobileNumber, setMobileNumber] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [loginMethod, setLoginMethod] = useState<"mobile" | "email">("mobile");
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [errorMessage, setErrorMsg] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [checkBox, setCheckBox] = useState<boolean>(false);
    const [userType, setUserType] = useState<string>("Normal");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    
    // Forgot Password Dialog State
    const [forgotPasswordOpen, setForgotPasswordOpen] = useState<boolean>(false);
    const [forgotPasswordMethod, setForgotPasswordMethod] = useState<"mobile" | "email">("mobile");
    const [forgotPasswordMobile, setForgotPasswordMobile] = useState<string>("");
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState<string>("");
    const [forgotPasswordUserType, setForgotPasswordUserType] = useState<string>("Normal");
    const [forgotPasswordLoading, setForgotPasswordLoading] = useState<boolean>(false);
    const [forgotPasswordError, setForgotPasswordError] = useState<string>("");
    const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState<string>("");

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

        // Validate based on login method
        if (loginMethod === "mobile" && (!mobileNumber.trim() || mobileNumber.length < 7)) {
            setError(true);
            setErrorMsg("Please enter a valid mobile number");
            return;
        }

        if (loginMethod === "email" && (!email.trim() || !isValidEmail(email))) {
            setError(true);
            setErrorMsg("Please enter a valid email address");
            return;
        }

        if (!password.trim()) {
            setError(true);
            setErrorMsg("Please enter your password");
            return;
        }

        setLoading(true);
        setError(false);

        try {
            const identifier = loginMethod === "mobile" ? mobileNumber : email;
            const response = await loginWithPassword(identifier, password, subdomain, userType);
            console.log('response', response);

            setLoading(false);
            if (response.error) {
                if (response.subscription === false) {
                    navigate('/upgrade-plan', { state: { userId: response.userId, username: response.username } })
                }
                setError(true);
                setErrorMsg(response.message);
            } else {
                const credentials = {
                    username: response.data?.username,
                    api_token: response.data?.token,
                }
                login(credentials);
            }
        } catch (err) {
            setLoading(false);
            setError(true);
            setErrorMsg("Login failed. Please try again.");
        }
    };

    const LoginWithOtp = async () => {
        if (userType === "false") {
            setError(true)
            return setErrorMsg("Select a user type");
        }

        // Validate mobile number for OTP login
        if (loginMethod !== "mobile" || !mobileNumber.trim() || mobileNumber.length < 7) {
            setError(true);
            setErrorMsg("OTP login requires a valid mobile number");
            return;
        }

        setLoading(true);
        setError(false);
        
        try {
            let data = await verifyNumber(mobileNumber);
            console.log("otpres", data);
            
            if (data.error) {
                setLoading(false); 
                setError(true)
                setErrorMsg("Enter a valid mobile number")
            } else {
                setLoading(false); 
                setError(false); 
                navigate("/otp", { state: { mobileNumber, subdomain, registration: false, userType } }); 
            }
        } catch (err) {
            setLoading(false);
            setError(true);
            setErrorMsg("Failed to send OTP. Please try again.");
        }
    };

    const handleForgotPassword = async () => {
        if (forgotPasswordUserType === "false") {
            setForgotPasswordError("Select a user type");
            return;
        }

        if (forgotPasswordMethod === "mobile" && (!forgotPasswordMobile.trim() || forgotPasswordMobile.length < 7)) {
            setForgotPasswordError("Please enter a valid mobile number");
            return;
        }

        if (forgotPasswordMethod === "email" && (!forgotPasswordEmail.trim() || !isValidEmail(forgotPasswordEmail))) {
            setForgotPasswordError("Please enter a valid email address");
            return;
        }

        setForgotPasswordLoading(true);
        setForgotPasswordError("");
        setForgotPasswordSuccess("");

        try {
            const identifier = forgotPasswordMethod === "mobile" ? forgotPasswordMobile : forgotPasswordEmail;
            const response = await forgotPassword(identifier, forgotPasswordUserType, forgotPasswordMethod, subdomain);
            
            setForgotPasswordLoading(false);
            if (response.error) {
                setForgotPasswordError(response.message || "Failed to send reset instructions");
            } else {
                setForgotPasswordSuccess("Reset instructions sent successfully! Please check your mobile/email.");
                setTimeout(() => {
                    setForgotPasswordOpen(false);
                    // Optionally navigate to reset password page
                    // navigate("/reset-password");
                }, 2000);
            }
        } catch (err) {
            setForgotPasswordLoading(false);
            setForgotPasswordError("Failed to process request. Please try again.");
        }
    };

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const resetForgotPasswordForm = () => {
        setForgotPasswordMobile("");
        setForgotPasswordEmail("");
        setForgotPasswordUserType("Normal");
        setForgotPasswordMethod("mobile");
        setForgotPasswordError("");
        setForgotPasswordSuccess("");
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
                    {/* Login Method Toggle */}
                    {/* <div className="login__method_toggle">
                        <button
                            type="button"
                            className={`login__method_btn ${loginMethod === "mobile" ? "active" : ""}`}
                            onClick={() => setLoginMethod("mobile")}
                        >
                            Mobile
                        </button>
                        <button
                            type="button"
                            className={`login__method_btn ${loginMethod === "email" ? "active" : ""}`}
                            onClick={() => setLoginMethod("email")}
                        >
                            Email
                        </button>
                    </div> */}

                    {/* Mobile Number Input */}
                    {loginMethod === "mobile" && (
                        <div className="login__input_container">
                            <PhoneInput
                                value={mobileNumber}
                                onChange={setMobileNumber}
                                className="login__phone_input_field"
                                defaultCountry="in"
                                placeholder="Enter phone number"
                            />
                        </div>
                    )}

                    {/* Email Input */}
                    {loginMethod === "email" && (
                        <div className="login__input_container">
                            <TextField
                                fullWidth
                                label="Email Address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="login__input_field"
                                placeholder="Enter your email"
                            />
                        </div>
                    )}

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

                    {/* Password Input */}
                    {!checkBox && (
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
                    )}

                    <div className="login__With_otp_sec">
                        <input 
                            type="checkbox" 
                            onChange={(e) => setCheckBox(e.target.checked)} 
                            disabled={loginMethod === "email"} // Disable OTP for email login
                        /> 
                        Login With OTP
                        {loginMethod === "email" && (
                            <span className="login__otp_disabled_note">
                                (OTP available only for mobile login)
                            </span>
                        )}
                    </div>

                    {/* Forgot Password Link */}
                    <div className="login__forgot_password">
                        <button 
                            type="button" 
                            className="login__forgot_password_link"
                            onClick={() => setForgotPasswordOpen(true)}
                        >
                            Forgot Password?
                        </button>
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

                {/* Forgot Password Dialog */}
                <Dialog 
                    open={forgotPasswordOpen} 
                    onClose={() => {
                        setForgotPasswordOpen(false);
                        resetForgotPasswordForm();
                    }}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle>Reset Your Password</DialogTitle>
                    <DialogContent>
                        <div className="login__forgot_password_content">
                            <p>Enter your details to receive reset instructions</p>
                            
                            {/* Method Toggle */}
                            <div className="login__method_toggle">
                                <button
                                    type="button"
                                    className={`login__method_btn ${forgotPasswordMethod === "mobile" ? "active" : ""}`}
                                    onClick={() => setForgotPasswordMethod("mobile")}
                                >
                                    Mobile
                                </button>
                                <button
                                    type="button"
                                    className={`login__method_btn ${forgotPasswordMethod === "email" ? "active" : ""}`}
                                    onClick={() => setForgotPasswordMethod("email")}
                                >
                                    Email
                                </button>
                            </div>

                            {/* Mobile Input */}
                            {forgotPasswordMethod === "mobile" && (
                                <div className="login__input_container">
                                    <PhoneInput
                                        value={forgotPasswordMobile}
                                        onChange={setForgotPasswordMobile}
                                        className="login__phone_input_field"
                                        defaultCountry="in"
                                        placeholder="Enter registered phone number"
                                    />
                                </div>
                            )}

                            {/* Email Input */}
                            {forgotPasswordMethod === "email" && (
                                <div className="login__input_container">
                                    <TextField
                                        fullWidth
                                        label="Registered Email"
                                        type="email"
                                        value={forgotPasswordEmail}
                                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                                        placeholder="Enter your registered email"
                                    />
                                </div>
                            )}

                            {/* User Type for Forgot Password */}
                            <div className="login__input_container">
                                <FormControl fullWidth>
                                    <Select
                                        value={forgotPasswordUserType}
                                        onChange={(e) => setForgotPasswordUserType(e.target.value)}
                                    >
                                        <MenuItem value="false">Select User Role</MenuItem>
                                        <MenuItem value="Normal">Standard User</MenuItem>
                                        <MenuItem value="Dealer">Business Partner</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>

                            {/* Success Message */}
                            {forgotPasswordSuccess && (
                                <div className="login__success_sec">
                                    <div className="login__success_msg">
                                        {forgotPasswordSuccess}
                                    </div>
                                </div>
                            )}

                            {/* Error Message */}
                            {forgotPasswordError && (
                                <div className="login__error_sec">
                                    <MdErrorOutline />
                                    <div className="login__error_msg">
                                        {forgotPasswordError}
                                    </div>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <button 
                            onClick={() => {
                                setForgotPasswordOpen(false);
                                resetForgotPasswordForm();
                            }}
                            className="login__cancel_btn"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleForgotPassword}
                            disabled={forgotPasswordLoading}
                            className="login__submit_btn"
                        >
                            {forgotPasswordLoading ? (
                                <CircularProgress size={20} />
                            ) : (
                                "Send Reset Instructions"
                            )}
                        </button>
                    </DialogActions>
                </Dialog>
            </div>
        </>
    );
};

export default Login;