import React from "react";
import "../Helpers/scss/CodSuccsPage.scss";
import Header from "./Header";

const SuccessPage: React.FC = () => {
  // Demo data
  const orderDetails = {
    orderNumber: "123456789",
    productName: "Cool Gadget",
    quantity: 1,
    price: "$199.99",
    deliveryDate: "2024-09-25",
    trackingNumber: "TRK123456789",
  };

  return (
    <>
    <Header/>
    <div className="success-page">
      <div className="success-page-content">
        <h1>Thank You for Your Purchase!</h1>
        <p>Your order has been successfully placed. Below are the details of your order:</p>
        
        <div className="order-summary">
          <h2>Order Summary</h2>
          <p><strong>Order Number:</strong> {orderDetails.orderNumber}</p>
          <p><strong>Product Name:</strong> {orderDetails.productName}</p>
          <p><strong>Quantity:</strong> {orderDetails.quantity}</p>
          <p><strong>Price:</strong> {orderDetails.price}</p>
          <p><strong>Estimated Delivery Date:</strong> {orderDetails.deliveryDate}</p>
          <p><strong>Tracking Number:</strong> {orderDetails.trackingNumber}</p>
        </div>
        
        <div className="actions">
          <a href="/" className="button">Go to Home</a>
          <a href="/orders" className="button">View Your Orders</a>
        </div>
      </div>
    </div>
    </>
  );
};

export default SuccessPage;
