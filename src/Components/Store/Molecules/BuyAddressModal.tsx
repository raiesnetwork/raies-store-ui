import React, { useState, ChangeEvent, FormEvent } from "react";
import '../Helpers/scss/BuyAddress.scss'
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
  const [addressData, setAddressData] = useState<AddressData>({
    fullName: "",
    mobileNumber: "",
    fullAddress: "",
    landmark: "",
    pincode: "",
  });

  const [addressErrors, setAddressErrors] = useState<AddressErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAddressData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setAddressErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validateAddress = (): boolean => {
    const newErrors: AddressErrors = {};
    if (!addressData.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!addressData.mobileNumber.trim() || !/^\d{10}$/.test(addressData.mobileNumber))
      newErrors.mobileNumber = "Valid 10-digit mobile number is required.";
    if (!addressData.fullAddress.trim()) newErrors.fullAddress = "Full address is required.";
    if (!addressData.pincode.trim() || !/^\d{6}$/.test(addressData.pincode))
      newErrors.pincode = "Valid 6-digit pincode is required.";

    setAddressErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddressSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateAddress()) {
      closeModal();
      
      alert("Address selected successfully!");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Select Delivery Address</h2>
        <form onSubmit={handleAddressSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={addressData.fullName}
              onChange={handleChange}
              className={`form-control ${addressErrors.fullName ? "is-invalid" : ""}`}
            />
            {addressErrors.fullName && <div className="invalid-feedback">{addressErrors.fullName}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="mobileNumber">Mobile Number</label>
            <input
              type="text"
              id="mobileNumber"
              name="mobileNumber"
              value={addressData.mobileNumber}
              onChange={handleChange}
              className={`form-control ${addressErrors.mobileNumber ? "is-invalid" : ""}`}
            />
            {addressErrors.mobileNumber && <div className="invalid-feedback">{addressErrors.mobileNumber}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="fullAddress">Full Address</label>
            <textarea
              id="fullAddress"
              name="fullAddress"
              value={addressData.fullAddress}
              onChange={handleChange}
              className={`form-control ${addressErrors.fullAddress ? "is-invalid" : ""}`}
            />
            {addressErrors.fullAddress && <div className="invalid-feedback">{addressErrors.fullAddress}</div>}
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
              type="text"
              id="pincode"
              name="pincode"
              value={addressData.pincode}
              onChange={handleChange}
              className={`form-control ${addressErrors.pincode ? "is-invalid" : ""}`}
            />
            {addressErrors.pincode && <div className="invalid-feedback">{addressErrors.pincode}</div>}
          </div>

          <button type="submit" className="btn btn-primary">
            Confirm Address
          </button>
          <button type="button" className="btn btn-secondary" onClick={closeModal}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;
