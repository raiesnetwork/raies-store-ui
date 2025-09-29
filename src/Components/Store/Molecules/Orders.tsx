import React, { useEffect, useState } from "react";
import "../Helpers/scss/Orders.scss";
import Header from "./Header";
import useMystoreStore from "../Core/Store";
import { toast } from "react-toastify";
import { getSubdomain } from "../../../Utils/Subdomain";
import { Link } from "react-router-dom";
import { MdVerified, MdOutlineLocalShipping } from "react-icons/md";
// import { CgDanger } from "react-icons/cg";
import { RxLapTimer } from "react-icons/rx";
import { BiSolidError } from "react-icons/bi";
import { FaTimesCircle, FaChevronRight } from "react-icons/fa";
import StoreFooter from "../../Footer/Footer";
import Loader from "../../Loader/Loader";
import { Tab, Tabs } from "react-bootstrap";
import Pagination from "./Pagination";

interface resp {
  _id: string;
  status: string;
  totalAmount: number;
  productDetails: details[];
  paymentMethod: string;
  createdAt: string;
  orderData?: {
    order_id: string;
  };
  expectedDeliveryDate: any;
  deliveredDate?: any;
  returnOrder?:boolean;
  returnDeliveredDate?:any;
  returnPickupScheduledDate?:any;
  returnShippedDate?:any;

}

interface details {
  productName: string;
  quantity: number;
  price: number;
  mainImage?: string;
}

interface respBid {
  _id: string;
  addressId: string;
  biddingAmount: string;
  userId: string;
  status: string;
  createdAt: string;
  quantity: number;
  productDetails: {
    productName: string;
    mainImage: string;
  };
  deliveryStatus: string;
  orderData?: {
    order_id: string;
  };
  expectedDeliveryDate: any

}

interface respBarter {
  _id: string;
  addressId: string;
  productImage: string;
  userId: string;
  status: string;
  createdAt: string;
  quantity: number;
  productDetails: {
    productName: string;
    mainImage: string;
  };
  deliveryStatus: string;
  orderData?: {
    order_id: string;
  };
  expectedDeliveryDate: any

}

interface PaginationData {
  currentPage: number;
  limit: number;
  totalStoreOrders: number;
  totalBiddingOrders: number;
  totalBarterOrders: number;
}

const { hostname } = window.location;
let subdomain = getSubdomain(hostname);

