import React, { useState } from 'react';
import '../Helpers/scss/OrderDetails.scss';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import useMystoreStore from '../Core/Store';
import { FaTruckMoving, FaTimesCircle, FaCheckCircle, FaUndo } from "react-icons/fa";
import { format, isValid, parseISO } from 'date-fns';
import StoreFooter from '../../Footer/Footer';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { cancelOrder, returnOrder } from '../Core/StoreApi';
import { toast } from 'react-toastify';

const OrderDetails: React.FC = () => {
  const location = useLocation();
  const { orderData, type } = location.state;
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [returnReason, setReturnReason] = useState('');
  const [additionalComments, setAdditionalComments] = useState('');
  const [currentOrderData, setCurrentOrderData] = useState(orderData);
  const [isReturnOrder] = useState(currentOrderData.returnOrder || false);
  const [bankDetails, setBankDetails] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
    ifscCode: '',
    accountType: ''
  });
  const handleBankDetailChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBankDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  // Safe date parsing and formatting function
  const safeFormatDate = (dateString: string | Date | undefined | null, fallback = ''): string => {
    if (!dateString) return fallback;

    try {
      // Parse the date string using date-fns parseISO for ISO strings or new Date for others
      const date = typeof dateString === 'string'
        ? parseISO(dateString)
        : new Date(dateString);

      return isValid(date) ? format(date, 'EEE, d MMM') : fallback;
    } catch (error) {
      console.error('Date formatting error:', error);
      return fallback;
    }
  };

  // Categorized status flows
  const statusFlows = {
    normal: [
      'NEW',
      'READY TO SHIP',
      'PENDING',
      'PICKUP SCHEDULED',
      'PICKUP QUEUED',
      'PICKUP GENERATED',
      'PICKED UP',
      'IN TRANSIT',
      'OUT FOR DELIVERY',
      'DELIVERED'
    ],
    rto: [
      'NEW',
      'READY TO SHIP',
      'PICKUP SCHEDULED',
      'PICKUP GENERATED',
      'PICKED UP',
      'RETURN IN TRANSIT',
      'RTO DELIVERED'
    ],
    cancelled: [
      'NEW',
      'READY TO SHIP',
      'PENDING',
      'CANCELED'
    ],
    problem: [
      'LOST',
      'DAMAGED',
      'UNDELIVERED',
      'REJECTED',
      'PICKUP ERROR'
    ]
  };

  const simplifiedStatusMap: Record<string, string> = {
    'NEW': 'Order Placed',
    'READY TO SHIP': 'Ready to ship',
    'PENDING': 'Pending',
    'PICKUP SCHEDULED': 'Pickup Scheduled',
    'PICKUP QUEUED': 'Pickup Queued',
    'PICKUP GENERATED': 'Pickup Generated',
    'PICKUP ERROR': 'Pickup Error',
    'PICKED UP': 'Picked Up',
    'IN TRANSIT': 'In Transit',
    'OUT FOR DELIVERY': 'Out for Delivery',
    'DELIVERED': 'Delivered',
    'RTO INITIATED': 'Return Initiated',
    'RTO DELIVERED': 'Return Completed',
    'CANCELED': 'Cancelled',
    'LOST': 'Lost in Transit',
    'DAMAGED': 'Damaged',
    'UNDELIVERED': 'Undelivered',
    'REJECTED': 'Rejected by Customer'
  };

  const statusIcons: Record<string, JSX.Element> = {
    'DELIVERED': <FaCheckCircle className="delivered-icon" />,
    'CANCELED': <FaTimesCircle color='red' className="truck-icon cancelled-icon" />,
    'RTO DELIVERED': <FaUndo className="returned-icon" />,
    'LOST': <FaTimesCircle className="problem-icon" />,
    'DAMAGED': <FaTimesCircle className="problem-icon" />,
    'UNDELIVERED': <FaTimesCircle className="problem-icon" />,
    'REJECTED': <FaTimesCircle className="problem-icon" />,
    'PICKUP ERROR': <FaTimesCircle className="problem-icon" />
  };

  // Get the current status from order data and convert to uppercase
  const currentStatus = (type === "normal"
    ? currentOrderData.status
    : currentOrderData.deliveryStatus)?.toUpperCase();

  // Determine which flow to use based on current status
  const getActiveFlow = () => {
    if (statusFlows.rto.includes(currentStatus) && isReturnOrder) {
      return statusFlows.rto;
    } else if (currentStatus === 'CANCELED') {
      return statusFlows.cancelled;
    } else if (isReturnOrder) {
      return statusFlows.rto;
    } else if (statusFlows.problem.includes(currentStatus)) {
      const normalFlow = [...statusFlows.normal];
      const lastCompletedStatus = orderData?.statusHistory
        ?.filter((h: any) => statusFlows.normal.includes(h.status?.toUpperCase()))
        ?.sort((a: any, b: any) => {
          const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
          const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
          return dateB - dateA;
        })[0]?.status?.toUpperCase();

      const lastCompletedIndex = lastCompletedStatus
        ? normalFlow?.findIndex(status => status === lastCompletedStatus)
        : -1;

      return lastCompletedIndex >= 0
        ? [...normalFlow.slice(0, lastCompletedIndex + 1), currentStatus]
        : [currentStatus];
    }
    return statusFlows.normal;
  };

  const activeFlow = getActiveFlow();
  const currentStatusIndex = activeFlow.indexOf(currentStatus);

  const { storeData } = useMystoreStore((state) => state);
  console.log("currentOrder", currentOrderData)
  // Get status dates from order data
  // const getStatusDates = () => {
  //   const dates: Record<string, string> = {};

  //   // Order creation date
  //   dates['NEW'] = safeFormatDate(currentOrderData.createdAt);

  //   // Add dates from updateHistory
  //   if (currentOrderData.updateHistory && currentOrderData.updateHistory.length > 0) {
  //     if (currentStatus === 'CANCELED' && currentOrderData.updateHistory.length === 1) {
  //       dates['CANCELED'] = safeFormatDate(currentOrderData.updateHistory[0]);
  //     } else {
  //       currentOrderData.updateHistory.forEach((dateString: string, index: number) => {
  //         if (index < activeFlow.length) {
  //           dates[activeFlow[index]] = safeFormatDate(dateString);
  //         }
  //       });
  //     }
  //   }

  //   // Add dates from ShipRocket orderData if available
  //   if (currentOrderData.orderData?.statusHistory) {
  //     currentOrderData.orderData.statusHistory.forEach((historyItem: any) => {
  //       const status = historyItem.status?.toUpperCase();
  //       if (status && historyItem.timestamp && !dates[status]) {
  //         dates[status] = safeFormatDate(historyItem.timestamp);
  //       }
  //     });
  //   }

  //   // Add return request dates if available
  //   if (currentOrderData.returnRequestDate) {
  //     dates['RETURN REQUESTED'] = safeFormatDate(currentOrderData.returnRequestDate);
  //   }
  //   if (currentOrderData.returnApprovalDate) {
  //     dates['RETURN APPROVED'] = safeFormatDate(currentOrderData.returnApprovalDate);
  //   }
  //   if (currentOrderData.returnCompletionDate) {
  //     dates['RETURNED'] = safeFormatDate(currentOrderData.returnCompletionDate);
  //   }

  //   // Fill in missing dates with estimates
  //   let lastDate = currentOrderData.createdAt ? new Date(currentOrderData.createdAt) : new Date();
  //   activeFlow.forEach(status => {
  //     if (!dates[status]) {
  //       const daysToAdd =
  //         status === 'CANCELED' ? 1 :
  //           status.includes('PICKUP') ? 1 :
  //             status === 'DELIVERED' || status === 'RTO DELIVERED' || status === 'RETURNED' ? 2 : 1;

  //       lastDate = new Date(lastDate.setDate(lastDate.getDate() + daysToAdd));
  //       dates[status] = safeFormatDate(lastDate);
  //     } else {
  //       const historyItem = currentOrderData.orderData?.statusHistory?.find(
  //         (h: any) => h.status?.toUpperCase() === status
  //       );
  //       if (historyItem?.timestamp) {
  //         lastDate = new Date(historyItem.timestamp);
  //       } else if (dates[status]) {
  //         try {
  //           lastDate = new Date(dates[status]);
  //         } catch {
  //           lastDate = new Date();
  //         }
  //       }
  //     }
  //   });

  //   return dates;
  // };

  // const statusDates = getStatusDates();

  // Calculate progress percentage
  const calculateProgress = () => {
    if (['DELIVERED', 'CANCELED', 'RTO DELIVERED', 'RETURNED'].includes(currentStatus)) {
      return 100;
    } else if (statusFlows.problem.includes(currentStatus)) {
      return Math.min(90, (currentStatusIndex / activeFlow.length) * 100);
    }
    return currentStatusIndex >= 0
      ? Math.min(90, (currentStatusIndex / (activeFlow.length - 1)) * 100)
      : 0;
  };
  console.log("current", currentStatus)
  const progressPercentage = calculateProgress();

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      return toast.error('Please select a proper reason');
    }

    try {
      const data = await cancelOrder(orderData?._id,
        type, cancelReason, additionalComments);

      if (data?.error) {
        toast.error(data.message);
      } else {
        setCurrentOrderData((prev: any) => ({
          ...prev,
          status: 'CANCELED',
          cancelReason,
          additionalComments,
          updateHistory: [...(prev.updateHistory || []), new Date().toISOString()]
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

  const handleReturnOrder = async () => {
    if (!returnReason.trim()) {
      return toast.error('Please select a proper reason');
    }
    if (orderData.paymentMethod === 'offline') {
      const bankDetailsComplete = (
        bankDetails.accountName &&
        bankDetails.accountNumber &&
        bankDetails.bankName &&
        bankDetails.ifscCode &&
        bankDetails.accountType
      );
      if (!bankDetailsComplete) return toast.error('Complete the bank details')
    }
    try {
      const data = await returnOrder(
        orderData?._id,
        type,
        returnReason,
        additionalComments,
        bankDetails
      );

      if (data?.error) {
        toast.error(data.message);
      } else {
        setCurrentOrderData((prev: any) => ({
          ...prev,
          status: 'RETURN REQUESTED',
          returnRequestDate: new Date().toISOString(),
          returnReason: returnReason,
          additionalComments
        }));
        toast.success("Return request submitted successfully");
        setShowReturnModal(false);
        setReturnReason('');
        setAdditionalComments('');
      }
    } catch (error) {
      toast.error("Failed to initiate return");
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

  const returnReasons = [
    "product damaged, but shipping box ok",
    "both product and shipping box damaged",
    "wrong item was sent",
    "incorrect item delivered",
    "inaccurate website description",
    "product does not match description on website",
    "changed my mind",
    "other"
  ];

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
                  {/* <button className="download-invoice-btn">Download Invoice</button> */}
                  {currentStatus === 'DELIVERED' && (
                    <button
                      className="btn btn-warning"
                      onClick={() => setShowReturnModal(true)}
                    >
                      Return Order
                    </button>
                  )}
                  {!['CANCELED', 'DELIVERED', 'RTO DELIVERED', 'RETURNED', 'RETURN REQUESTED', 'RETURN APPROVED'].includes(currentStatus) && (
                    <>

                      <button
                        className="btn btn-danger"
                        onClick={() => setShowCancelModal(true)}
                      >
                        Cancel Order
                      </button>
                    </>
                  )}
                  {/* <button 
                          className="btn btn-warning" 
                          onClick={() => setShowReturnModal(true)}
                        >
                          Return Order
                        </button> */}
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
                  {type === "normal" ? `₹${orderData?.totalAmount}` :
                    type === "barter" ? orderData?.productDetails?.barterProductName :
                      `₹${orderData?.biddingAmount}`}
                </div>
              </div>

              <div className="delivery-tracker">
                <div className='delivery-tracker__head'>Delivery Details</div>

                <div className="order-tracker">
                  <ul className="order-status">
                    {activeFlow.map((status, index) => {
                      // const isCompleted = currentStatus === "DELIVERED";

                      const isCompleted = index <= currentStatusIndex;
                      const isCurrent = index === currentStatusIndex;
                      const isProblemStatus = statusFlows.problem.includes(status);
                      // const isFirstItem = index === 0;
                      const isLastItem = index === activeFlow.length - 1;

                      return (
                        <li
                          key={status}
                          className={`
                            ${isCompleted ? 'completed' : ''}
                            ${isCurrent ? 'current-status' : ''}
                            ${isProblemStatus ? 'problem-status' : ''}
                          `}
                        >
                          <span>{simplifiedStatusMap[status] || status}</span>
                          {(isCompleted && isLastItem) && (
                            <p>
                              {`On ${new Date(orderData.deliveredDate).toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}`}
                            </p>
                          )}
                          {isCurrent && (
                            statusIcons[status] || <FaTruckMoving className="truck-icon" />
                          )}
                        </li>
                      );
                    })}
                  </ul>

                  <div className="progress-line">
                    <div
                      className={`
                        progress 
                        ${currentStatus === 'CANCELED' ? 'cancelled-progress' : ''}
                        ${currentStatus === 'DELIVERED' ? 'delivered-progress' : ''}
                        ${statusFlows.problem.includes(currentStatus) ? 'problem-progress' : ''}
                        ${currentStatus === 'RTO DELIVERED' ? 'returned-progress' : ''}
                        ${currentStatus === 'RETURNED' ? 'returned-progress' : ''}
                      `}
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>

                {currentStatus === 'CANCELED' && (
                  <div className="cancel-status-message">
                    <p>Your order has been cancelled.</p>
                    {currentOrderData.cancelReason && (
                      <p><strong>Reason:</strong> {currentOrderData.cancelReason}</p>
                    )}
                    {currentOrderData.additionalComments && (
                      <p><strong>Comments:</strong> {currentOrderData.additionalComments}</p>
                    )}
                    <p>Cancellation date: {safeFormatDate(currentOrderData.updateHistory?.[currentOrderData.updateHistory.length - 1])}</p>
                  </div>
                )}

                {statusFlows.problem.includes(currentStatus) && (
                  <div className="problem-status-message">
                    <p>Your shipment encountered an issue: {simplifiedStatusMap[currentStatus]}</p>
                    <p>Please contact customer support for assistance.</p>
                  </div>
                )}

                {currentStatus === 'RETURN REQUESTED' && (
                  <div className="return-status-message">
                    <p>Your return request has been submitted and is pending approval.</p>
                    {currentOrderData.returnRequestDate && (
                      <p>Request date: {safeFormatDate(currentOrderData.returnRequestDate)}</p>
                    )}
                  </div>
                )}

                {currentStatus === 'RETURN APPROVED' && (
                  <div className="return-status-message">
                    <p>Your return has been approved. The pickup will be scheduled soon.</p>
                    {currentOrderData.returnPickupDate && (
                      <p>Expected pickup date: {safeFormatDate(currentOrderData.returnPickupDate)}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <StoreFooter />
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

      {/* Return Order Modal */}
      <Modal show={showReturnModal} onHide={() => setShowReturnModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Return Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Reason for return*</Form.Label>
              <Form.Select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                required
              >
                <option value="">Select a reason</option>
                {returnReasons.map((reason) => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Additional details</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={additionalComments}
                onChange={(e) => setAdditionalComments(e.target.value)}
                placeholder="Please provide any additional details about the issue..."
              />
            </Form.Group>

            {/* Bank Details Section (for COD returns) */}
            {orderData?.paymentMethod === "offline" && (
              <div className="bank-details-section">
                <h5>Refund Bank Details</h5>
                <p className="text-muted small">
                  Please provide your bank account details for refund processing.
                  We'll contact you at <span style={{ color: "blueviolet" }}>{orderData?.DeliveryAddress.email}</span> if there are any issues.
                </p>

                <Form.Group className="mb-3">
                  <Form.Label>Account Holder Name*</Form.Label>
                  <Form.Control
                    type="text"
                    name="accountName"
                    value={bankDetails.accountName}
                    onChange={handleBankDetailChange}
                    placeholder="Name as in bank account"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Account Number*</Form.Label>
                  <Form.Control
                    type="text"
                    name="accountNumber"
                    value={bankDetails.accountNumber}
                    onChange={handleBankDetailChange}
                    placeholder="Bank account number"
                    required
                  />

                </Form.Group>

                <div className="row">
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>Bank Name*</Form.Label>
                      <Form.Control
                        type="text"
                        name="bankName"
                        value={bankDetails.bankName}
                        onChange={handleBankDetailChange}
                        placeholder="Bank name"
                        required
                      />
                    </Form.Group>
                  </div>
                  <div className="col-md-6">
                    <Form.Group className="mb-3">
                      <Form.Label>IFSC Code*</Form.Label>
                      <Form.Control
                        type="text"
                        name="ifscCode"
                        value={bankDetails.ifscCode}
                        onChange={handleBankDetailChange}
                        placeholder="IFSC code"
                        required
                      />

                    </Form.Group>
                  </div>
                </div>

                <Form.Group className="mb-3">
                  <Form.Label>Account Type*</Form.Label>
                  <Form.Select
                    name="accountType"
                    value={bankDetails.accountType}
                    onChange={handleBankDetailChange}
                    required
                  >
                    <option value="">Select account type</option>
                    <option value="savings">Savings</option>
                    <option value="current">Current</option>
                  </Form.Select>
                </Form.Group>

                <div className="alert alert-info small">
                  <strong>Note:</strong>
                  <ul className="mb-0">
                    <li>Refund will be processed within 5-7 business days after we receive the returned item</li>
                    <li>Ensure all details are correct to avoid refund delays</li>
                    <li>For any issues, contact support@example.com</li>
                  </ul>
                </div>
              </div>
            )}

            <div className="return-policy-info mt-3">
              <h6>Return Policy:</h6>
              <ul>
                <li>Items must be returned within 7 days of delivery</li>
                <li>Products must be in original condition with all tags</li>
                <li>For prepaid orders, refund will be issued to original payment method</li>
                <li>For COD orders, refund will be processed via bank transfer</li>
                <li>Refund will be processed after we receive and inspect the item</li>
              </ul>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowReturnModal(false)}>
            Close
          </Button>
          <Button
            variant="warning"
            onClick={handleReturnOrder}
            disabled={!returnReason}
          >
            Submit Return Request
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OrderDetails;