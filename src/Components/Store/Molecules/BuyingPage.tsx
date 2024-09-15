import React, { useEffect, useState } from "react";
import "../Helpers/scss/BuyPage.scss";
import Header from "./Header";
import { useLocation, useNavigate } from "react-router-dom";
import { respStoreCart } from "../Core/Interfaces";
import AddressModal from "./BuyAddressModal";
import { toast, ToastContainer } from "react-toastify";
import useMystoreStore from "../Core/Store";
import AddressComponent from "./ShowAllAddressModal";

const CheckoutPage: React.FC = () => {
  const {
    selectedAddress,
    addressData,
    getAddress,
    isOpenselectAddressModal,
    setIsOpenSelectAddressModal,
    createOrdr,
    FetchToCart
  } = useMystoreStore((s) => s);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const location = useLocation();
  const { details } = location.state || {};
  const [btnDisable, setBtndesable] = useState<boolean>(false);

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
  }, []);
  const navigate = useNavigate();
  const handilPlaceOrder = async () => {
    if (selectedAddress.id.trim() && selectedPaymentMethod.trim()) {
      setBtndesable(true);
      const productDetais = details.map((val: respStoreCart) => {
        return {
          id: val.productDetails.id,
          quantity: val.quantity,
          productName: val.productDetails.productName,
          mainImage: val.productDetails.mainImage,
          cartId: val.id,
        };
      });

      if (selectedPaymentMethod === "offline") {
        const data = await createOrdr({
          addressId: selectedAddress.id,
          paymentMethod: selectedPaymentMethod,
          productDetails: productDetais,
          totalAmount: totalPrice,
         
        });
        setBtndesable(false);

        if (data.error) {
          setBtndesable(false);

          toast.error("cant create order");
        } else {
          setBtndesable(false);
          FetchToCart()
          navigate("/success", { state: { orderDetails: details } });
        }
      } else {
        setBtndesable(false);

        alert("online");
      }
    } else {
      setBtndesable(false);

      toast.error(
        "Plese select the delivery address and payment method properly"
      );
    }
  };
  return (
    <>
      <Header />
      <div className="checkout-page">
        {/* Delivery Address Section */}
        <div className="section address-section">
          <div className="section-header">1. Delivery Address</div>
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
                <button onClick={() => setIsOpenSelectAddressModal()}>
                  Change
                </button>
              </>
            )}
            {!addressData?.length && !selectedAddress.id && (
              <button onClick={OpenAddressModal}>Add new Address</button>
            )}
            {addressData?.length && !selectedAddress.id && (
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
                    <hr key={product.id} />

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
           {btnDisable?"Loading...":" Place Your Order"}
          </button>
        </div>
      </div>
      {isOpenAddressModal && <AddressModal closeModal={closeAddressModal} />}
      {isOpenselectAddressModal && (
        <AddressComponent opencreateAddressModal={OpenAddressModal} />
      )}
      <ToastContainer />
    </>
  );
};

export default CheckoutPage;
