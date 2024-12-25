import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import useMystoreStore from "../Core/Store";
import "../Helpers/scss/BiddingModal.scss";
import { useNavigate } from "react-router-dom";
import { getDeliveryCharge } from "../Core/StoreApi";
import { respProduct } from "../Core/Interfaces";
// import { KTSVG } from "../../../../_metronic/helpers";

type props={
  product:respProduct
}
const BiddingModal: React.FC <props>= ({product}) => {
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
    setAddressSuparator,
    shiprocketToken
  } = useMystoreStore((state) => state);
  const [CourierId, setCourierId] = useState<string>('');

  const [formData, setFormData] = useState({
    addressId: selectedAddress._id,
    biddingAmount: "",
    productId: singleProductData._id,
    CourierId
  });
  useEffect(() => {
    getAddress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [btnDisable, setDisable] = useState<boolean>(false);
  
  useEffect(() => {
    setFormData({
      addressId: selectedAddress._id,
      biddingAmount: "",
      productId: singleProductData._id,
      CourierId
    });
    setErrors({});
  }, [isOpenBiddingModal, singleProductData, selectedAddress]);

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
    const bidAmd = Number(formData.biddingAmount);
    if (!formData.biddingAmount.trim()) {
      newErrors.biddingAmount = "Bid Amount is required.";
    } else if (
      bidAmd < singleProductData.minBidPrice ||
      bidAmd > singleProductData.maxBidPrice
    ) {
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
          return toast.error(
            "We're sorry, but there was a problem creating your bid order. Please try again in a few minutes."
          );
        } else {
          if (data.data === "exceed") {
            return toast.error(
              "This product is currently unavailable. Please check back later for restock updates!"
            );
          }

          setOpenBiddingModal();
          navigate("/success", {
            state: {
              orderDetails: [
                { id: "", quantity: 1, productDetails: singleProductData },
              ],
            },
          });
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setDisable(false);
        toast.error(
          "We couldn't submit your form due to an error. Please check your information and try again."
        );
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

  const [deliveryDetails, setDeliveryDetails] = useState<any>();
  const [expetedDeliveryData, setExpectedDeliveryDate] = useState<any>();
  const getDeliveryCharges = async () => {
    
    const payload = {
      pickup_postcode:product.pickupAddress.Zip||'673503',
        
      delivery_postcode: selectedAddress.pincode,
      cod: 1, // 1 for COD, 0 for prepaid
      weight: product.productWeight,
      length: product.packageLength,
      breadth: product.packageBreadth,
      height: product.packageHeight,
    };
    try {
      const data = await getDeliveryCharge(payload, shiprocketToken);
      const couriers = data.data.available_courier_companies;
      const getBestCourier = (couriers: any[]) => {
        return couriers.reduce((best, current) => {
          if (
            (current.total_charge < best.total_charge &&
              current.etd < best.etd) ||
            current.recommendation_score > best.recommendation_score
          ) {
            return current;
          }
          return best;
        }, couriers[0]);
      };
      const bestCourier = getBestCourier(couriers);
      const freightCharge = parseFloat(bestCourier.freight_charge || 0);
      const codCharges = parseFloat(bestCourier.cod_charges || 0);
      const otherCharges = parseFloat(bestCourier.other_charges || 0);
      const totalDeliveryCharge = freightCharge + codCharges + otherCharges;
      setExpectedDeliveryDate(bestCourier?.etd);
      setDeliveryDetails(totalDeliveryCharge);
      console.log("Selected Best Courier:", bestCourier.id);
      setCourierId(bestCourier?.id)
    } catch (error) {
      console.log(error, "delivery charges err");
    }
  };


  useEffect(() => {
    if (product && selectedAddress) {
      getDeliveryCharges();
    }
  }, [product, selectedAddress]);
 
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
                    {selectedAddress._id && (
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
                    {!addressData?.length && !selectedAddress._id && (
                      <button
                        className="btn btn-primary"
                        onClick={handlenewAddress}
                      >
                        Add new Address
                      </button>
                    )}
                    {addressData?.length > 0 && !selectedAddress._id && (
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
                  <label htmlFor="biddingAmount">
                    Bid Amount (Min:{singleProductData.minBidPrice}-Max:
                    {singleProductData.maxBidPrice})
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
                <div style={{display:"flex",
                  alignItems:"center",
                  justifyContent:"space-between"
                }}>
                  <span>Expected delivery:</span>
                  <span>{expetedDeliveryData}</span>
                </div>
                
                <div style={{display:"flex",
                  alignItems:"center",
                  justifyContent:"space-between"
                }}>
                  <span>Delivery charge:</span>
                  <span>{deliveryDetails || 0}</span>
                </div>
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
    </>
  );
};

export default BiddingModal;
