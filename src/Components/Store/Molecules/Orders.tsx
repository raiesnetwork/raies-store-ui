import React, { useEffect, useState } from "react";
import "../Helpers/scss/Orders.scss";
import Header from "./Header";
import useMystoreStore from "../Core/Store";
import { toast } from "react-toastify";
import { LineWave } from "react-loader-spinner";
import { getSubdomain } from "../../../Utils/Subdomain";
import { Link } from "react-router-dom";

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
      if (data.error) {
        toast.error("We can't fetch orders");
      } else {
        console.log(data?.data?.storeOrders);

        setOrders(data?.data?.storeOrders);
        setbiDOrders(data?.data?.biddingOrders);
        setBarterOrders(data.data?.barterOrders);
      }
      setLoading(false);
    };
    apiHelper();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const {
    orders: filteredOrderList,
    bidOrders: filteredBidOrders,
    barterOrders: filteredBarterOrders,
  } = filteredOrders();

  return (
    <>
      <Header />
      <div className="user-orders-page">
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          Your Orders
        </h1>
        <div
          className="filter-container"
          style={{ textAlign: "right", marginBottom: "20px" }}
        >
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="normal">Normal Orders</option>
            <option value="bid">Bid Orders</option>
            <option value="barter">Barter Orders</option>
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
            <LineWave />
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrderList.map((order: resp) => (
              <div
                key={order.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-evenly",
                  marginBottom: "20px",
                  padding: "70px",
                  boxShadow: `1px 1px 4px 1px  
                      ${
                        order.status === "pending"
                          ? "orange"
                          : order.status === "Delivered"
                          ? "lightgreen"
                          : order.status === "Shipped"
                          ? "yellow"
                          : "red"
                      }`,
                  cursor: "pointer",
                }}
              >
                {order?.productDetails?.map((item: details, index: number) => (
                  <Link style={{textDecoration:"none",color:"auto"}} key={index} to='/orderdetails' state={{orderData:order}}>
                  <div
                    
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 0",
                      borderBottom: "1px solid #ddd",
                    }}
                  >
                    {/* Product Image */}
                    <img
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                      }}
                      src={item.mainImage}
                      alt={item.productName}
                    />

                    {/* Product Info */}
                    <div
                      style={{
                        flex: "1",
                        marginLeft: "10px",
                      }}
                    >
                      <p>
                        <strong>{item.productName}</strong>
                      </p>
                      <p>Quantity: {item.quantity}</p>
                    </div>

                    <p
                      style={{
                        margin: "0 auto",
                        textAlign: "center",
                        flex: "1",
                      }}
                    >
                      Price: {item?.price ? item?.price : "Free"}
                    </p>
                  </div>
                  </Link>
                ))}

                <div
                  style={{
                    textAlign: "right",
                    marginTop: "10px",
                  }}
                >
                  <div
                    style={{ marginBottom: "10px" }}
                    className="order-header"
                  >
                    <span
                      style={{
                        backgroundColor:
                          order.status === "pending"
                            ? "orange"
                            : order.status === "Delivered"
                            ? "lightgreen"
                            : order.status === "Shipped"
                            ? "yellow"
                            : "red",
                      }}
                    >
                      Delivery Status: {order.status}
                    </span>
                  </div>
                  <div className="order-header">
                    <span
                      style={{
                        backgroundColor:
                          order.totalAmount === 0
                            ? "lightgreen"
                            : order.paymentMethod === "offline"
                            ? "lightgoldenrodyellow"
                            : "lightgreen",
                      }}
                    >
                      Payment Status:{" "}
                      {order.totalAmount === 0
                        ? "Free"
                        : order.paymentMethod === "offline"
                        ? "Pending"
                        : "Paid"}
                    </span>
                  </div>
                  <p>
                    <strong>Payment Method:</strong> {order.paymentMethod}
                  </p>
                  <p>
                    <strong>Total Amount:</strong> {order.totalAmount}
                  </p>
                </div>
              </div>
            ))}

            {filteredBidOrders.length > 0 &&
              filteredBidOrders.map((order: respBid) => (
                <Link style={{textDecoration:"none",color:"auto"}} key={order.id} to='/orderdetails' state={{orderData:order}}>

                <div
                  key={order.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 70px",
                    borderBottom: "1px solid #ddd",
                    backgroundColor: "white",
                    boxShadow: `1px 1px 4px 1px ${
                      order.status === "Accepted" ? "green" : "red"
                    }`,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "5px",
                    }}
                  >
                    <img
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                      }}
                      src={order.productDetails.mainImage}
                      alt={order.productDetails.productName}
                    />
                    <div>
                      <p>
                        <strong>{order.productDetails.productName}</strong>
                      </p>
                      <p>Quantity: {order.quantity}</p>
                    </div>
                  </div>
                  <div className="order-header">
                    <span className={`status ${order.status.toLowerCase()}`}>
                      {/* Order Status :{order.status} */}
                    </span>
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                    }}
                  >
                    <p style={{ backgroundColor: "orange" }}>
                      <strong>Delivery Status:</strong> Pending{" "}
                    </p>
                    <span
                      style={{
                        backgroundColor:
                          order.status === "Accepted" ? "lightgreen" : "red",
                      }}
                      className={`status ${order.status.toLowerCase()}`}
                    >
                      Order Status :{order.status}
                    </span>
                    <p>
                      <strong>Bid Amount:</strong> {order.biddingAmount}
                    </p>
                  </div>
                </div>
                </Link>
              ))}

            {filteredBarterOrders.length > 0 &&
              filteredBarterOrders.map((order: respBarter) => (
                <Link style={{textDecoration:"none",color:"auto"}} key={order.id} to='/orderdetails' state={{orderData:order}}>

                <div
                  key={order.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 70px",
                    borderBottom: "1px solid #ddd",
                    backgroundColor: "white",
                    boxShadow: `1px 1px 4px 1px ${
                      order.status === "Accepted" ? "green" : "red"
                    }`,
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "5px",
                    }}
                  >
                    <img
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                      }}
                      src={order.productDetails.mainImage}
                      alt={order.productDetails.productName}
                    />
                    <div>
                      <p>
                        <strong>{order.productDetails.productName}</strong>
                      </p>
                      <p>Quantity: {order.quantity}</p>
                    </div>
                  </div>

                  <div>
                    <p
                      style={{
                        backgroundColor:
                          order.status === "Accepted" ? "lightgreen" : "red",
                        textAlign: "right",
                      }}
                    >
                      <span
                        style={{ textAlign: "right" }}
                        className={`status ${order.status.toLowerCase()}`}
                      >
                        Delivery Status: {order.status}
                      </span>
                    </p>
                    <p style={{ textAlign: "right" }}>
                      <span
                        style={{
                          textAlign: "right",
                          backgroundColor:
                            order.status === "Accepted" ? "lightgreen" : "red",
                        }}
                        className={`status ${order.status.toLowerCase()}`}
                      >
                        Order Status: {order.status}
                      </span>
                    </p>
                    <p>
                      <strong>Barter Image:</strong>{" "}
                      <img
                        style={{
                          width: "70px",
                          height: "70px",
                          objectFit: "cover",
                        }}
                        src={order.productImage}
                        alt={order.productDetails.productName}
                      />
                    </p>
                  </div>
                </div>
                </Link>
              ))}
          </div>
        )}
      </div>

    </>
  );
};

export default UserOrdersPage;
