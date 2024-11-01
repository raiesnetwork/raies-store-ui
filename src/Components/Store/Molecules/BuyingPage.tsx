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
  } = useMystoreStore((s) => s);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const location = useLocation();
  const { details } = location.state || {};
  const [btnDisable, setBtndesable] = useState<boolean>(false);
  // const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);

  const totalPrice = details.reduce(
    (total: number, product: respStoreCart) =>
      total + Number(product.productDetails.price) * product.quantity,
    0
  );

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
  const navigate = useNavigate();
  const handilPlaceOrder = async () => {
    if (selectedAddress._id.trim() && selectedPaymentMethod.trim()) {
      setBtndesable(true);
      const productDetais = details.map((val: respStoreCart) => {
        return {
          id: val?.productDetails?._id,
          quantity: val?.quantity,
          productName: val?.productDetails?.productName,
          mainImage: val?.productDetails?.mainImage,
          cartId: val?._id,
          price: val?.productDetails?.price,
        };
      });

      const totalAmountWithDelivery = totalPrice + 80;
      if (selectedPaymentMethod === "offline") {
        const data = await createOrdr({
          addressId: selectedAddress._id,
          paymentMethod: selectedPaymentMethod,
          productDetails: productDetais,
          totalAmount: totalAmountWithDelivery,
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
          navigate("/success", { state: { orderDetails: details } });
        }
      } else {
        setBtndesable(false);

        try {
          // setLoading(true)

          const { order } = await createRazorpayOrder(totalAmountWithDelivery);

          const options = {
            key: "rzp_test_7TGBri3PsjHg77",
            amount: order.amount,
            currency: "INR",
            name: "STORE CART PURCHASE",
            description: "Fund for the campaign",
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
                  totalAmount: totalAmountWithDelivery,
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
          console.error("Payment failed:", error);
          toast.error("Payment failed. Please try again.");
        }
        await FetchToCart();
        navigate("/success", { state: { orderDetails: details } });
      }
    } else {
      setBtndesable(false);

      toast.error(
        "Please make sure to select your delivery address and payment method."
      );
    }
  };
  console.log('addree',addressData);
  
  return (
    <>
      <Header />
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
        <div className="section payment-section">
          <div className="section-header">2. Payment Method</div>
          <div className="payment-methods">
            <div>
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
            </div>
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

        {/* Order Summary Section */}
        <div className="section order-summary">
          <>
            <div className="summary-row">
              <span>Items:</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="summary-row">
              <span>Delivery:</span>
              <span>₹80.00</span>
            </div>
            <div className="summary-row">
              <span>Total:</span>
              <span className="total-price">₹{totalPrice + 80}</span>
            </div>
          </>

          <button disabled={btnDisable} onClick={handilPlaceOrder}>
            {btnDisable ? "Loading..." : " Place Your Order"}
          </button>
        </div>
      </div>
      {isOpenAddressModal && <AddressModal closeModal={closeAddressModal} />}
      {isOpenselectAddressModal && (
        <AddressComponent opencreateAddressModal={OpenAddressModal} />
      )}
      <div style={{
        position:"fixed",
        bottom:0,
        width:"100%"
      }}>

      <StoreFooter/>
      </div>
    </>
  );
};

export default CheckoutPage;
