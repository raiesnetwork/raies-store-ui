import React from "react";
import "../Helpers/scss/CodSuccsPage.scss";
import Header from "./Header";
import { Link, useLocation } from "react-router-dom";
import { respProduct } from "../Core/Interfaces";

const SuccessPage: React.FC = () => {
    const location=useLocation()
    const {orderDetails,quantity}=location.state||{}
  

  return (
    <>
    <Header/>
    <div className="success-page">
      <div className="success-page-content">
        <h1>Thank You for Your Purchase!</h1>
        <p>Your order has been successfully placed. Below are the details of your order:</p>
        
        <div className="order-summary">
          <h2>Order Summary</h2>
          {
            orderDetails.map((val:respProduct)=>(

                <>

              <p><strong>Order Number:</strong> {val.id}</p>
          <p><strong>Product Name:</strong> {val.productName}</p>

          <p><strong>Quantity:</strong> {quantity>=1?quantity:val.productCount}</p>
          <p><strong>Price:</strong> {val.price}</p>
          {/* <p><strong>Estimated Delivery Date:</strong> {}</p> */}
          {/* <p><strong>Tracking Number:</strong> {ingNumber}</p> */}
          </>
        ))
          }
        </div>
        
        <div className="actions">
          <Link to="/" className="button">Go to Home</Link>
          <Link to="/orders" className="button">View Your Orders</Link>
        </div>
      </div>
    </div>
    </>
  );
};

export default SuccessPage;
