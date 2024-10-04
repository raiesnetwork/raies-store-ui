import React, { useState, useRef, useEffect } from "react";
import useMystoreStore from "../Core/Store";
import { updateMailApi, updateMobileNumberApi } from "../Core/StoreApi";
import { toast } from "react-toastify";
import { getSubdomain } from "../../../Utils/Subdomain";
const { hostname } = window.location;
const hostName = getSubdomain(hostname);
const OtpVerify: React.FC = () => {
  const { setIsOtpModalVisible, modalOpener, verifyEmail, verifyNumber } =
    useMystoreStore((s) => s);
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;

    if (!isNaN(Number(value)) && value.length === 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;

    if (modalOpener) {
      if (emailRegex.test(modalOpener)) {
        // It's an email
        verifyEmail(modalOpener);
      } else if (phoneRegex.test(modalOpener)) {
        // It's a phone number
        verifyNumber(modalOpener);
      }
    }
  }, []);
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index] === "") {
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      } else {
        // Clear current input on backspace
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleSubmit = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;

    if (modalOpener) {
      if (emailRegex.test(modalOpener)) {
        // It's an email
        const mailResp = await updateMailApi(modalOpener, otp.join(""));
        if (mailResp?.error) {
          toast.error(
            "There was an error verifying your OTP. Please try again."
          );
        } else {
          if (!mailResp?.data) {
            toast.error(
              "The OTP you entered is invalid. Please check and try again."
            );
          } else {
            toast.success("Your changes have been successfully updated!");
          }
        }
      } else if (phoneRegex.test(modalOpener)) {
        // It's a phone number
        const numberResp = await updateMobileNumberApi(
          modalOpener,
          otp.join(""),
          hostName
        );
        if (numberResp?.error) {
          toast.error(
            "There was an error verifying your OTP. Please try again."
          );
        } else {
          if (!numberResp?.data) {
            toast.error(
              "The OTP you entered is invalid. Please check and try again."
            );
          } else if (numberResp?.data === "exist") {
            toast.error(
              "Oops! This number is already registered. Please try another one."
            );
          } else {
            setIsOtpModalVisible("");
            toast.success("Your changes have been successfully updated!");
          }
        }
      }
    }
  };

  return (
    <div style={styles.modalBackground}>
      <div style={styles.modalContent}>
        <p
          onClick={() => setIsOtpModalVisible("")}
          style={{ textAlign: "right", cursor: "pointer" }}
        >
          X
        </p>
        <h3 style={styles.heading}>Enter OTP</h3>
        <div style={styles.otpContainer}>
          {otp.map((_, index) => (
            <input
              key={index}
              type="text"
              value={otp[index]}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              maxLength={1}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.input}
            />
          ))}
        </div>
        <button onClick={handleSubmit} style={styles.verifyButton}>
          Verify
        </button>
      </div>
    </div>
  );
};

const styles = {
  modalBackground: {
    position: "fixed" as "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    background: "rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    background: "white",
    padding: "2rem",
    borderRadius: "8px",
    textAlign: "center" as "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  heading: {
    marginBottom: "1rem",
  },
  otpContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    marginBottom: "1rem",
  },
  input: {
    width: "40px",
    height: "40px",
    textAlign: "center" as "center",
    fontSize: "18px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  verifyButton: {
    padding: "0.5rem 1rem",
    backgroundColor: "#007BFF",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default OtpVerify;
