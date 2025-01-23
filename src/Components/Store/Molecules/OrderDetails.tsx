import React from 'react';
import '../Helpers/scss/OrderDetails.scss';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import useMystoreStore from '../Core/Store';
import { FaTruckMoving } from "react-icons/fa";
import { format } from 'date-fns';
import StoreFooter from '../../Footer/Footer';



const OrderDetails: React.FC = () => {
  const location = useLocation();
  const { orderData, type } = location.state;
  console.log('details', orderData);

  const statuses = ['On Hold', 'Order Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];

  const getStatusIndex = (status: string) => statuses.indexOf(status);
  const currentStatusIndex = type === "normal" ? getStatusIndex(orderData.status) : getStatusIndex(orderData.deliveryStatus);

  const { storeData } = useMystoreStore((state) => state);

  // Helper function to add days to a given date
  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  // Get the starting date (createdAt or the first updateHistory)
  const createdAtDate = new Date(orderData.createdAt);
  
  const updateHistoryDates = orderData?.updateHistory?.map((date:any) => new Date(date));

  // Dates array to store the calculated dates
  const statusDates: string[] = [];

  // If order is on hold, use createdAt as the hold date
  statusDates.push(format(createdAtDate, 'EEE, d MMM'));

  // Fill the dates for the statuses that have been updated
  updateHistoryDates.forEach((date:any, index:number) => {
    if (index < statuses.length) {
      statusDates.push(format(date, 'EEE, d MMM'));
    }
  });

  // Calculate the remaining dates for statuses that haven't been updated yet
  let lastKnownDate = updateHistoryDates.length > 0 ? updateHistoryDates[updateHistoryDates.length - 1] : createdAtDate;
  for (let i = updateHistoryDates.length; i < statuses.length; i++) {
    lastKnownDate = addDays(lastKnownDate, 3); // Add 3 days for each status
    statusDates.push(format(lastKnownDate, 'EEE, d MMM'));
  }

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>

<Header />
<div style={{ flex: 1 }}>
      <div className="order_details__page">
        <div className="order_details">
          <div className="order_details-header">
            <h2>Order Details</h2>
            <button className="download-invoice-btn">Download Invoice</button>
          </div>
          
          <div className="order_details-content">
            <div className="product-address-container">
              <div className="order-product">
                <h3>Product Details</h3>
                <div className="order-name-price">
                  <p>{type === "normal" ? orderData.productDetails[0]?.productName : orderData.productDetails.productName}</p>
                  <p>{storeData?.storeName} Store</p>
                </div>
              </div>
              <div className="delivery-address">
                <h3>Delivery Address</h3>
                <div className="delivery-address-text">
                  <div className="delivery-address-name">
                    {orderData.DeliveryAddress.fullName}
                  </div>
                  <div className="delivery-address-no">
                    {orderData.DeliveryAddress.mobileNumber}
                  </div>
                  <div className="delivery-address-full">
                    {orderData.DeliveryAddress.fullAddress}
                  </div>
                  <div className="delivery-address-pin">
                    {orderData.DeliveryAddress.pincode}
                  </div>
                </div>
                <p>{orderData.DeliveryAddress.landmark}</p>
              </div>
            </div>

            <div className="order-image">
              <img
                src={type === "normal" ? orderData.productDetails[0]?.mainImage : orderData?.productDetails?.mainImage}
                alt="Product"
                className="order-item-image"
              />
            </div>
          </div>

          <hr className='order-details-line' />
          <div className="product-type">
            <div className="product-type-name">
              {type === "normal" ? "" : type === "barter" ? "Exchange" : "Auction"}
            </div>
            <div className="product-type-txt">
              {type === "normal" ? `₹${orderData.productDetails[0]?.price}` : type === "barter" ? orderData?.productDetails?.barterProductName: `₹${orderData?.biddingAmount}`}
            </div>
          </div>

          <div className="delivery-tracker">
            <div className='delivery-tracker__head'>Delivery Details</div>
            <div className="order-tracker">
              <ul className="order-status">
                {statuses.length>0&&
                statuses?.map((status, index) => (
                  <li
                    key={status}
                    className={`${index <= currentStatusIndex ? 'completed' : ''}`}
                  >
                    <span>{status}</span>
                    <p>{statusDates[index]}</p>
                    {index === currentStatusIndex && <FaTruckMoving className="truck-icon" />}
                  </li>
                ))}
              </ul>
              <div className="progress-line">
                <div className="progress" style={{ width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      

      </div>
      <StoreFooter/>
      </div>
    </>
  );
};

export default OrderDetails;
