import React, { useState } from 'react';
import '../Helpers/scss/OrderDetails.scss';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import useMystoreStore from '../Core/Store';
import { FaTruckMoving, FaTimesCircle } from "react-icons/fa";
import { format } from 'date-fns';
import StoreFooter from '../../Footer/Footer';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { cancelOrder } from '../Core/StoreApi';
import { toast } from 'react-toastify';

const OrderDetails: React.FC = () => {
  const location = useLocation();
  const { orderData, type } = location.state;
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');
  const [currentOrderData, setCurrentOrderData] = useState(orderData);
  
  // Updated statuses to include cancellation
  const statuses = ['On Hold', 'Order Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];
  const cancelledStatus = 'Order Canceled';

  const getStatusIndex = (status: string) => statuses.indexOf(status);
  const currentStatusIndex = type === "normal" 
    ? getStatusIndex(currentOrderData.status) 
    : getStatusIndex(currentOrderData.deliveryStatus);

  const { storeData } = useMystoreStore((state) => state);

  // Helper function to add days to a given date
  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  // Get the starting date (createdAt or the first updateHistory)
  const createdAtDate = new Date(orderData.createdAt);
  const updateHistoryDates = orderData?.updateHistory?.map((date: any) => new Date(date));

  // Dates array to store the calculated dates
  const statusDates: string[] = [];
  statusDates.push(format(createdAtDate, 'EEE, d MMM'));

  // Fill the dates for the statuses that have been updated
  updateHistoryDates?.forEach((date: any, index: number) => {
    if (index < statuses.length) {
      statusDates.push(format(date, 'EEE, d MMM'));
    }
  });

  // Calculate the remaining dates for statuses that haven't been updated yet
  let lastKnownDate = updateHistoryDates?.length > 0 ? updateHistoryDates[updateHistoryDates.length - 1] : createdAtDate;
  for (let i = updateHistoryDates?.length || 0; i < statuses.length; i++) {
    lastKnownDate = addDays(lastKnownDate, 3);
    statusDates.push(format(lastKnownDate, 'EEE, d MMM'));
  }

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      return toast.error('Please select a proper reason');
    }
    
    try {
      const data = await cancelOrder(orderData?._id, type, cancelReason, additionalComments);
      
      if (data?.error) {
        toast.error(data.message);
      } else {
        setCurrentOrderData((prev: any) => ({
          ...prev,
          status: cancelledStatus
        }));
        toast.success("Order cancelled successfully");
        setShowCancelModal(false);
        setCancelReason('');
        setAdditionalComments('');
      }
    } catch (error) {
      toast.error("Failed to cancel order");
      console.error(error);
    }
  };

  const cancellationReasons = [
    "Changed my mind",
    "Found a better price elsewhere",
    "Shipping takes too long",
    "Product no longer needed",
    "Other reason"
  ];

  // Calculate progress width - set to 100% if cancelled
  const progressWidth = currentOrderData.status === cancelledStatus 
    ? '100%' 
    : `${(currentStatusIndex / (statuses.length - 1)) * 100}%`;

  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Header />
        <div style={{ flex: 1 }}>
          <div className="order_details__page">
            <div className="order_details">
              <div className="order_details-header">
                <h2>Order Details</h2>
                <div className="order-actions">
                  <button className="download-invoice-btn">Download Invoice</button>
                  {currentOrderData?.status !== cancelledStatus && (
                    <button 
                      className="btn btn-danger" 
                      onClick={() => setShowCancelModal(true)}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
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
                        {orderData?.DeliveryAddress?.fullName}
                      </div>
                      <div className="delivery-address-no">
                        {orderData?.DeliveryAddress?.mobileNumber}
                      </div>
                      <div className="delivery-address-full">
                        {orderData?.DeliveryAddress?.fullAddress}
                      </div>
                      <div className="delivery-address-pin">
                        {orderData?.DeliveryAddress?.pincode}
                      </div>
                    </div>
                    <p>{orderData?.DeliveryAddress?.landmark}</p>
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
                    {statuses.map((status, index) => (
                      <li
                        key={status}
                        className={`
                          ${index <= currentStatusIndex ? 'completed' : ''}
                          ${currentOrderData.status === cancelledStatus ? 'cancelled' : ''}
                        `}
                      >
                        <span>{status}</span>
                        <p>{statusDates[index]}</p>
                        {index === currentStatusIndex && (
                          currentOrderData.status === cancelledStatus ? (
                            <FaTimesCircle className="cancel-icon" />
                          ) : (
                            <FaTruckMoving className="truck-icon" />
                          )
                        )}
                      </li>
                    ))}
                    {/* Add cancelled status as a separate item if order is cancelled */}
                    {currentOrderData.status === cancelledStatus && (
                      <li className="cancelled-status">
                        <span>{cancelledStatus}</span>
                        <p>{format(new Date(), 'EEE, d MMM')}</p>
                        <FaTimesCircle className="cancel-icon" />
                      </li>
                    )}
                  </ul>
                  <div className="progress-line">
                    <div 
                      className={`
                        progress 
                        ${currentOrderData.status === cancelledStatus ? 'cancelled-progress' : ''}
                      `} 
                      style={{ width: progressWidth }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <StoreFooter/>
      </div>

      {/* Cancel Order Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Cancel Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Reason for cancellation</Form.Label>
              <Form.Select 
                value={cancelReason} 
                onChange={(e) => setCancelReason(e.target.value)}
                required
              >
                <option value="">Select a reason</option>
                {cancellationReasons.map((reason) => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Additional comments</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
                placeholder="Any additional details..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowCancelModal(false)}>
            Close
          </Button>
          <Button 
            variant="danger" 
            onClick={handleCancelOrder}
            disabled={!cancelReason}
          >
            Confirm Cancellation
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OrderDetails;