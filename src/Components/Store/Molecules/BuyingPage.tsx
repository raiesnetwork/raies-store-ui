/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import "../Helpers/scss/BuyPage.scss";
import Header from "./Header";
import { useLocation, useNavigate } from "react-router-dom";
import { respStoreCart } from "../Core/Interfaces";
import AddressModal from "./BuyAddressModal";
import { toast } from "react-toastify";
import useMystoreStore from "../Core/Store";
import AddressComponent from "./ShowAllAddressModal";
import StoreFooter from "../../Footer/Footer";
import { getDeliveryCharge } from "../Core/StoreApi";
import { fileToBase64 } from "../../../Utils/Base64";
import Loader from "../../Loader/Loader";

const CheckoutPage: React.FC = () => {
  const {
    createRazorpayOrder,
    verifyRazorpayPayment,
    selectedAddress,
    addressData,
    getAddress,
    isOpenselectAddressModal,
    setIsOpenSelectAddressModal,
    createOrdr,
    FetchToCart,
    postCouponApi,
    shiprocketToken,
    setSelectedAddress,
    createBiddingOrder,
    createBarterOrder,
    profileData,
    getProfileInfo
  } = useMystoreStore((s) => s);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("online");
    const [CourierId, setCourierId] = useState<string>('');
    const location = useLocation();
    const { details, proType } = location.state || {};
    const [btnDisable, setBtndesable] = useState<boolean>(false);
    // const [loading, setLoading] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [deliveryCharge, setdeliveryCharge] = useState<number>(0);

  const [couponAmount, setCouponAmount] = useState<{
    amount: number;
    type: string;
    couponId: string;
  }>({ amount: 0, type: "", couponId: "" });

  let totalPrice = details?.reduce(
    (total: number, product: respStoreCart) =>
      product.productDetails.priceOption !== 'free' ?
        total + Number(product.productDetails.price) * product.quantity : 0,
    0
  );
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    setTotalAmount(totalPrice)
  }, [totalPrice]);
  const [expetedDeliveryData, setExpectedDeliveryDate] = useState<any>();
  const [deliveryLoader,setDeliveryLoader]=useState(false)
  const getDeliveryCharges = async () => {
    
    const aggregatedDetails = details.reduce(
      (
        agg: {
          weight: number;
          length: number;
          breadth: number;
          height: number;
        },
        item: { productDetails: any }
      ) => {
        const product = item.productDetails;
        agg.weight += parseFloat(product.productWeight || 0);
        agg.length = Math.max(
          agg.length,
          parseFloat(product.packageLength || 0)
        );
        agg.breadth = Math.max(
          agg.breadth,
          parseFloat(product.packageBreadth || 0)
        );
        agg.height = Math.max(
          agg.height,
          parseFloat(product.packageHeight || 0)
        );
        return agg;
      },
      { weight: 0, length: 0, breadth: 0, height: 0 }
    );

    const payload = {
      pickup_postcode:
        details[0]?.productDetails?.pickupAddress?.Zip || "673504",
      delivery_postcode: selectedAddress.pincode,
      cod: selectedPaymentMethod === "offline" ? 1 : 0, // 1 for COD, 0 for prepaid
      weight: aggregatedDetails.weight,
      length: aggregatedDetails.length,
      breadth: aggregatedDetails.breadth,
      height: aggregatedDetails.height,
    };
    try {
      setDeliveryLoader(true)
      const data = await getDeliveryCharge(payload, shiprocketToken);
      if(data.status===404){
    return toast.error(data.message)
      }
      console.log(data)
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
      setdeliveryCharge(totalDeliveryCharge);
      setExpectedDeliveryDate(bestCourier?.etd);
      setCourierId(bestCourier?.id)
    } catch (error) {
    
    }finally{
      setDeliveryLoader(false)
    }
  };
  useEffect(() => {
    if (details && selectedAddress) {
      getDeliveryCharges();
    }
  }, [details, selectedAddress, selectedPaymentMethod]);

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

    if (selectedAddress._id.trim() && selectedPaymentMethod.trim()) {
      setBtndesable(true);
      const diamentions = details.reduce((agg: {
        weight: number;
        length: number;
        breadth: number;
        height: number;
      },
        item: { productDetails: any }) => {
        const product = item.productDetails;
        agg.weight += parseFloat(product.productWeight || 0);
        agg.length = Math.max(
          agg.length,
          parseFloat(product.packageLength || 0)
        );
        agg.breadth = Math.max(
          agg.breadth,
          parseFloat(product.packageBreadth || 0)
        );
        agg.height = Math.max(
          agg.height,
          parseFloat(product.packageHeight || 0)
        );
        return agg;
      },
        { weight: 0, length: 0, breadth: 0, height: 0 }
      );
      const productDetais = details?.map((val: respStoreCart) => {
        return {
          _id: val?.productDetails?._id,
          quantity: val?.quantity,
          productName: val?.productDetails?.productName,
          mainImage: val?.productDetails?.mainImage,
          cartId: val?._id,
          price: val?.productDetails?.price,
          diamentions
        };
      });

      const totalAmountWithDelivery = totalPrice + deliveryCharge;
      if (selectedPaymentMethod === "offline") {
        const data = await createOrdr({
          addressId: selectedAddress._id,
          paymentMethod: selectedPaymentMethod,
          productDetails: productDetais,
          totalAmount: totalAmount + deliveryCharge,
          couponData: couponAmount,
          CourierId
        });
        setBtndesable(false);

        if (data.error) {
          setBtndesable(false);

          return toast.error(
            "We couldn't create your order. Please try again."
          );
        } else {
          setBtndesable(false);
          await FetchToCart();

          navigate("/success", { state: { orderDetails: details, orderId: data.data.orderData?.order_id } });
        }
      } else if (selectedPaymentMethod === "credit") {
        // Credit payment flow
        const data = await createOrdr({
          addressId: selectedAddress._id,
          paymentMethod: selectedPaymentMethod,
          productDetails: productDetais,
          totalAmount: totalAmountWithDelivery,
          couponData: couponAmount,
          CourierId,
        });

        setBtndesable(false);

        if (data.error) {
          return toast.error("We couldn't create your credit order. Please try again.");
        } else {
          await FetchToCart();

          navigate("/credit-success", {
            state: { orderDetails: details, orderId: data.data.orderData?.order_id },
          });
        }
      }
      else {

        setBtndesable(false);

        try {
          // setLoading(true)

          const { order } = await createRazorpayOrder(totalAmountWithDelivery);

          const options = {
            key: import.meta.env.VITE_APP_RAZOR_PAY,
            amount: order.amount,
            currency: "INR",
            name: "STORE CART PURCHASE",
            description: "",
            order_id: order.id,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            handler: async (response: any) => {
              try {
                // eslint-disable-next-line prefer-const
                let data = {
                  response,
                  addressId: selectedAddress._id,
                  paymentMethod: selectedPaymentMethod,
                  productDetails: productDetais,
                  totalAmount: totalAmount + deliveryCharge,
                  couponData: couponAmount,
                };
                await verifyRazorpayPayment(data);

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
              name: "John Doe",
              email: "john.doe@example.com",
              contact: "9999999999",
            },
            theme: {
              color: "#3399cc",
            },
            modal: {
              ondismiss: () => {
                // setLoading(false);
                // Optionally stop loading if the user dismisses the payment modal
              },
            },
          };

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rzp1 = new (window as any).Razorpay(options);
          rzp1.open();
        } catch (error) {
          toast.error("Payment failed. Please try again.");
        }
        await FetchToCart();
        navigate("/success", {
          state: {
            orderDetails: details,
            // orderId:data.data.orderId
          }
        });
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
      const data = await postCouponApi(couponCode, details);
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
          totalPrice = Math.max(0, totalPrice - (data?.data?.amount || 0));

          setTotalAmount(totalPrice);
        } else if (data?.data?.type === "percentage") {
          totalPrice -= totalPrice * (data?.data?.amount / 100);
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
 
  const [formData, setFormData] = useState({
    addressId: selectedAddress._id,
    productImage: "",
    productId: details[0]?.productDetails?._id,
    // quantity:"1"
    CourierId: "",
    deliveryCharge: 0,
    biddingAmount: "0",
  });
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed");
        return;
      }

      if (file.size > 1 * 1024 * 1024) {
        toast.error("Image must be 1MB or less");
        return;
      }

      const base64 = await fileToBase64(file);
      setFormData({
        ...formData,
        productImage: base64,
      });
      toast.error(null);
    }
  };
  useEffect(() => {
    if (proType === 'barter') {
      setFormData((prev) => {
        return {
          addressId: selectedAddress._id,
          CourierId: CourierId,
          deliveryCharge: deliveryCharge,
          productId: details[0]?.productDetails?._id,
          productImage: prev?.productImage,
          biddingAmount: ""
        }
      })
    } else if (proType === 'bid') {
      setFormData((prev) => {
        return {
          addressId: selectedAddress._id,
          CourierId: CourierId,
          deliveryCharge: deliveryCharge,
          productId: details[0]?.productDetails?._id,
          productImage: prev?.productImage,
          biddingAmount: prev?.biddingAmount
        }
      })
    }
  }, [proType, selectedAddress, deliveryCharge, CourierId])

  const handleBarderSubmit = async (e: React.FormEvent) => {

    e.preventDefault();

    if (formData.productImage.trim() && selectedAddress._id.trim()) {
      if (CourierId.trim() && !deliveryCharge) {
        return toast.error('We cant fetch delivery details plese try after some time.')
      }
      try {
        const data = await createBarterOrder(formData);

        if (data.error) {

          return toast.error(
            "We're sorry, but there was a problem creating your barter order. Please try again in a few minutes."
          );
        } else {
          if (data.data === "exceed") {
            return toast.error(
              "This product is currently unavailable. Please check back later for restock updates!"
            );
          } else {

            navigate("/success", { state: { orderDetails: details, orderId: "" } });

          }
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        toast.error(
          "We couldn't submit your form due to an error. Please check your information and try again."
        );
      }
    } else {
      toast.error(
        "Please select an exchange image and provide the delivery address."
      );

    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleBidSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
    if (formData?.biddingAmount.trim()) {
      if (formData?.biddingAmount < details[0]?.productDetails.minBidPrice ||
        formData?.biddingAmount > details[0]?.productDetails.maxBidPrice) {
        toast.error(`Bid amount must in bitween ${details[0]?.productDetails.minBidPrice}-${details[0]?.productDetails.maxBidPrice}`)
        return
      }
      if (!CourierId.trim() && !deliveryCharge) {
        return toast.error('We cant fetch delivery details plese try after some time.')
      }
      try {
        const data = await createBiddingOrder(formData);
        if (data.error) {

          return toast.error(
            "We're sorry, but there was a problem creating your bid order. Please try again in a few minutes."
          );
        } else {
          if (data.data === "exceed") {
            return toast.error(
              "This product is currently unavailable. Please check back later for restock updates!"
            );
          }
          navigate("/success", { state: { orderDetails: details, orderId: "" } });
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {

        toast.error(
          "We couldn't submit your form due to an error. Please check your information and try again."
        );
      }
    } else {
      toast.error(
        "Please enter bid  amount and provide the delivery address."
      );

    }
  };



   return (
    <>
    {
      deliveryLoader?
      <Loader/>
      :
    <>
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
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
              <div className="section-header">
                {proType === "barter"
                  ? "2. Select Barter Product Image"
                  : proType === "bid"
                    ? "2. Enter Bid Amount"
                    : "2. Payment Method"}
              </div>
              <div className="payment-methods">
                {proType === "barter" ? (
                  <input
                    type="file"
                    id="productImage"
                    name="productImage"
                    onChange={handleImageUpload}
                  />
                ) : proType === "bid" ? (
                  <input
                    type="number"
                    id="biddingAmount"
                    value={formData.biddingAmount}
                    name="biddingAmount"
                    onChange={handleChange}
                  />
                ) : (
                  <div>
                    {/* Online Payment Option */}
                    <label>
                      <input
                        type="radio"
                        name="payment"
                        value="online"
                        checked={selectedPaymentMethod === "online"}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      />
                      Online Payment
                    </label>

                    {/* Pay on Delivery Option */}
                    <label style={{ marginLeft: "20px" }}>
                      <input
                        type="radio"
                        name="payment"
                        value="offline"
                        checked={selectedPaymentMethod === "offline"}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      />
                      Pay on Delivery (Cash)
                    </label>

                    {/* Credit Option (Conditional Rendering) */}
                    {profileData?.dealerView && profileData?.paymentType === "Credit" && (
                      <>
                        <label style={{ marginLeft: "20px" }}>
                          <input
                            type="radio"
                            name="payment"
                            value="credit"
                            checked={selectedPaymentMethod === "credit"}
                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                          />
                          Purchase on Credit
                        </label>

                        {/* Note for Credit Payment */}
                        {selectedPaymentMethod === "credit" && (
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
                              Note :  You are purchasing this product on credit. An invoice will be
                              generated and available in the "Invoice Section" of your
                              profile. Please ensure timely payment to avoid additional
                              charges.
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>


            {/* Product Review Section */}
            <div className="section product-review-section">
              <div className="section-header">3. Review Items and Delivery</div>
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
                  {details?.length &&
                    details?.map((product: respStoreCart) => (
                      <>
                        <hr key={product._id} />

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
                            src={product.productDetails.mainImage}
                            alt={product.productDetails.productName}
                          />
                          <div className="product-details">
                            <h4>{product.productDetails.productName}</h4>
                            <p>Price: ₹{product.productDetails.price}.00</p>
                            {/* <p>Delivery: {product.deliveryDate}</p> */}
                          </div>
                          <div className="quantity">
                            <p>Qty: {product.quantity}</p>
                          </div>
                        </div>
                        <hr />
                      </>
                    ))}
                </div>
              </div>
            </div>
            {/* coupon section */}
            {!proType &&
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
            }
            {/* Order Summary Section */}
            <div className="section order-summary">
              <>
                <div className="summary-row">
                  <span>Expected delivery:</span>
                  <span>{expetedDeliveryData}</span>
                </div>
                {!proType &&
                  <div className="summary-row">
                    <span>Items:</span>
                    <span>₹{totalPrice}</span>
                  </div>}
                <div className="summary-row">
                  <span>Delivery:</span>
                  <span>{deliveryCharge}</span>
                </div>
                {!proType &&
                  <div className="summary-row">
                    <span>Discount Coupon:</span>
                    <span>{couponAmount.amount}</span>
                  </div>}
                <div className="summary-row">
                  <span>Total:</span>
                  <span className="total-price">
                    ₹{!deliveryLoader&&proType === "bid"
        ? ( parseFloat(formData?.biddingAmount) || 0) + deliveryCharge 
        :!deliveryLoader &&totalAmount+deliveryCharge}
                  </span>
                </div>
              </>

              <button
                disabled={btnDisable}
                onClick={
                  proType === "barter"
                    ? handleBarderSubmit
                    : proType === "bid"
                      ? handleBidSubmit
                      : handilPlaceOrder
                }
              >
                {btnDisable
                  ? "Loading..."
                  : selectedPaymentMethod === "credit"
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
}
    </>
  );
};

export default CheckoutPage;
