import React, { useState } from "react";
import '../Helpers/scss/LoginModal.scss';
import '../Helpers/scss/SignupModal.scss';
import useMystoreStore from "../Core/Store";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { toast ,ToastContainer} from "react-toastify";
import { getSubdomain } from "../../../Utils/Subdomain";
const {hostname}=window.location
  getSubdomain(hostname)
const SignupModal: React.FC = () => {
  const { signupModal ,verifyNumber,createUser} = useMystoreStore((s) => s);
  const [username, setUsername] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [isOtpVisible, setIsOtpVisible] = useState<boolean>(false);
  const [btnFalse, setBtnFalse] = useState<boolean>(false);
  
  // Validation states
  const [isUsernameValid, setIsUsernameValid] = useState<boolean>(true);
  const [isMobileNumberValid, setIsMobileNumberValid] = useState<boolean>(true);
  const [isOtpValid, setIsOTpValid] = useState<boolean>(true);

  const handleVerify = async(e: React.FormEvent) => {
    e.preventDefault();

    const validUsername = username.trim().length >= 3;
    const validMobileNumber = mobileNumber.trim().length >= 7;

    setIsUsernameValid(validUsername);
    setIsMobileNumberValid(validMobileNumber);

    if (validUsername && validMobileNumber) {

      const  data=await verifyNumber(mobileNumber)
      if (data.error) {
       return toast.error("Enter a valid mobile Number")
      }
      setIsOtpVisible(true);
    }
  };

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault();
    
    const validOtp = otp.trim().length === 6;
        setIsOTpValid(validOtp)
        if (validOtp&&isMobileNumberValid&&isUsernameValid&&hostname.trim()) {
          setBtnFalse(true)
          const data=await createUser({fullName:username,mobileNumber:mobileNumber,otp:otp,hostname:hostname})
          setBtnFalse(false)

         if (data.error) {
         return toast.error("Faild to create try again")

         }else{
          if (data.data===false) {
          return  toast.error("Invalid OTP")

          }else if (data.data==="exist") {
           return toast.success("Already Youhave an account")

          } else{
           return toast.success("User Created Successfully")

          }
         }
        }
        toast.success("User Created Successfully")

    signupModal();
  };

  return (
    <>
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
            <button disabled={btnFalse} type="submit">{isOtpVisible ? "Submit" : "Verify"}</button>
            <button type="button" style={{color:"black"}} onClick={signupModal}>Close</button>
          </div>
        </form>
      </div>
    </div>
    <ToastContainer/>
    </>
  );
};

export default SignupModal;
