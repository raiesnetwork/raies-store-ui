import React, { useState, ChangeEvent, FormEvent } from "react";
import "../Helpers/scss/BuyAddress.scss";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import useMystoreStore from "../Core/Store";
import { toast,ToastContainer } from "react-toastify";

interface AddressData {
  fullName: string;
  mobileNumber: string;
  fullAddress: string;
  landmark: string;
  pincode: string;
}

interface AddressErrors {
  fullName?: string;
  mobileNumber?: string;
  fullAddress?: string;
  landmark?: string;
  pincode?: string;
}

interface AddressModalProps {
  closeModal: () => void;
  //   setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const AddressModal: React.FC<AddressModalProps> = ({ closeModal }) => {
const {createAddress,getAddress}=useMystoreStore((s)=>s)
  const [addressData, setAddressData] = useState<AddressData>({
    fullName: "",
    mobileNumber: "",
    fullAddress: "",
    landmark: "",
    pincode: "",
  });
  const [addressErrors, setAddressErrors] = useState<AddressErrors>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setAddressData((prevData) => ({
      ...prevData,
      [name]: value,
      
    }
  ));
    setAddressErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));

  };
const setMobileNumber=(n:string)=>{
  
    setAddressData((prevData) => ({
      ...prevData,
      mobileNumber:n,
      
    }
  ));
  
}
  const validateAddress = (): boolean => {
    const newErrors: AddressErrors = {};
    if (!addressData.fullName.trim())
      newErrors.fullName = "Full name is required.";
    if (
      !addressData.mobileNumber.trim() ||
      !/^\d{7,}$/.test(addressData.mobileNumber)
    ) {
      newErrors.mobileNumber = "Valid mobile number is required.";
    }
    if (!addressData.fullAddress.trim())
      newErrors.fullAddress = "Full address is required.";
    if (!addressData.pincode.trim() || !/^\d{6}$/.test(addressData.pincode))
      newErrors.pincode = "Valid 6-digit pincode is required.";

    setAddressErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateAddress()) {
      const data=await createAddress(addressData)
     
      if (data.error) {
        toast.error("Address can't created try again")
      }else{
        toast.success("Address created successfully")
         await getAddress()
        closeModal();

      }

      
    }
  };

  return (
    <>
    <div  className="modal-overlay">
      <div className="modal-content">
        <h2>Create Delivery Address</h2>
        <form onSubmit={handleAddressSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={addressData.fullName}
              onChange={handleChange}
              className={`form-control `}
            />
            {addressErrors.fullName && (
              <div className="invalid-feedback">{addressErrors.fullName}</div>
            )}
          </div>

          <div style={{
            marginBottom:"15px",
            width:"100%",
            display:"block"
          }}>
            <label
            style={{
              marginBottom:"5px"
            }}
            htmlFor="mobileNumber">Mobile Number</label>
            <PhoneInput
              country={"in"}
              value={addressData.mobileNumber}
              onChange={(phone) => {
                setMobileNumber(phone) 
               }}
              inputProps={{
                name: "mobileNumber",
                required: true,
              }}
            />

            {addressErrors.mobileNumber && (
              <div style={{color:"red",fontSize: "0.875rem"}}>
                {addressErrors.mobileNumber}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="fullAddress">Full Address</label>
            <textarea
              id="fullAddress"
              name="fullAddress"
              value={addressData.fullAddress}
              onChange={handleChange}
              className={`form-control`}
            />
            {addressErrors.fullAddress && (
              <div className="invalid-feedback">
                {addressErrors.fullAddress}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="landmark">Landmark (Optional)</label>
            <input
              type="text"
              id="landmark"
              name="landmark"
              value={addressData.landmark}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="pincode">Pincode</label>
            <input
              type="number"
              id="pincode"
              name="pincode"
              value={addressData.pincode}
              onChange={handleChange}
              className={`form-control `}
              maxLength={6}
            />
            {addressErrors.pincode && (
              <div className="invalid-feedback">{addressErrors.pincode}</div>
            )}
          </div>

          <button type="submit" className="btn btn-primary">
            Confirm Address
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-c"
            onClick={closeModal}
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
    <ToastContainer/>
    </>
  );
};

export default AddressModal;
