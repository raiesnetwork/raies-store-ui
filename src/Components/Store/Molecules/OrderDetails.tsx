// src/components/OrderDetails.tsx
import React from 'react';
import '../Helpers/scss/OrderDetails.scss';
import { useLocation } from 'react-router-dom';
import Header from './Header';


interface orderData{
  DeliveryAddress:{
        createdAt:string
    fullAddress:string
    fullName:string
    id:string
    landmark:string
    mobileNumber:string
    pincode:string
    userId:string
  }
addressId:string
createdAt:string
id:string
paymentMethod:string
status:string
totalAmount:number
userId:string
productDetails:productDetails[]
}
interface productDetails{
  id:string
  quantity: number
   productName:string
   mainImage: string
   cartId:string
   price:string|number
}




const OrderDetails: React.FC = () => {
  const location=useLocation()
 const orderData:orderData=location?.state?.orderData||{}
  return (
    <>
    <Header/>
    <div className="order_details">
      <div className="order_details-header">
        <h2>Delivery Address</h2>
        <button className="download-invoice-btn">Download Invoice</button>
      </div>
      <div className="delivery-address">
        <p><strong>{orderData.DeliveryAddress.fullName}</strong></p>
        <p>{orderData?.DeliveryAddress?.fullAddress}</p>
        <p>{orderData?.DeliveryAddress?.landmark+','+orderData?.DeliveryAddress?.pincode}</p>
        <p>Phone number: {orderData?.DeliveryAddress?.mobileNumber}</p>
      </div>

      <div className="order-details-status">
        <div className="order-item">
          <img
            src={orderData.productDetails[0].mainImage}
            alt="Product Image"
            className="order-item-image"
          />
          <div className="order-info">
            <h3>{orderData?.productDetails[0].productName}</h3>
            <p><strong>₹450</strong></p>
            <p>Seller: ETHNIC.FASHION</p>
          </div>
        </div>

        <div className="order-tracker">
          <ul className="order-status">
            <li className="completed">
              <span>Order Confirmed</span>
              <p>Mon, 29th Aug</p>
            </li>
            <li className="completed">
              <span>Shipped</span>
              <p>Wed, 31st Aug</p>
            </li>
            <li className="completed">
              <span>Out for Delivery</span>
              <p>Sun, 4th Sep</p>
            </li>
            <li className="completed">
              <span>Delivered</span>
              <p>Sun, 4th Sep</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    </>
  );
};

export default OrderDetails;
