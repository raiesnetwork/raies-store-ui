import React from 'react';
import '../Helpers/scss/OrderDetails.scss';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import useMystoreStore from '../Core/Store';

interface OrderData {
  DeliveryAddress: {
    fullName: string;
    fullAddress: string;
    landmark: string;
    mobileNumber: string;
    pincode: string;
  };
  status: string;
  productDetails: {
    mainImage: string;
    productName: string;
    price: number;
  }[];
}

const OrderDetails: React.FC = () => {
  const location = useLocation();
  
  // Use real order data passed from the previous page
  const {orderData,type} = location.state;

  // Define the possible statuses in the order tracker
  const statuses = ['On Hold', 'Order Proccessed', 'preparing for shipment', 'shiped','out for delivery', 'delivered'];

  // Function to get the index of the current status
  const getStatusIndex = (status: string) => statuses.indexOf(status);

  const currentStatusIndex = getStatusIndex(orderData.status);

  const {

    storeData
} = useMystoreStore((state) => state);
console.log('order-details-d',orderData);

  return (
    <>
      <Header />
      <div className="order_details__page">
        <div className="order_details">
          <div className="order_details-header">
            <h2>Delivery Address</h2>
            <button className="download-invoice-btn">Download Invoice</button>
          </div>
          <div className="order_details-header">
            <div className="delivery-address">
              <p><strong>{orderData.DeliveryAddress.fullName}</strong></p>
              <p>{orderData.DeliveryAddress.fullAddress}</p>
              <p>{`${orderData.DeliveryAddress.landmark}, ${orderData.DeliveryAddress.pincode}`}</p>
              <p>{orderData.DeliveryAddress.mobileNumber}</p>
            </div>
            <div className="order-info">
              <div className="order-name-price">
                <h3>{type==="normal"?orderData.productDetails[0]?.productName :orderData.productDetails.productName}</h3>
                <p><strong>₹{type==="normal"?orderData.productDetails[0]?.productName :orderData.productDetails.price}</strong></p>
              </div>
              <div className="order-infor-storename">{`${storeData.storeName} STORE`} </div>
            </div>
          </div>

          <div className="order-details-status">
            <div className="order-item">
              <img
                src={type==="normal"?orderData.productDetails[0]?.mainImage :orderData?.productDetails?.mainImage}
                alt="Product"
                className="order-item-image"
              />
            </div>

            <div className="order-tracker">
              <ul className="order-status">
                {statuses.map((status, index) => (
                  <li
                    key={status}
                    className={`${index <= currentStatusIndex ? 'completed' : ''}`}
                  >
                    <span>{status}</span>
                    {/* You can modify the date as per your orderData */}
                    <p>{['Mon, 29th Aug', 'Wed, 31st Aug', 'Sun, 4th Sep', 'Sun, 4th Sep'][index]}</p>
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
    </>
  );
};

export default OrderDetails;
