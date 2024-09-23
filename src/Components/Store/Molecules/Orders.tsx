import React, { useEffect, useState } from "react";
import "../Helpers/scss/Orders.scss";
import Header from "./Header";
import useMystoreStore from "../Core/Store";
import { toast, ToastContainer } from "react-toastify";
import { LineWave } from "react-loader-spinner";

interface resp {
  id: string;
  status: string;
  totalAmount: number;
  productDetails: details;
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
}

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
      const data = await getUserOrder();
      if (data.error) {
        toast.error("We can't fetch orders");
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

  const { orders: filteredOrderList, bidOrders: filteredBidOrders, barterOrders: filteredBarterOrders } = filteredOrders();

  return (
    <>
      <Header />
      <div className="user-orders-page">
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
          Your Orders
        </h1>
        <div className="filter-container" style={{ textAlign: "right", marginBottom: "20px" }}>
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
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <span className={`status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
                <p>
                  <strong>Total Amount:</strong> {order.totalAmount}
                </p>
                <div className="order-items">
                  <h3>Items:</h3>
                  {order?.productDetails?.map((item: details, index: number) => (
                    <div key={index} className="order-item">
                      <p>
                        <strong>{item.productName}</strong>
                      </p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: {item.price}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {filteredBidOrders.length > 0 &&
              filteredBidOrders.map((order: respBid) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <span className={`status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                  <p>
                    <strong>Bid Amount:</strong> {order.biddingAmount}
                  </p>
                  <div className="order-items">
                    <p>
                      <strong>{order.productDetails.productName}</strong>
                    </p>
                    <p>Quantity: {order.quantity}</p>
                  </div>
                </div>
              ))}

            {filteredBarterOrders.length > 0 &&
              filteredBarterOrders.map((order: respBarter) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <span className={`status ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </div>
                  <p>
                    <strong>Barter Image:</strong>{" "}
                    <img
                      style={{ width: "10%" }}
                      src={order.productImage}
                      alt={order.productDetails.productName}
                    />
                  </p>
                  <div className="order-items">
                    <p>
                      <strong>{order.productDetails.productName}</strong>
                    </p>
                    <p>Quantity: {order.quantity}</p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default UserOrdersPage;