const UserOrdersPage: React.FC = () => {
  const { getUserOrder } = useMystoreStore((s) => s);
  const [orders, setOrders] = useState<resp[]>([]);
  const [bidOrders, setBidOrders] = useState<respBid[]>([]);
  const [barterOrders, setBarterOrders] = useState<respBarter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("normal");
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    limit: 10,
    totalStoreOrders: 0,
    totalBiddingOrders: 0,
    totalBarterOrders: 0
  });

  const fetchOrders = async (page: number = 1) => {
    setLoading(true);
    try {
      const data = await getUserOrder(subdomain, page);
      if (data.error) {
        toast.error(
          "We're sorry, but we couldn't fetch your orders. Please check your connection and try again."
        );
      } else {
        console.log(data?.data);

        setOrders(data?.data?.storeOrders || []);
        setBidOrders(data?.data?.biddingOrders || []);
        setBarterOrders(data.data?.barterOrders || []);
        setPagination(data?.data?.pagination || {
          currentPage: 1,
          limit: 10,
          totalStoreOrders: 0,
          totalBiddingOrders: 0,
          totalBarterOrders: 0
        });
      }
    } catch (error) {
      toast.error("Failed to fetch orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [getUserOrder]);

  const handlePageChange = (page: number) => {
    fetchOrders(page);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Order Confirmed":
      case "Order Processed":
      case "Accepted":
        return <MdVerified className="text-success" />;
      case "shipped":
      case "Shipped":
      case "Preparing for Shipment":
        return <MdOutlineLocalShipping className="text-info" />;
      case "Delivered":
        return <MdVerified className="text-success" />;
      case "Rejected":
      case "Order Canceled":
        return <FaTimesCircle className="text-danger" />;
      case "Bid under review":
        return <RxLapTimer className="text-warning" />;
      default:
        return <BiSolidError className="text-secondary" />;
    }
  };

  const getOrderStatusText = (status: string) => {
    switch (status) {
      case "Order Confirmed":
        return "Order Confirmed";
      case "shipped":
      case "Shipped":
        return "Shipped";
      case "Delivered":
        return "Delivered";
      case "Rejected":
        return "Cancelled";
      case "Bid under review":
        return "Under Review";
      default:
        return status;
    }
  };

  // const getDeliveryEstimate = (createdAt: string) => {
  //   const orderDate = new Date(createdAt);
  //   const deliveryDate = new Date(orderDate);
  //   // deliveryDate.setDate(deliveryDate.getDate() + 5); // Adding 5 days as estimated delivery

  //   return `Expected delivery by ${deliveryDate.toLocaleDateString('en-US', {
  //     weekday: 'short',
  //     month: 'short',
  //     day: 'numeric'
  //   })}`;
  // };

  // const getTotalItemsForActiveTab = () => {
  //   switch (activeTab) {
  //     case "normal":
  //       return pagination.totalStoreOrders;
  //     case "bid":
  //       return pagination.totalBiddingOrders;
  //     case "barter":
  //       return pagination.totalBarterOrders;
  //     default:
  //       return 0;
  //   }
  // };

  console.log("order", orders)
  return (
    <div className="user-orders-page" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div className="orders-container" style={{ flex: 1, padding: "20px 0" }}>
        <div className="container">
          <h1 className="mb-4">My Orders</h1>

          <Tabs
            activeKey={activeTab}
            onSelect={(k) => {
              setActiveTab(k || "normal");
              // Reset to first page when changing tabs
              handlePageChange(1);
            }}
            className="mb-4 orders-tabs"
            id="orders-tabs"
          >
            <Tab eventKey="normal" title={`Orders (${pagination.totalStoreOrders})`}>
              {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                  <Loader />
                </div>
              ) : orders.length > 0 ? (
                <>
                  <div className="orders-list">
                    {orders.map((order) => (
                      <div key={order._id} className="order-card mb-4">
                        <div className="order-header">
                          <div className="order-info">
                            <div className="order-id">
                              Order #{order?.orderData?.order_id || order._id.substring(0, 8)}
                            </div>
                            <div className="order-date">
                              Placed on {formatDate(order.createdAt)}
                            </div>
                            <div className="order-total">
                              ₹{order.totalAmount || "80"}
                            </div>
                          </div>
                          <div className="order-status">
                            <span className={`status-badge ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                              {getStatusIcon(order.status)}
                              {getOrderStatusText(order.status)}
                            </span>
                          </div>
                        </div>

                        <div className="order-products">
                          {order.productDetails.slice(0, 2).map((product, index) => (
                            <div key={index} className="product-item">
                              <img
                                src={product.mainImage || "https://via.placeholder.com/80"}
                                alt={product.productName}
                                className="product-image"
                              />
                              <div className="product-details">
                                <h4 className="product-name">{product.productName}</h4>
                                <div className="product-quantity">Qty: {product.quantity}</div>
                                <div className="product-price">₹{product.price}</div>
                              </div>
                            </div>
                          ))}
                          {order.productDetails.length > 2 && (
                            <div className="more-items">
                              +{order.productDetails.length - 2} more item(s)
                            </div>
                          )}
                        </div>

                        <div className="order-footer">
                          {/* <div className="delivery-info">
                            {order.status === "DELIVERED" ? (
                              <span>Delivered on {formatDate(order.deliveredDate)}</span>
                            ) : order.status === "CANCELED" ?
                              <span className={`status-badge ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                                {getStatusIcon(order.status)}
                                {getOrderStatusText(order.status)}
                              </span> : (
                                <span>Expected delivery by {formatDate(order.expectedDeliveryDate)}</span>
                              )}
                              
                          </div> */}

                          <div className="delivery-info">
                            {order.returnOrder ? (
                              // ---- Return Order Block ----
                              <div className="return-info">
                                <h5 className="return-label">🔄 Return Order</h5>
                                {order.returnDeliveredDate ? (
                                  <span>
                                    Returned on {formatDate(order.returnDeliveredDate)}
                                  </span>
                                ) : order.returnPickupScheduledDate ? (
                                  <span>
                                    Pickup scheduled for {formatDate(order.returnPickupScheduledDate)}
                                  </span>
                                )
                                  : order.returnShippedDate ? (
                                    <span>
                                      Return shipped on {formatDate(order.returnShippedDate)}
                                    </span>
                                  )
                                    : (
                                      <span>
                                        Return expected delivery by {formatDate(order.expectedDeliveryDate)}
                                      </span>
                                    )}
                              </div>
                            ) : (
                              // ---- Normal Order Block ----
                              <>
                                {order.status === "DELIVERED" ? (
                                  <span>
                                    Delivered on {formatDate(order.deliveredDate)}
                                  </span>
                                ) : order.status === "CANCELED" ? (
                                  <span
                                    className={`status-badge ${order.status
                                      .toLowerCase()
                                      .replace(/\s+/g, "-")}`}
                                  >
                                    {getStatusIcon(order.status)}
                                    {getOrderStatusText(order.status)}
                                  </span>
                                ) : (
                                  <span>
                                    Expected delivery by {formatDate(order.expectedDeliveryDate)}
                                  </span>
                                )}
                              </>
                            )}
                          </div>

                          <div className="order-actions">
                            <Link
                              to="/orderdetails"
                              state={{ orderData: order, type: "normal" }}
                              className="btn btn-outline-primary btn-sm"
                            >
                              View Details <FaChevronRight />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalItems={pagination.totalStoreOrders}
                    itemsPerPage={pagination.limit}
                    onPageChange={handlePageChange}
                  />
                </>
              ) : (
                <div className="no-orders text-center py-5">
                  <img
                    src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/emptyOrders_f13d28.png"
                    alt="No orders"
                    className="empty-order-image mb-4"
                    style={{ maxWidth: "200px" }}
                  />
                  <h3>You haven't placed any orders yet!</h3>
                  <p className="mb-4">Your orders will appear here</p>
                  <Link to="/" className="btn btn-primary">
                    Continue Shopping
                  </Link>
                </div>
              )}
            </Tab>

            <Tab eventKey="bid" title={`Bids (${pagination.totalBiddingOrders})`}>
              {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                  <Loader />
                </div>
              ) : bidOrders.length > 0 ? (
                <>
                  <div className="orders-list">
                    {bidOrders.map((order) => (
                      <div key={order._id} className="order-card mb-4">
                        <div className="order-header">
                          <div className="order-info">
                            <div className="order-id">
                              Bid #{order?.orderData?.order_id || order._id.substring(0, 8)}
                            </div>
                            <div className="order-date">
                              Placed on {formatDate(order.createdAt)}
                            </div>
                            <div className="order-total">
                              ₹{order.biddingAmount}
                            </div>
                          </div>
                          <div className="order-status">
                            <span className={`status-badge ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                              {getStatusIcon(order.status)}
                              {getOrderStatusText(order.status)}
                            </span>
                          </div>
                        </div>

                        <div className="order-products">
                          <div className="product-item">
                            <img
                              src={order.productDetails.mainImage || "https://via.placeholder.com/80"}
                              alt={order.productDetails.productName}
                              className="product-image"
                            />
                            <div className="product-details">
                              <h4 className="product-name">{order.productDetails.productName}</h4>
                              <div className="product-quantity">Qty: {order.quantity}</div>
                              <div className="product-price">Bid Amount: ₹{order.biddingAmount}</div>
                            </div>
                          </div>
                        </div>

                        <div className="order-footer">
                          <div className="delivery-info">
                            {order.deliveryStatus === "Delivered" ? (
                              <span>Delivered on {formatDate(order.createdAt)}</span>
                            ) : order.deliveryStatus ? (
                              <span>Status: {order.deliveryStatus}</span>
                            ) : (
                              <span>Bid status: {order.status}</span>
                            )}
                          </div>
                          <div className="order-actions">
                            <Link
                              to="/orderdetails"
                              state={{ orderData: order, type: "bid" }}
                              className="btn btn-outline-primary btn-sm"
                            >
                              View Details <FaChevronRight />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalItems={pagination.totalBiddingOrders}
                    itemsPerPage={pagination.limit}
                    onPageChange={handlePageChange}
                  />
                </>
              ) : (
                <div className="no-orders text-center py-5">
                  <img
                    src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/emptyOrders_f13d28.png"
                    alt="No bids"
                    className="empty-order-image mb-4"
                    style={{ maxWidth: "200px" }}
                  />
                  <h3>You haven't placed any bids yet!</h3>
                  <p className="mb-4">Your bidding history will appear here</p>
                  <Link to="/auctions" className="btn btn-primary">
                    View Auctions
                  </Link>
                </div>
              )}
            </Tab>

            <Tab eventKey="barter" title={`Exchanges (${pagination.totalBarterOrders})`}>
              {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: "200px" }}>
                  <Loader />
                </div>
              ) : barterOrders.length > 0 ? (
                <>
                  <div className="orders-list">
                    {barterOrders.map((order) => (
                      <div key={order._id} className="order-card mb-4">
                        <div className="order-header">
                          <div className="order-info">
                            <div className="order-id">
                              Exchange #{order?.orderData?.order_id || order._id.substring(0, 8)}
                            </div>
                            <div className="order-date">
                              Placed on {formatDate(order.createdAt)}
                            </div>
                          </div>
                          <div className="order-status">
                            <span className={`status-badge ${order.status.toLowerCase().replace(/\s+/g, '-')}`}>
                              {getStatusIcon(order.status)}
                              {getOrderStatusText(order.status)}
                            </span>
                          </div>
                        </div>

                        <div className="order-products">
                          <div className="product-item">
                            <img
                              src={order.productDetails.mainImage || "https://via.placeholder.com/80"}
                              alt={order.productDetails.productName}
                              className="product-image"
                            />
                            <div className="product-details">
                              <h4 className="product-name">{order.productDetails.productName}</h4>
                              <div className="product-quantity">Qty: {order.quantity}</div>
                              <div className="product-price">Exchange</div>
                            </div>
                          </div>
                        </div>

                        <div className="order-footer">
                          <div className="delivery-info">
                            {order.deliveryStatus === "Delivered" ? (
                              <span>Delivered on {formatDate(order.createdAt)}</span>
                            ) : order.deliveryStatus ? (
                              <span>Status: {order.deliveryStatus}</span>
                            ) : (
                              <span>Exchange status: {order.status}</span>
                            )}
                          </div>
                          <div className="order-actions">
                            <Link
                              to="/orderdetails"
                              state={{ orderData: order, type: "barter" }}
                              className="btn btn-outline-primary btn-sm"
                            >
                              View Details <FaChevronRight />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalItems={pagination.totalBarterOrders}
                    itemsPerPage={pagination.limit}
                    onPageChange={handlePageChange}
                  />
                </>
              ) : (
                <div className="no-orders text-center py-5">
                  <img
                    src="https://static-assets-web.flixcart.com/www/linchpin/fk-cp-zion/img/emptyOrders_f13d28.png"
                    alt="No exchanges"
                    className="empty-order-image mb-4"
                    style={{ maxWidth: "200px" }}
                  />
                  <h3>You haven't made any exchanges yet!</h3>
                  <p className="mb-4">Your exchange requests will appear here</p>
                  <Link to="/barter" className="btn btn-primary">
                    View Exchange Options
                  </Link>
                </div>
              )}
            </Tab>
          </Tabs>
        </div>
      </div>
      <StoreFooter />

      <style>{`
        .user-orders-page {
          background-color: #f7f7f7;
        }
        
        .orders-container {
          background-color: white;
          margin-top: 20px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .order-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          padding: 16px;
          background-color: white;
        }
        
        .order-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 12px;
          border-bottom: 1px solid #f0f0f0;
          margin-bottom: 12px;
        }
        
        .order-info {
          flex: 1;
        }
        
        .order-id {
          font-weight: 500;
          color: #212121;
        }
        
        .order-date {
          font-size: 14px;
          color: #878787;
        }
        
        .order-total {
          font-weight: 500;
          margin-top: 4px;
        }
        
        .order-status {
          margin-left: 16px;
        }
        
        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 14px;
          gap: 4px;
        }
        
        .status-badge.order-confirmed,
        .status-badge.order-processed,
        .status-badge.accepted {
          background-color: #e3f2fd;
          color: #1976d2;
        }
        
        .status-badge.shipped,
        .status-badge.preparing-for-shipment {
          background-color: #e0f7fa;
          color: #00acc1;
        }
        
        .status-badge.delivered {
          background-color: #e8f5e9;
          color: #388e3c;
        }
        
        .status-badge.rejected,
        .status-badge.order-canceled {
          background-color: #ffebee;
          color: #d32f2f;
        }
        
        .status-badge.bid-under-review {
          background-color: #fff8e1;
          color: #ffa000;
        }
        
        .order-products {
          margin-bottom: 12px;
        }
        
        .product-item {
          display: flex;
          gap: 16px;
          padding: 12px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .product-item:last-child {
          border-bottom: none;
        }
        
        .product-image {
          width: 80px;
          height: 80px;
          object-fit: contain;
        }
        
        .product-details {
          flex: 1;
        }
        
        .product-name {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 4px;
          color: #212121;
        }
        
        .product-quantity {
          font-size: 14px;
          color: #878787;
        }
        
        .product-price {
          font-weight: 500;
          margin-top: 4px;
        }
        
        .more-items {
          font-size: 14px;
          color: #2874f0;
          padding: 8px 0;
          cursor: pointer;
        }
        
        .order-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 12px;
          border-top: 1px solid #f0f0f0;
        }
        
        .delivery-info {
          font-size: 14px;
          color: #878787;
        }
        
        .order-actions .btn {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        
        .no-orders {
          background-color: white;
          padding: 40px;
          border-radius: 8px;
        }
        
        .empty-order-image {
          opacity: 0.8;
        }
        
        @media (max-width: 768px) {
          .order-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          
          .order-status {
            margin-left: 0;
            align-self: flex-start;
          }
          
          .order-footer {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }
        }
      `}</style>
    </div>
  );
};

export default UserOrdersPage;