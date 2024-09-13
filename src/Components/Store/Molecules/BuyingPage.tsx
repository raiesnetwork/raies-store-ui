import React, { useEffect, useState } from "react";
import '../Helpers/scss/BuyPage.scss'
import Header from "./Header";
import { useLocation } from "react-router-dom";
import { respProduct } from "../Core/Interfaces";
import AddressModal from "./BuyAddressModal";
import { ToastContainer } from "react-toastify";
import useMystoreStore from "../Core/Store";
import AddressComponent from "./ShowAllAddressModal";
const CheckoutPage: React.FC = () => {
  const {selectedAddress,addressData,getAddress,isOpenselectAddressModal,setIsOpenSelectAddressModal

  }=useMystoreStore((s)=>s)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const location=useLocation()
  const {details,type}=location.state||{}
  

  // const totalPrice = products.reduce(
  //   (total, product) => total + product.price * product.quantity,
  //   0
  // );

  const [isOpenAddressModal,setAddressModal]=useState<boolean>(false)
  const OpenAddressModal=()=>{
      setAddressModal(true)
  }
  const closeAddressModal=()=>{
    setAddressModal(false)

  }
  useEffect(()=>{
    const apiHelper=async()=>{
      await getAddress()
    }
    apiHelper()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  const handilPlaceOrder=()=>{
    if (selectedAddress.id.trim()&&selectedPaymentMethod.trim()) {
      if (selectedPaymentMethod==="offline") {
        alert("hii")
      }
    }
  }
  return (
    <>
    <Header/>
    <div className="checkout-page">
      {/* Delivery Address Section */}
      <div className="section address-section">
        <div className="section-header">1. Delivery Address</div>
        <div className="address-details">
          {
            selectedAddress.id&&
            <>
          <div>
            <p><strong>{selectedAddress.fullName}</strong></p>
            <p>{selectedAddress.fullAddress}</p>
            <p>{selectedAddress.landmark},{selectedAddress.pincode}</p>
            <p>{selectedAddress.mobileNumber}</p>
          </div> 
           <button onClick={() =>setIsOpenSelectAddressModal()}>Change</button>
          </>
          }
          {
            (!addressData?.length&&!selectedAddress.id)&&
          <button onClick={OpenAddressModal}>Add new Address</button>
          }{
            (addressData?.length&&!selectedAddress.id)&&
          <button onClick={setIsOpenSelectAddressModal}>Select Address</button>
          }

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
          {details?.map((product:respProduct) => (
            <div key={product.id} className="product-card">
              <img src={product.mainImage} alt={product.productName} />
              <div className="product-details">
                <h4>{product.productName}</h4>
                <p>Price: ₹{product.price}.00</p>
                {/* <p>Delivery: {product.deliveryDate}</p> */}
              </div>
              <div className="quantity">
                <p>Qty: 1</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary Section */}
      <div className="section order-summary">
        {type==="single"&&
          <>
          <div className="summary-row">
          <span>Items:</span>
          <span>{details[0].currency+ ' '+details[0].price}</span>
        </div>
        <div className="summary-row">
          <span>Delivery:</span>
          <span>₹80.00</span>
        </div>
        <div className="summary-row">
          <span>Total:</span>
          <span className="total-price">{ details[0].currency+''+Number(details[0].price+ 80) }</span>
        </div>
          </>
        }
        <button onClick={handilPlaceOrder}>Place Your Order</button>
      </div>
    </div>
    {isOpenAddressModal&&(<AddressModal closeModal={closeAddressModal}/>)}
    {isOpenselectAddressModal&&<AddressComponent opencreateAddressModal={OpenAddressModal} />}
    <ToastContainer/>
    </>
  );
};

export default CheckoutPage;
