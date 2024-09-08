import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useMystoreStore from "../core/store/MyStoreStore";
import { KTSVG } from "../../../../_metronic/helpers";

const BiddingModal: React.FC = () => {
  const { setOpenBiddingModal, isOpenBiddingModal } = useMystoreStore((state) => state);

  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    fullAddress: "",
    landmark: "",
    pincode: "",
    bidAmount: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [btnDisable, setDisable] = useState<boolean>(false);

  useEffect(() => {
    setFormData({
      fullName: "",
      mobileNumber: "",
      fullAddress: "",
      landmark: "",
      pincode: "",
      bidAmount: "",
    });
    setErrors({});
  }, [isOpenBiddingModal]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDisable(false);
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required.";
    if (!formData.mobileNumber.trim() || !/^\d{10}$/.test(formData.mobileNumber))
      newErrors.mobileNumber = "Valid 10-digit mobile number is required.";
    if (!formData.fullAddress.trim()) newErrors.fullAddress = "Full address is required.";
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Valid 6-digit pincode is required.";
    if (!formData.bidAmount.trim()) newErrors.bidAmount = "Bid Amount is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setDisable(true);
    e.preventDefault();
    if (validateForm()) {
      try {
        // const data = await updateModalApiHelper(formData);
        // if (data.error) {
        //   setDisable(false);
        //   toast.error(data.message);
        // } else {
        //   toast.success(data.message);
        //   updateModalOpen();
        //   ProductImageRef.current.value = "";
        // }
      } catch (error) {
        setDisable(false);
        toast.error("Failed to submit form.");
      }
    }
  };

  return (
    <div className={`modal ${isOpenBiddingModal ? "d-block show" : "d-none fade"}`} id="kt_modal_barter_form" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header d-flex justify-content-between">
            <h5 className="modal-title">Address Form</h5>
            <div className="btn btn-icon btn-sm btn-active-light-primary ms-2" onClick={() => setOpenBiddingModal()}>
              <KTSVG path="media/icons/duotune/arrows/arr061.svg" className="svg-icon svg-icon-2x" />
            </div>
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`form-control ${errors.fullName ? "is-invalid" : ""}`}
                />
                {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
              </div>

              {/* Mobile Number */}
              <div className="form-group">
                <label htmlFor="mobileNumber">Mobile Number</label>
                <input
                  type="text"
                  id="mobileNumber"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  className={`form-control ${errors.mobileNumber ? "is-invalid" : ""}`}
                />
                {errors.mobileNumber && <div className="invalid-feedback">{errors.mobileNumber}</div>}
              </div>

              {/* Full Address */}
              <div className="form-group">
                <label htmlFor="fullAddress">Full Address</label>
                <textarea
                  id="fullAddress"
                  name="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleChange}
                  className={`form-control ${errors.fullAddress ? "is-invalid" : ""}`}
                />
                {errors.fullAddress && <div className="invalid-feedback">{errors.fullAddress}</div>}
              </div>

              {/* Landmark */}
              <div className="form-group">
                <label htmlFor="landmark">Landmark</label>
                <input
                  type="text"
                  id="landmark"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              {/* Pincode */}
              <div className="form-group">
                <label htmlFor="pincode">Pincode</label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  className={`form-control ${errors.pincode ? "is-invalid" : ""}`}
                />
                {errors.pincode && <div className="invalid-feedback">{errors.pincode}</div>}
              </div>

              {/* Product bidAmount */}
              <div className="form-group">
                <label htmlFor="bidAmount">Bid Amount</label>
                <input
                  type="number"
                  id="bidAmount"
                  value={formData.bidAmount}
                  name="bidAmount"
                  onChange={handleChange}
                  className={`form-control ${errors.bidAmount ? "is-invalid" : ""}`}
                />
                {errors.bidAmount && <div className="invalid-feedback">{errors.bidAmount}</div>}
              </div>

              <button type="submit" className="btn btn-primary" disabled={btnDisable}>
                Submit
              </button>
              <button className="btn"
               onClick={setOpenBiddingModal}
              >
                Close
              </button>
            </form>
            <ToastContainer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BiddingModal;
