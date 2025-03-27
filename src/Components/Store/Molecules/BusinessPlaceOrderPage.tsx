/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import "../Helpers/scss/BuyPage.scss";
import Header from "./Header";
import { useNavigate } from "react-router-dom";
import AddressModal from "./BuyAddressModal";
import { toast } from "react-toastify";
import useMystoreStore from "../Core/Store";
import AddressComponent from "./ShowAllAddressModal";
import StoreFooter from "../../Footer/Footer";
import { getDeliveryCharge } from "../Core/StoreApi";
import Loader from "../../Loader/Loader";

const BusinessPlaceOrder: React.FC = () => {
  const {
    createRazorpayOrder,
    verifyRazorpayPayment,
    selectedAddress,
    addressData,
    getAddress,
    isOpenselectAddressModal,
    setIsOpenSelectAddressModal,
    createOrdr,

    postCouponApi,
    shiprocketToken,
    setSelectedAddress,
    profileData,
    getProfileInfo,
    stockPaymentPageData,
  } = useMystoreStore((s) => s);
 
  const [CourierId, setCourierId] = useState<string>("");
  const [btnDisable, setBtndesable] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [deliveryCharge, setdeliveryCharge] = useState<number>(0);

  const [couponAmount, setCouponAmount] = useState<{
    amount: number;
    type: string;
    couponId: string;
  }>({ amount: 0, type: "", couponId: "" });

  const [totalAmount, setTotalAmount] = useState(0);
  const [deliveryError, setDeliveryError] = useState({
    error: false,
    message: "",
  });
  useEffect(() => {

    if (
        stockPaymentPageData?.productData?.price &&
      stockPaymentPageData?.stockData?.stock
    ) {
      const total =
        parseInt(stockPaymentPageData.productData?.price) *
        parseInt(stockPaymentPageData.stockData.stock);
      setTotalAmount(total);
    } else {
      setTotalAmount(0); 
    }
  }, [ stockPaymentPageData]);
  
  const [expetedDeliveryData, setExpectedDeliveryDate] = useState<any>('Not Available');
  const [deliveryLoader, setDeliveryLoader] = useState(false);
  const getDeliveryCharges = async () => {
    const payload = {
      pickup_postcode:
        stockPaymentPageData.productData?.pickupAddress?.Zip || "673504",
      delivery_postcode: selectedAddress.pincode,
      cod: stockPaymentPageData.paymentType === "credit" ? 1 : 0, // 1 for COD, 0 for prepaid
      weight: stockPaymentPageData.productData.productWeight,
      length: stockPaymentPageData.productData.packageLength,
      breadth: stockPaymentPageData.productData.packageBreadth,
      height: stockPaymentPageData.productData.packageHeight,
    };
    if (stockPaymentPageData.productData.productWeightType === "g") {
      payload.weight = stockPaymentPageData.productData.productWeight / 1000;
      if (payload.weight <= 0.5) {
        payload.weight = 0.5;
      }
    }
   
    try {
      setDeliveryLoader(true);
      const data = await getDeliveryCharge(payload, shiprocketToken);
      console.log(data)
      if (data?.status === 404) {
        setDeliveryLoader(false);

        setDeliveryError({ error: true, message: data.message });
        return;
      }
      if (data?.error === true) {
        setDeliveryLoader(false);

        setDeliveryError({ error: true, message: data.message });
        return;
      }
      setDeliveryError({ error: false, message: "" });

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
      console.log(totalDeliveryCharge,bestCourier?.etd,bestCourier?.id,'lklk')
      setdeliveryCharge(totalDeliveryCharge);
      if (bestCourier && bestCourier.etd) {
        setExpectedDeliveryDate(bestCourier.etd);
      } else {
        setExpectedDeliveryDate("Not Available"); // Provide a fallback
      }
      
      setCourierId(bestCourier?.id);
    } catch (error) {
    } finally {
      setDeliveryLoader(false);
    }
  };
  useEffect(() => {
    if (stockPaymentPageData?.productData && selectedAddress) {
      getDeliveryCharges();
    }
  }, [stockPaymentPageData?.productData, selectedAddress]);

  useEffect(() => {
    if (addressData?.length > 0) {
      setSelectedAddress(addressData[0]);
    }
  }, [addressData]);

  const [isOpenAddressModal, setAddressModal] = useState<boolean>(false);
  const OpenAddressModal = () => {
    setAddressModal(true);
  };
  const closeAddressModal = () => {
    setAddressModal(false);
  };
  useEffect(() => {
    const apiHelper = async () => {
      await getAddress();
    };
    apiHelper();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);
  useEffect(() => {
    const apiHelper = async () => {
      await getProfileInfo();
    };
    apiHelper();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigate = useNavigate();
  const handilPlaceOrder = async () => {
    // shprocket delivery Charge api error
    if (deliveryError.error) {
      setBtndesable(false);

      toast.error(deliveryError.message);
      return;
    }
    if (selectedAddress._id.trim() && stockPaymentPageData.paymentType.trim()) {
      setBtndesable(true);
      const diamentions = {
        weight: stockPaymentPageData.productData.productWeight,
        length: stockPaymentPageData.productData.packageLength,
        breadth: stockPaymentPageData.productData.packageBreadth,
        height: stockPaymentPageData.productData.packageHeight,
      };
      const productDetais = [{
        _id: stockPaymentPageData.productData?._id,
        quantity: stockPaymentPageData.stockData.stock,
        productName: stockPaymentPageData.productData?.productName,
        mainImage: stockPaymentPageData.productData?.mainImage,
        cartId: "",
        price: stockPaymentPageData.productData?.price,
        diamentions,
      }];
      if (deliveryError.error) {
        setBtndesable(false);

        return toast.error(deliveryError.message);
      }
      const totalAmountWithDelivery = totalAmount + deliveryCharge;
      if (stockPaymentPageData?.paymentType === "credit") {
        const data = await createOrdr({
          addressId: selectedAddress._id,
          paymentMethod: stockPaymentPageData.paymentType,
          //@ts-ignore
          productDetails: productDetais,
          totalAmount: totalAmount + deliveryCharge,
          couponData: couponAmount,
          CourierId,
          type:"business",
          businessDealerId:stockPaymentPageData?.stockData?._id
        });
        setBtndesable(false);

        if (data.error) {
          setBtndesable(false);

          return toast.error(
            "We couldn't create your order. Please try again."
          );
        } else {
          setBtndesable(false);

          navigate("/success", {
            state: {
              orderDetails: [{productDetails:stockPaymentPageData.productData,quantity:stockPaymentPageData?.stockData?.stock}],
              orderId: data.data.orderData?.order_id,
            },
          });
        }
      } else {
        setBtndesable(false);

        try {
          // setLoading(true)

          const { order } = await createRazorpayOrder(totalAmountWithDelivery);

          const options = {
            key: import.meta.env.VITE_APP_RAZOR_PAY,
            amount: order.amount,
            currency: "INR",
            name: "BUSINESS PURCHASE",
            description: "",
            order_id: order.id,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            handler: async (response: any) => {
              try {
                // eslint-disable-next-line prefer-const
                let data = {
                  response,
                  addressId: selectedAddress._id,
                  paymentMethod: stockPaymentPageData.paymentType,
                  productDetails: productDetais,
                  totalAmount: totalAmount + deliveryCharge,
                  couponData: couponAmount,
                  type:"business",
                  businessDealerId:stockPaymentPageData?.stockData?._id

                };
                // @ts-ignore
                await verifyRazorpayPayment(data);
                navigate("/success", {
                  state: {
                    orderDetails: [{productDetails:stockPaymentPageData.productData,quantity:stockPaymentPageData?.stockData?.stock}],
                    // orderId:data.data.orderId
                  },
                })
                // setLoading(false);
                setRefresh(true);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } catch (error: any) {
                // setLoading(false);
                toast.error(
                  "Payment verification failed. Please check your payment details and try again."
                );
              }
            },
            profile: {
              name: profileData.fullName,
              email:profileData.email,
              contact:profileData.mobileNumber,
            },
            theme: {
              color: "#3399cc",
            },
            modal: {
              ondismiss: () => {
                // setLoading(false);
                // Optionally stop loading if the user dismisses the payment modal
              ;
              },
            },
          };

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rzp1 = new (window as any).Razorpay(options);
          rzp1.open();
        } catch (error) {
          toast.error("Payment failed. Please try again.");
        }

        
      }
    } else {
      setBtndesable(false);

      toast.error(
        "Please make sure to select your delivery address and payment method."
      );
    }
  };
  const [couponCode, setCouponCode] = useState<string>("");
  const [couponCodeErr, setCouponCodeErr] = useState<string>("");
  const [CouponBtnDisable, setCouponBtnDesable] = useState<boolean>(false);

  const handileCoupon = async () => {
    if (couponCode.trim()) {
      setCouponBtnDesable(true);
      const data = await postCouponApi(
        couponCode,
        stockPaymentPageData.productData
      );
      setCouponBtnDesable(false);
      if (data.error) {
        setCouponCodeErr(data?.message);
      } else {
        if (data?.data?.type === "fixed") {
          setCouponAmount({
            amount: data?.data?.amount,
            type: "fixed",
            couponId: data?.data?.couponId,
          });
          let totalPrice = Math.max(0, totalAmount - (data?.data?.amount || 0));

          setTotalAmount(totalPrice);
        } else if (data?.data?.type === "percentage") {
          let totalPrice = totalAmount * (data?.data?.amount / 100);
          setTotalAmount(totalPrice);
          setCouponAmount({
            amount: data?.data?.amount,
            type: "percentage",
            couponId: data?.data?.couponId,
          });
        }
        setCouponCodeErr("");

        toast.success("Coupon Apply Successfully");
      }
    } else {
      setCouponCodeErr("Enter a valid coupon code");
    }
  };

  return (
    <>
      {deliveryLoader &&stockPaymentPageData? (
        <Loader />
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            <Header />
            <div style={{ flex: 1 }}>
              <div className="checkout-page">
                {/* Delivery Address Section */}
                <div className="section address-section">
                  <div className="section-header">1. Delivery Address</div>
                  <div className="address-details">
                    {selectedAddress._id && (
                      <>
                        <div className="checkout-page-address-details">
                          <p>
                            <span>{selectedAddress.fullName}</span>
                          </p>
                          <p>{selectedAddress.fullAddress}</p>
                          <p>
                            {selectedAddress.landmark},{selectedAddress.pincode}
                          </p>
                          <p>{selectedAddress.mobileNumber}</p>
                        </div>
                        <button onClick={() => setIsOpenSelectAddressModal()}>
                          Change
                        </button>
                      </>
                    )}
                    {!addressData?.length && !selectedAddress._id && (
                      <button onClick={setIsOpenSelectAddressModal}>
                        Add new Address
                      </button>
                    )}
                    {addressData?.length && !selectedAddress._id && (
                      <button onClick={setIsOpenSelectAddressModal}>
                        Select Address
                      </button>
                    )}
                  </div>
                </div>

                {/* Payment Method Section */}
                {/* Payment Method Section */}
                <div className="section payment-section">
                  <div className="section-header">2.Payment Method</div>
                  <div className="payment-methods">
                    <div>
                      {/* Online Payment Option */}
                      <label>
                        <input
                          type="radio"
                          name="payment"
                          value="online"
                          checked={
                            stockPaymentPageData?.paymentType === "online"
                          }
                        />
                        Online Payment
                      </label>

                      {/* Credit Option (Conditional Rendering) */}

                      <>
                        <label style={{ marginLeft: "20px" }}>
                          <input
                            type="radio"
                            name="payment"
                            value="credit"
                            checked={
                              stockPaymentPageData?.paymentType === "credit"
                            }
                          />
                          Purchase on Credit
                        </label>

                        {/* Note for Credit Payment */}
                        {stockPaymentPageData?.paymentType === "credit" && (
                          <div
                            style={{
                              marginTop: "10px",
                              backgroundColor: "#f9f9f9",
                              padding: "10px",
                              borderRadius: "5px",
                              border: "1px solid #ccc",
                            }}
                          >
                            <p
                              style={{
                                fontSize: "14px",
                                color: "#555",
                                lineHeight: "1.5",
                              }}
                            >
                              Note : You are purchasing this product on credit.
                              An invoice will be generated and available in the
                              "Invoice Section" of your profile. Please ensure
                              timely payment to avoid additional charges.
                            </p>
                          </div>
                        )}
                      </>
                    </div>
                  </div>
                </div>

                {/* Product Review Section */}
                <div className="section product-review-section">
                  <div className="section-header">
                    3. Review Items and Delivery
                  </div>
                  <div className="product-list">
                    <div
                      style={{
                        overflowY: "scroll",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        flexWrap: "wrap",
                      }}
                    >
                      '
                      <>
                        <hr />

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: "15px",

                            width: "100%",
                          }}
                        >
                          <img
                            style={{
                              maxWidth: "100px",
                              marginRight: "20px",
                              marginBottom: "5px",
                            }}
                            src={stockPaymentPageData?.productData?.mainImage}
                            alt={stockPaymentPageData?.productData?.productName}
                          />
                          <div className="product-details">
                            <h4>
                              {stockPaymentPageData?.productData.productName}
                            </h4>
                            <p>
                              Price: ₹{stockPaymentPageData?.productData.price}
                              .00
                            </p>
                            {/* <p>Delivery: {product.deliveryDate}</p> */}
                          </div>
                          <div className="quantity">
                            <p>Qty: {stockPaymentPageData?.stockData?.stock}</p>
                          </div>
                        </div>
                        <hr />
                      </>
                    </div>
                  </div>
                </div>
                {/* coupon section */}

                <div className="section order-summary">
                  <div className="section-header">Apply Coupon</div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                    }}
                  >
                    <input
                      style={{
                        width: "85%",
                        height: "35px",
                        borderRadius: "5px",
                        outline: "none",
                        border: "1px solid",
                      }}
                      value={couponCode}
                      placeholder="Enter coupon code"
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button
                      style={{
                        width: "15%",
                      }}
                      onClick={handileCoupon}
                    >
                      {CouponBtnDisable ? "Applying..." : "Apply"}
                    </button>
                  </div>
                  <div
                    style={{
                      color: "red",
                    }}
                  >
                    {couponCodeErr}
                  </div>
                </div>

                {/* Order Summary Section */}
                <div className="section order-summary">
                  <>
                    <div className="summary-row">
                      <span>Expected delivery:</span>
                      <span>{expetedDeliveryData}</span>
                    </div>

                    <div className="summary-row">
                      <span>Items:</span>
                      <span>₹{totalAmount}</span>
                    </div>
                    <div className="summary-row">
                      <span>Delivery:</span>
                      <span>{deliveryCharge}</span>
                    </div>

                    <div className="summary-row">
                      <span>Discount Coupon:</span>
                      <span>{couponAmount?.amount}</span>
                    </div>
                    <div className="summary-row">
                      <span>Total:</span>
                      <span className="total-price">
                        ₹{!deliveryLoader && totalAmount + deliveryCharge}
                      </span>
                    </div>
                  </>

                  <button disabled={btnDisable} onClick={handilPlaceOrder}>
                    {btnDisable
                      ? "Loading..."
                      : stockPaymentPageData?.paymentType === "credit"
                      ? "Purchase on Credit"
                      : "Place Your Order"}
                  </button>
                </div>
              </div>
              {isOpenAddressModal && (
                <AddressModal closeModal={closeAddressModal} />
              )}
              {isOpenselectAddressModal && (
                <AddressComponent opencreateAddressModal={OpenAddressModal} />
              )}
            </div>
            <StoreFooter />
          </div>
        </>
      )}
    </>
  );
};

export default BusinessPlaceOrder;
