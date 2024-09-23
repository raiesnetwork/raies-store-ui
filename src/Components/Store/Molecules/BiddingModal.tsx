import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import useMystoreStore from "../Core/Store";
import "../Helpers/scss/BiddingModal.scss";
import { useNavigate } from "react-router-dom";
// import { KTSVG } from "../../../../_metronic/helpers";

const BiddingModal: React.FC = () => {
  const {
    singleProductData,
    createBiddingOrder,
    setOpenBiddingModal,
    isOpenBiddingModal,
    selectedAddress,
    addressData,
    getAddress,
    OpenAddressModal,
    setIsOpenSelectAddressModal,
    setAddressSuparator
  } = useMystoreStore((state) => state);

  const [formData, setFormData] = useState({
    addressId: selectedAddress.id,
    biddingAmount: "",
    productId: singleProductData.id,
  });
  useEffect(() => {
    getAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [btnDisable, setDisable] = useState<boolean>(false);

  useEffect(() => {
    setFormData({
      addressId: selectedAddress.id,
      biddingAmount: "",
      productId: singleProductData.id,
    });
    setErrors({});
  }, [isOpenBiddingModal, singleProductData,selectedAddress]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
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

    
    if (!formData.addressId.trim())
      newErrors.addressId = "Address is Required.";
    const bidAmd=Number(formData.biddingAmount)
    if (!formData.biddingAmount.trim()){

      newErrors.biddingAmount = "Bid Amount is required.";
    }else if (bidAmd<singleProductData.minBidPrice||bidAmd>singleProductData.maxBidPrice) {
      newErrors.biddingAmount = `Bid amount must in bitween ${singleProductData.minBidPrice}-${singleProductData.maxBidPrice}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    setDisable(true);
    e.preventDefault();
    if (validateForm()) {
      try {
        const data = await createBiddingOrder(formData);
        if (data.error) {
          setDisable(false);
         return toast.error("Something wrong try again later");
        } else {
          if (data.data==="exceed") {
            return toast.error("Item limit exceed");

          }
         
          setOpenBiddingModal();
        navigate("/success", { state: { orderDetails:[{id:"",quantity:1,productDetails:singleProductData}] } });
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setDisable(false);
        toast.error("Failed to submit form.");
      }
    }
  };
// ===================================
const handlenewAddress = () => {
  OpenAddressModal();
  setOpenBiddingModal();
};
const handleSelectAddressModalOpen = () => {
  setIsOpenSelectAddressModal();
  setOpenBiddingModal();
};
  return (
    <>
      <div
        className={`modal ${
          isOpenBiddingModal ? "d-block show" : "d-none fade"
        }`}
        id="kt_modal_barter_form"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between">
              <h5 className="modal-title">Address Form</h5>
              <div
                className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                onClick={() => setOpenBiddingModal()}
              >
                {/* <KTSVG path="media/icons/duotune/arrows/arr061.svg" className="svg-icon svg-icon-2x" /> */}
              </div>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit}>
               
                {/* Address Section */}

                <div className="section address-section">
                  <div className="section-header">Select Delivery Address</div>
                  <div className="address-details">
                    {selectedAddress.id && (
                      <>
                        <div>
                          <p>
                            <strong>{selectedAddress.fullName}</strong>
                          </p>
                          <p>{selectedAddress.fullAddress}</p>
                          <p>
                            {selectedAddress.landmark},{selectedAddress.pincode}
                          </p>
                          <p>{selectedAddress.mobileNumber}</p>
                        </div>
                        <button
                          className="btn btn-primary"
                          onClick={handleSelectAddressModalOpen}
                        >
                          Change
                        </button>
                      </>
                    )}
                    {!addressData?.length && !selectedAddress.id && (
                      <button
                        className="btn btn-primary"
                        onClick={handlenewAddress}
                      >
                        Add new Address
                      </button>
                    )}
                    {addressData?.length > 0 && !selectedAddress.id && (
                      <button
                        className="btn btn-primary"
                        onClick={handleSelectAddressModalOpen}
                      >
                        Select Address
                      </button>
                    )}
                  </div>
                  {errors.addressId && (
                    <div style={{ color: "red" }} className="invalid-feedback">
                      {errors.addressId}
                    </div>
                  )}
                </div>

               

               
                {/* Product biddingAmount */}
                <div className="form-group">
                  <label htmlFor="biddingAmount">Bid Amount
                  (Min:{singleProductData.minBidPrice}-Max:{singleProductData.maxBidPrice})

                  </label>
                  <input
                    type="number"
                    id="biddingAmount"
                    value={formData.biddingAmount}
                    name="biddingAmount"
                    onChange={handleChange}
                    className={`form-control ${
                      errors.biddingAmount ? "is-invalid" : ""
                    }`}
                  />
                  {errors.biddingAmount && (
                    <div className="invalid-feedback">
                      {errors.biddingAmount}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={btnDisable}
                >
                  Submit
                </button>
                <button className="btn" 
                onClick={() => {
                  setOpenBiddingModal();
                  setAddressSuparator(false);
                }}
                >
                  Close
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default BiddingModal;
