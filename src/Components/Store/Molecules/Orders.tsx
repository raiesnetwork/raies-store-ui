import React, { useEffect, useState } from "react";
import "../Helpers/scss/Orders.scss";
import Header from "./Header";
import useMystoreStore from "../Core/Store";
import { toast } from "react-toastify";
import { getSubdomain } from "../../../Utils/Subdomain";
import { Link } from "react-router-dom";
import { MdVerified } from "react-icons/md";
import { CgDanger } from "react-icons/cg";
import { RxLapTimer } from "react-icons/rx";
import { BiSolidError } from "react-icons/bi";
import { FaTimesCircle } from "react-icons/fa";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import StoreFooter from "../../Footer/Footer";
import Loader from "../../Loader/Loader";

interface resp {
  id: string;
  status: string;
  totalAmount: number;
  productDetails: details;
  paymentMethod: string;
}
interface respBid {
  id: string;
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
}
interface respBarter {
  id: string;
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
}
interface details {
  map(
    arg0: (
      item: details,
      index: number
    ) => import("react/jsx-runtime").JSX.Element
  ): React.ReactNode;
  productName: string;
  quantity: number;
  price: number;
  mainImage?: string;
}
const { hostname } = window.location;
let subdomain = getSubdomain(hostname);
const UserOrdersPage: React.FC = () => {
  const { getUserOrder } = useMystoreStore((s) => s);
  const [orders, setOrders] = useState<resp[]>([]);
  const [bidOrders, setbiDOrders] = useState<respBid[]>([]);
  const [barterOrders, setBarterOrders] = useState<respBarter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    const apiHelper = async () => {
      setLoading(true); // Start loading
      const data = await getUserOrder(subdomain);
      console.log("data", data);
      if (data.error) {
        toast.error(
          "We're sorry, but we couldn't fetch your orders. Please check your connection and try again."
        );
      } else {
        setOrders(data?.data?.storeOrders);
        setbiDOrders(data?.data?.biddingOrders);
        setBarterOrders(data.data?.barterOrders);
      }
      setLoading(false);
    };
    apiHelper();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [currentSlideIndex, setCurrentSlideIndex] = useState<{
    [orderId: string]: number;
  }>({});

  const handlePrev = (orderId: string, maxIndex: number) => {
    setCurrentSlideIndex((prevState) => ({
      ...prevState,
      [orderId]: prevState[orderId] > 0 ? prevState[orderId] - 1 : maxIndex,
    }));
  };

  const handleNext = (orderId: string, maxIndex: number) => {
    setCurrentSlideIndex((prevState) => ({
      ...prevState,
      [orderId]: prevState[orderId] < maxIndex ? prevState[orderId] + 1 : 0,
    }));
  };

  const filteredOrders = () => {
    if (filter === "all") {
      return { orders, bidOrders, barterOrders };
    }
    if (filter === "bid") {
      return { orders: [], bidOrders, barterOrders: [] };
    }
    if (filter === "barter") {
      return { orders: [], bidOrders: [], barterOrders };
    }
    if (filter === "normal") {
      return { orders, bidOrders: [], barterOrders: [] };
    }
    return { orders: [], bidOrders: [], barterOrders: [] };
  };
console.log("payement",orders)
  const {
    orders: filteredOrderList,
    bidOrders: filteredBidOrders,
    barterOrders: filteredBarterOrders,
  } = filteredOrders();

  const noOrders =
    filteredOrderList?.length === 0 &&
    filteredBidOrders?.length === 0 &&
    filteredBarterOrders?.length === 0;
  return (
    <>
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Header />
        <div style={{ flex: 1 }}>
          <div className="myorder-page">
            <div className="myorder-page__header">
              <div className="myorder-page__heading">My Orders</div>
            </div>

            <div className="myorder-page__filter-container">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">ALL</option>
                <option value="normal">ORDER</option>
                <option value="bid">BID</option>
                <option value="barter">EXCHANGE</option>
              </select>
            </div>
            {loading ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "200px",
                }}
              >
                     <Loader/>

              </div>
            ) : noOrders ? (
              <div className="myorder-page__no-orders">
                <h2>No Orders Found</h2>
                <p>
                  You have not placed any orders yet. Start browsing our
                  products and place an order now!
                </p>
                <Link to="/" className="myorder-page__shop-link">
                  Go to Shop
                </Link>
              </div>
            ) : (
              <div className="orders-list">
                {filteredOrderList.map((order: any) => {
                  const currentIndex = currentSlideIndex[order._id] || 0;
                  const maxIndex = order.productDetails.length - 1;
                  const currentProduct = order.productDetails[currentIndex];

                  return (
                    <div
                      key={order.id}
                      className="myorder-page__card-container"
                    >
                      {/* Slider Section */}
                      <div className="myorder-page__card-name-sec">
                        <img
                          className="myorder-page__card-img"
                          src={currentProduct?.mainImage}
                          alt={currentProduct?.productName}
                        />
                        {order.productDetails.length > 1 && (
                          <div className="myorder-page__slider-btn-sec">
                            <button
                              className="myorder-page__slider-arrow"
                              onClick={() => handlePrev(order?._id, maxIndex)}
                            >
                              <FaChevronLeft />
                            </button>
                            <button
                              className="myorder-page__slider-arrow"
                              onClick={() => handleNext(order?._id, maxIndex)}
                            >
                              <FaChevronRight />
                            </button>
                          </div>
                        )}
                        <hr className="myorder-page__line" />
                        <div className="myorder-page__card-name-details">
                          <div className="myorder-page__card-name">
                            {currentProduct.productName}
                          </div>
                          <div className="myorder-page__order-methode">
                            {order.paymentMethod === "offline"
                              ? "Cash on Delivery"
                              : "Online"}
                          </div>
                        </div>
                      </div>

                      {/* Product Info */}

                      <Link
                        style={{ textDecoration: "none", color: "auto" }}
                        to="/orderdetails"
                        state={{ orderData: order, type: "normal" }}
                      >
                        {/* Order Details */}
                        <div className="myorder-page__order-details-sec">
                          <div className="myorder-page__order-amount-sec">
                          {order.paymentMethod === "offline" ? (
  <>
    {order.totalAmount === 0 ? (
      <div className="myorder-page__order-amount">₹80</div>
    ) : (
      <div className="myorder-page__order-amount">
        {`₹${order.totalAmount}`}
      </div>
    )}
    <div className="myorder-page__payment-status">
      Payment Due{" "}
      <CgDanger className="myorder-page__order-amount-warning" />
    </div>
  </>
) : order.paymentMethod === "credit" ? (
  <>
    <div className="myorder-page__order-amount">
      {`₹${order.totalAmount}`}
    </div>
    <div className="myorder-page__payment-status">
      Credit{" "}
      <CgDanger className="myorder-page__order-amount-credit" />
    </div>
  </>
) : (
  <>
    <div className="myorder-page__order-amount">
      {`₹${order.totalAmount}`}
    </div>
    <div className="myorder-page__payment-status">
      Paid{" "}
      <MdVerified className="myorder-page__order-amount-tick" />
    </div>
  </>
)}

                          </div>

                          <div className="myorder-page__delivery-status">
                            <div className="myorder-page__delivery-head">
                              Delivery
                            </div>
                            <div
                              className={
                                order.status === "Order Confirmed"
                                  ? "myorder-page__status-processed"
                                  : order.status === "shipped"
                                  ? "myorder-page__status-preparing"
                                  : order.status === "Shipped"
                                  ? "myorder-page__status-shipped"
                                  : order.status === "Delivered"
                                  ? "myorder-page__status-delivered"
                                  : "myorder-page__status-cancelled"
                              }
                            >
                              {order.status}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}

                {filteredBidOrders?.length > 0 &&
                  filteredBidOrders.map((order: respBid) => (
                    <div
                      key={order.id}
                      className="myorder-page__card-container"
                    >
                      <Link
                        style={{ textDecoration: "none", color: "auto" }}
                        to="/orderdetails"
                        state={{ orderData: order, type: "bid" }}
                      >
                        <div className="myorder-page__card-name-sec">
                          {/* Product Image */}
                          <img
                            className="myorder-page__card-img"
                            src={order.productDetails.mainImage}
                            alt={order.productDetails.productName}
                          />

                          {/* Product Info */}
                          <hr className="myorder-page__line" />
                          {/* Product Info */}
                          <div className="myorder-page__card-name-details">
                            <div className="myorder-page__card-name">
                              {order.productDetails.productName}
                            </div>
                            <div className="myorder-page__order-methode">
                              AUCTION
                            </div>
                          </div>
                        </div>
                      </Link>

                      <div className="myorder-page__order-details-sec">
                        {/* Conditionally render the bid amount */}

                        <div className="myorder-page__order-amount-sec">
                          <div className="myorder-page__bid-amount">
                            ₹{order.biddingAmount}{" "}
                          </div>
                          <div className="myorder-page__bid-verified">
                            {order.status === "Accepted" ? (
                              <>
                                {order.status}
                                <MdVerified className="myorder-page__order-amount-tick" />
                              </>
                            ) : order.status === "Rejected" ? (
                              <>
                                {order.status}
                                <FaTimesCircle className="myorder-page__order-amount-rejected" />
                              </>
                            ) : order.status === "Bid under review" ? (
                              <>
                                {order.status}
                                <RxLapTimer className="myorder-page__bid-review-icon" />
                              </>
                            ) : (
                              <>
                                {order.status}
                                <BiSolidError className="myorder-page__bid-review-icon" />
                              </>
                            )}
                          </div>
                        </div>
                        <div className="myorder-page__delivery-status">
                          <div className="myorder-page__delivery-head">
                            Delivery
                          </div>
                          <div
                            className={
                              order?.deliveryStatus === "Order Processed"
                                ? "myorder-page__status-processed"
                                : order?.deliveryStatus ===
                                  "Preparing for Shipment"
                                ? "myorder-page__status-preparing"
                                : order?.deliveryStatus === "Shipped"
                                ? "myorder-page__status-shipped"
                                : order?.deliveryStatus === "Out for Delivery"
                                ? "myorder-page__status-outfordelivery"
                                : order?.deliveryStatus === "Delivered"
                                ? "myorder-page__status-delivered"
                                : order?.deliveryStatus === "Order Canceled"
                                ? "myorder-page__status-canceled"
                                : "myorder-page__status-other"
                            }
                          >
                            {order?.deliveryStatus}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                {filteredBarterOrders.length > 0 &&
                  filteredBarterOrders.map((order: respBarter) => (
                    <Link
                      style={{ textDecoration: "none", color: "auto" }}
                      key={order.id}
                      to="/orderdetails"
                      state={{ orderData: order }}
                    >
                      <div
                        key={order.id}
                        className="myorder-page__card-container"
                      >
                        <Link
                          style={{ textDecoration: "none", color: "auto" }}
                          to="/orderdetails"
                          state={{ orderData: order, type: "barter" }}
                        >
                          <div className="myorder-page__card-name-sec">
                            {/* Product Image */}
                            <img
                              className="myorder-page__card-img"
                              src={order.productDetails.mainImage}
                              alt={order.productDetails.productName}
                            />

                            {/* Product Info */}
                            <hr className="myorder-page__line" />
                            {/* Product Info */}
                            <div className="myorder-page__card-name-details">
                              <div className="myorder-page__card-name">
                                {order.productDetails.productName}
                              </div>
                              <div className="myorder-page__order-methode">
                                EXCHANGE
                              </div>
                            </div>
                          </div>
                        </Link>

                        <div className="myorder-page__order-details-sec">
                          {/* Conditionally render the bid amount */}

                          <div className="myorder-page__order-amount-sec">
                            <div className="myorder-page__bid-amount">SHOE</div>
                            <div className="myorder-page__bid-verified">
                              {order.status === "Accepted" ? (
                                <>
                                  {order.status}
                                  <MdVerified className="myorder-page__order-amount-tick" />
                                </>
                              ) : order.status === "Rejected" ? (
                                <>
                                  {order.status}
                                  <FaTimesCircle className="myorder-page__order-amount-rejected" />
                                </>
                              ) : (
                                <>
                                  {order.status}
                                  <RxLapTimer className="myorder-page__bid-review-icon" />
                                </>
                              )}
                            </div>
                          </div>
                          <div className="myorder-page__delivery-status">
                            <div className="myorder-page__delivery-head">
                              Delivery
                            </div>
                            <div
                              className={
                                order?.deliveryStatus === "Order Processed"
                                  ? "myorder-page__status-processed"
                                  : order?.deliveryStatus ===
                                    "Preparing for Shipment"
                                  ? "myorder-page__status-preparing"
                                  : order?.deliveryStatus === "Shipped"
                                  ? "myorder-page__status-shipped"
                                  : order?.deliveryStatus === "Out for Delivery"
                                  ? "myorder-page__status-outfordelivery"
                                  : order?.deliveryStatus === "Delivered"
                                  ? "myorder-page__status-delivered"
                                  : order?.deliveryStatus === "Order Canceled"
                                  ? "myorder-page__status-canceled"
                                  : "myorder-page__status-other"
                              }
                            >
                              {order?.deliveryStatus}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </div>
        </div>
        <StoreFooter />
      </div>
    </>
  );
};

export default UserOrdersPage;
