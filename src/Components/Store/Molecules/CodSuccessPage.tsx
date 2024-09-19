import React, { useEffect, useState } from "react";
import "../Helpers/scss/CodSuccsPage.scss";
import Header from "./Header";
import { Link, useLocation } from "react-router-dom";
import {  respStoreCart } from "../Core/Interfaces";
import { IoHomeOutline } from "react-icons/io5";
const SuccessPage: React.FC = () => {
    const location=useLocation()
    const {orderDetails}=location.state||{}
    const [data,setData]=useState(orderDetails)
    useEffect(()=>{
      if (orderDetails) {
        setData(orderDetails)
      }
    },[orderDetails])

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
            data?.map((val:respStoreCart)=>(

                <>
          <hr key={val.id} />

              <p><strong>Order Number:</strong> {val.id}</p>
          <p><strong>Product Name:</strong> {val.productDetails.productName}</p>

          <p><strong>Quantity:</strong>{val.quantity}</p>
          <p><strong>Price:</strong> {val.productDetails.price}</p>
          {/* <p><strong>Estimated Delivery Date:</strong> {}</p> */}
          {/* <p><strong>Tracking Number:</strong> {ingNumber}</p> */}
          <hr/>
          </>
        ))
          }
        </div>
        
        <div className="actions">
          <Link to="/orders" className="view-order-btn"><span className="view-order">View Orders</span></Link>
          <Link to="/" className="button"><IoHomeOutline className="pe-3"/></Link>
        </div>
      </div>
    </div>
    </>
  );
};

export default SuccessPage;
