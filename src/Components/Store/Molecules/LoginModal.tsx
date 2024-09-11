import React, { useState } from "react";
import 'react-phone-input-2/lib/style.css';
import '../Helpers/scss/LoginModal.scss';
import PhoneInput from 'react-phone-input-2';
import useMystoreStore from "../Core/Store";
import { toast } from "react-toastify";

interface LoginModalProps {
  closeModal: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ closeModal }) => {
  const {loginUser,verifyNumber}=useMystoreStore((s)=>s)
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [otp, setOtp] = useState<string>('');
  const [otpFieldSet, setOtpField] = useState<boolean>(false);
console.log(mobileNumber);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpField(true);
    let data=null
    if (mobileNumber.trim()&&!otp) {

     data=await verifyNumber(mobileNumber)
     if (data.error) {
     return toast.error("Enter Valid mobile number")
     }
    }
    if (mobileNumber.trim()&&otp.trim()) {
    const  datas=await loginUser(mobileNumber,otp)
    if (datas.error) {
      return toast.error("Enter Valid mobile number")

    }else{
      if (datas?.data===false) {
        return toast.error("Invalid Otp")

      }else{
        localStorage.setItem('kt-auth-react-st',datas?.data?.token)

      }
    }

    }
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          {!otpFieldSet ? (
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
              />
            </div>
          ) : (
            <div className="login-modal__field">
              <label>OTP:</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength={6}
              />
            </div>
          )}
          <div className="login-modal__actions">
            <button type="submit">Verify</button>
            <button type="button" onClick={closeModal}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
