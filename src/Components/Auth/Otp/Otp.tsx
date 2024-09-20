import React, { useState } from "react";
import './Otp.scss'; // SCSS file for styling
import Header from "../../Store/Molecules/Header"; // Assuming you have a header component

export const OtpPage: React.FC = () => {
    const [otp, setOtp] = useState(Array(6).fill("")); // Assuming OTP has 6 digits

    const handleChange = (element: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = element.target.value;
        if (/^[0-9]$/.test(value) || value === "") {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);

            // Move to the next input field if the value is a number
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
                    {otp.map((data, index) => (
                        <input
                            type="text"
                            maxLength={1}
                            key={index}
                            value={otp[index]}
                            onChange={(e) => handleChange(e, index)}
                            id={`otp-input-${index}`}
                            className="otp-page__input-box"
                        />
                    ))}
                </div>
                <div className="otp-page__btn-container">
                    <button className="otp-page__btn">VERIFY</button>
                </div>
            </div>
        </>
    );
};
