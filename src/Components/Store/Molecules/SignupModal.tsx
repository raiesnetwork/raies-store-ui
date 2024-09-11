import React, { useState } from "react";
import '../Helpers/scss/LoginModal.scss';

interface LoginModalProps {
  closeModal: () => void;
}

const SignupModal: React.FC<LoginModalProps> = ({ closeModal }) => {
  const [username, setUsername] = useState<string>('');
  const [mobileNumber, setMobileNumber] = useState<string>('');
  const [otp, setOtp] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    closeModal(); 
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
          <div className="login-modal__field">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="login-modal__field">
            <label>Mobile Number:</label>
            <input
              type="text"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              required
            />
          </div>
          <div className="login-modal__field">
            <label>OTP:</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <div className="login-modal__actions">
            <button type="submit">Verify & Submit</button>
            <button type="button" onClick={closeModal}>Close</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupModal;
