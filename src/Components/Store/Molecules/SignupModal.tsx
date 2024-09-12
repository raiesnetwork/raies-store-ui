import React, { useState } from "react";
import '../Helpers/scss/LoginModal.scss';
import '../Helpers/scss/SignupModal.scss';
import useMystoreStore from "../Core/Store";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const SignupModal: React.FC = () => {
  const { signupModal } = useMystoreStore((s) => s);
  const [username, setUsername] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [isOtpVisible, setIsOtpVisible] = useState<boolean>(false);
  
  // Validation states
  const [isUsernameValid, setIsUsernameValid] = useState<boolean>(true);
  const [isMobileNumberValid, setIsMobileNumberValid] = useState<boolean>(true);
  const [isOtpValid, setIsOTpValid] = useState<boolean>(true);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();

    const validUsername = username.trim().length >= 3;
    const validMobileNumber = mobileNumber.trim().length >= 7;

    setIsUsernameValid(validUsername);
    setIsMobileNumberValid(validMobileNumber);

    if (validUsername && validMobileNumber) {
      setIsOtpVisible(true); // Show OTP field
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validOtp = otp.trim().length === 6;
        setIsOTpValid(validOtp)
    signupModal();
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <h2>Signup</h2>
        <form onSubmit={isOtpVisible ? handleSubmit : handleVerify}>
          {
            !isOtpVisible&&(
          <>
          {/* Username Input */}
          <div className="login-modal__field">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={!isUsernameValid ? 'input-error' : ''}
              placeholder="Enter username"
            style={{
              width:"94%"
            }}
            />
            {!isUsernameValid && <span className="error-message">Username must be at least 3 characters long.</span>}
          </div>
          
          {/* Mobile Number Input */}
          <div className="login-modal__field">
            <label>Mobile Number:</label>
            <PhoneInput
              country={'in'}
              value={mobileNumber}
              onChange={(phone) => setMobileNumber(phone)}
              inputProps={{
                name: 'mobile',
                required: true,
              }}
              containerClass={!isMobileNumberValid ? 'input-error' : ''}
            />
            {!isMobileNumberValid && <span className="error-message">Enter a valid mobile number.</span>}
          </div>
          </>
          )}
          {/* OTP Input (shown only after verification) */}
          {isOtpVisible && (
            <div className="login-modal__field">
              <label>OTP:</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="Enter OTP"
                style={{
                  width:"94%"
                }}
                maxLength={6}
                className={!isOtpValid ? 'input-error' : ''}

              />
        {!isOtpValid && <span className="error-message">Enter a valid OTP number.</span>}

            </div>
          )}

          {/* Actions */}
          <div className="login-modal__actions">
            <button type="submit">{isOtpVisible ? "Submit" : "Verify"}</button>
            <button type="button" onClick={signupModal}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;
