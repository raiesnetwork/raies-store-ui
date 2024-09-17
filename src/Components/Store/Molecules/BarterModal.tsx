import React, { useState, useEffect, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import useMystoreStore from "../Core/Store";
// import { KTSVG } from "../../../../_metronic/helpers";

const BarterModal: React.FC = () => {
  const { createBarterOrder,singleProductData,setOpenBarterModal, isOpenBarteModal } = useMystoreStore((state) => state);

  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    fullAddress: "",
    landmark: "",
    pincode: "",
    productImage: "",
    productId:singleProductData.id
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [btnDisable, setDisable] = useState<boolean>(false);
  const [imageErrors, setImageErrors] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, prefer-const
  let ProductImageRef:any = useRef(null);

  useEffect(() => {
    setFormData({
      fullName: "",
      mobileNumber: "",
      fullAddress: "",
      landmark: "",
      pincode: "",
      productImage: "",
      productId:singleProductData.id
    });
    setErrors({});
  }, [isOpenBarteModal,singleProductData]);

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
    if (!formData.mobileNumber.trim() || formData.mobileNumber.length<=7)
      newErrors.mobileNumber = "Valid mobile number is required.";
    if (!formData.fullAddress.trim()) newErrors.fullAddress = "Full address is required.";
    if (!formData.pincode.trim() || !/^\d{6}$/.test(formData.pincode)) newErrors.pincode = "Valid 6-digit pincode is required.";
    if (!formData.productImage.trim()) newErrors.productImage = "Product image is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setDisable(true);
    e.preventDefault();
    if (validateForm()) {
      try {
        const data = await createBarterOrder(formData);
        console.log(data);
        
        if (data.error) {
          setDisable(false);
         return toast.error("order can't creted");
        } else {
          toast.success("order Created successfully");
          setOpenBarterModal();
             

          ProductImageRef.current.value = "";
        }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        setDisable(false);
        toast.error("Failed to submit form.");
      }
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

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

  return (
    <>
    <div className={`modal ${isOpenBarteModal ? "d-block show" : "d-none fade"}`} id="kt_modal_barter_form" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header d-flex justify-content-between">
            <h5 className="modal-title">Address Form</h5>
            <div className="btn btn-icon btn-sm btn-active-light-primary ms-2" onClick={() => setOpenBarterModal()}>
              {/* <KTSVG path="media/icons/duotune/arrows/arr061.svg" className="svg-icon svg-icon-2x" /> */}
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
                  type="number"
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
                  type="number"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  maxLength={6}
                  className={`form-control ${errors.pincode ? "is-invalid" : ""}`}
                />
                {errors.pincode && <div className="invalid-feedback">{errors.pincode}</div>}
              </div>

              {/* Product Image */}
              <div className="form-group">
                <label htmlFor="productImage">Product Image</label>
                <input
                  type="file"
                  id="productImage"
                  name="productImage"
                  ref={ProductImageRef}
                  onChange={handleImageUpload}
                  className={`form-control ${errors.productImage ? "is-invalid" : ""}`}
                />
                {errors.productImage && <div className="invalid-feedback">{errors.productImage}</div>}
                {imageErrors && <div style={{ color: "red" }}>{imageErrors}</div>}
              </div>

              <button type="submit" className="btn btn-primary" disabled={btnDisable}>
                Submit
              </button>
              <button className="btn"
               onClick={setOpenBarterModal}
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
