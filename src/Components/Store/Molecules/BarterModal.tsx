import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import useMystoreStore from "../Core/Store";
import { fileToBase64 } from "../../../Utils/Base64";
import { useNavigate } from "react-router-dom";

const BarterModal: React.FC = () => {
  const {
    setaddressSupparatorBarter,
    selectedAddress,
    getAddress,
    addressData,
    OpenAddressModal,
    setIsOpenSelectAddressModal,
    createBarterOrder,
    singleProductData,
    setOpenBarterModal,
    isOpenBarteModal,
  } = useMystoreStore((state) => state);

  const [formData, setFormData] = useState({
    addressId: selectedAddress.id,
    productImage: "",
    productId: singleProductData.id,
    // quantity:"1"
  });
  useEffect(() => {
    getAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [btnDisable, setDisable] = useState<boolean>(false);
  const [imageErrors, setImageErrors] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, prefer-const
  let ProductImageRef: any = useRef(null);

  useEffect(() => {
    setFormData({
      addressId: selectedAddress.id,
      productImage: "",
      productId: singleProductData.id,
      // quantity:"1"
    });
    setErrors({});
  }, [isOpenBarteModal, singleProductData, selectedAddress]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.addressId.trim())
      newErrors.addressId = "Address is Required.";
    if (!formData.productImage.trim())
      newErrors.productImage = "Product image is required.";
    // const qnty=Number(formData.quantity)
    // if (!formData.quantity.trim()) {
    //   newErrors.quantity = "Quantity is required.";
    // } else if (qnty < 1) {
    //   newErrors.quantity = "Quantity must be at least 1.";
    // } else if (qnty > singleProductData.productCount) {
    //   newErrors.quantity = "Quantity limit exceeded.";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    setDisable(true);
    e.preventDefault();
    if (validateForm()) {
      try {
        const data = await createBarterOrder(formData);

        if (data.error) {
          setDisable(false);
          return toast.error("order can't creted");
        } else {
          if (data.data === "exceed") {
            return toast.error("Product limit exceed");
          } else {
           
            
            ProductImageRef.current.value = "";
            setOpenBarterModal();
            navigate("/success", { state: { orderDetails:[{id:"",quantity:1,productDetails:singleProductData}] } });
          }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        setDisable(false);
        toast.error("Failed to submit form.");
      }
    }
  };
  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   setDisable(false);
  //   const { name, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });

  //   setErrors({
  //     ...errors,
  //     [name]: "",
  //   });
  // };
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setImageErrors("Only image files are allowed");
        return;
      }

      if (file.size > 1 * 1024 * 1024) {
        setImageErrors("Image must be 1MB or less");
        return;
      }

      const base64 = await fileToBase64(file);
      setFormData({
        ...formData,
        productImage: base64,
      });
      setImageErrors(null);
    }
  };
  // ===================================
  const handlenewAddress = () => {
    OpenAddressModal();
    setOpenBarterModal();
  };
  const handleSelectAddressModalOpen = () => {
    setIsOpenSelectAddressModal();
    setOpenBarterModal();
  };
  return (
    <>
      <div
        className={`modal ${isOpenBarteModal ? "d-block show" : "d-none fade"}`}
        id="kt_modal_barter_form"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between">
              <h5 className="modal-title">Address Form</h5>
              <div
                className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                onClick={() => setOpenBarterModal()}
              >
                {/* <KTSVG path="media/icons/duotune/arrows/arr061.svg" className="svg-icon svg-icon-2x" /> */}
              </div>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit}>
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

                {/* Product Image */}
                <div className="form-group">
                  <label htmlFor="productImage">Your Exchange Product Image</label>
                  <input
                    type="file"
                    id="productImage"
                    name="productImage"
                    ref={ProductImageRef}
                    onChange={handleImageUpload}
                    className={`form-control ${
                      errors.productImage ? "is-invalid" : ""
                    }`}
                  />
                  {errors.productImage && (
                    <div className="invalid-feedback">
                      {errors.productImage}
                    </div>
                  )}
                  {imageErrors && (
                    <div style={{ color: "red" }}>{imageErrors}</div>
                  )}
                </div>

                {/* Quantity */}
                {/* <div className="form-group">
                  <label htmlFor="pincode">Quantity (Max:{singleProductData.productCount})</label>
                  <input
                    type="number"
                    id="pincode"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    
                    className={`form-control ${
                      errors.pincode ? "is-invalid" : ""
                    }`}
                  />
                  {errors.quantity && (
                    <div className="invalid-feedback">{errors.quantity}</div>
                  )}
                </div> */}
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={btnDisable}
                >
                  Submit
                </button>
                <button
                  className="btn"
                  onClick={() => {
                    setOpenBarterModal();
                    setaddressSupparatorBarter(false);
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

export default BarterModal;
