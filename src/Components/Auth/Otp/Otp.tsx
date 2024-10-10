import {  useLocation } from "react-router-dom";
import useMystoreStore from "../../Store/Core/Store";
import { toast } from "react-toastify";
import { useState } from "react";
import Header from "../../Store/Molecules/Header";
import "./Otp.scss"

export const OtpPage: React.FC = () => {
    const [otp, setOtp] = useState(Array(6).fill(""));
    const { loginUser, createUser, setUserName, checkLoggedIn } = useMystoreStore((state) => state);
    // const navigate = useNavigate();
    const location = useLocation();

    // Extract necessary data from location state
    const mobileNumber = location.state?.mobileNumber || "";
    const subdomain = location.state?.subdomain || "";
    const registration = location.state?.registration || false;
    const username = location.state?.username || "";
    const password = location.state?.password || "";

    const handleOtpSubmit = async () => {
        const enteredOtp = otp.join(""); // Combine the array into a single string

        if (enteredOtp.length === 6 && mobileNumber) {
            let response;

            if (registration) {
                // Registration Flow: Create a new user
                response = await createUser({
                    fullName: username,
                    mobileNumber,
                    otp: enteredOtp,
                    hostname: subdomain,
                    password
                });

                if (response.error) {
                    toast.error(response.message || "User registration failed");
                } else {
                    toast.success("User registered successfully!");
                    checkLoggedIn(true);
                    setUserName(response.data?.username);
                    localStorage.setItem("user", response.data?.username);
                    localStorage.setItem(
                        "kt-auth-react-st",
                        JSON.stringify({ api_token: response.data?.token })
                    );
                    window.location.reload() // Redirect to home page on successful registration
                }
            } else {
                // Login Flow: Verify OTP for existing user
                response = await loginUser(mobileNumber, enteredOtp, subdomain);

                if (response.error) {
                    toast.error(response.message || "OTP verification failed");
                } else {
                    checkLoggedIn(true);
                    setUserName(response.data?.username);
                    localStorage.setItem("user", response.data?.username);
                    localStorage.setItem(
                        "kt-auth-react-st",
                        JSON.stringify({ api_token: response.data?.token })
                    );
                    toast.success("OTP verified successfully!");
                    window.location.reload() // Redirect to home page on successful login
                }
            }
        } else {
            toast.error("Please enter a valid 6-digit OTP.");
        }
    };

    const handleChange = (element: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = element.target.value;
        if (/^[0-9]$/.test(value) || value === "") {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            if (value && index < otp.length - 1) {
                const nextSibling = document.getElementById(`otp-input-${index + 1}`);
                if (nextSibling) {
                    nextSibling.focus();
                }
            }
        }
    };

    return (
        <>
            <Header />
            <div className="otp-page">
                <div className="otp-page__header">
                    Enter OTP
                </div>
                <div className="otp-page__input-container">
                    {otp.map((data: any, index) => (
                        <input
                            type="text"
                            maxLength={1}
                            key={index ? index : data}
                            value={otp[index]}
                            onChange={(e) => handleChange(e, index)}
                            id={`otp-input-${index}`}
                            className="otp-page__input-box"
                        />
                    ))}
                </div>
                <div className="otp-page__btn-container">
                    <button className="otp-page__btn" onClick={handleOtpSubmit}>
                        VERIFY
                    </button>
                </div>
            </div>
        </>
    );
};
