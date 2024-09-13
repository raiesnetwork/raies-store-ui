import React, { useState } from "react";
import '../Helpers/scss/BuyPage.scss'
import Header from "./Header";
import { useLocation } from "react-router-dom";
import { respProduct } from "../Core/Interfaces";
import AddressModal from "./BuyAddressModal";
const CheckoutPage: React.FC = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [address, setAddress] = useState("Edacheri, Kerala 675503");
  const location=useLocation()
  const {details,type}=location.state||{}
  const products = [
    {
      id: 1,
      name: "boAt BassHeads 100 in-Ear Wired Headphones with Mic (Black)",
      price: 329,
      quantity: 2,
      image: "https://via.placeholder.com/100", // Replace with actual image URL
      deliveryDate: "14 Sept 2024",
    },
  ];

  const totalPrice = products.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  const [isOpenAddressModal,setAddressModal]=useState<boolean>(false)
  const OpenAddressModal=()=>{
      setAddressModal(true)
  }
  const closeAddressModal=()=>{
    setAddressModal(false)

  }
  return (
    <>
    <Header/>
    <div className="checkout-page">
      {/* Delivery Address Section */}
      <div className="section address-section">
        <div className="section-header">1. Delivery Address</div>
        <div className="address-details">
          {/* <div>
            <p><strong>Kk</strong></p>
            <p>{address}</p>
          </div> */}
          {/* <button onClick={() => alert("Change Address Clicked!")}>Change</button> */}
          <button onClick={OpenAddressModal}>Add new Address</button>

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
              Pay on Delivery (Cash/Card)
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
        <button onClick={() => alert("Order Placed!")}>Place Your Order</button>
      </div>
    </div>
    {isOpenAddressModal&&(<AddressModal closeModal={closeAddressModal}/>)}
    </>
  );
};

export default CheckoutPage;
