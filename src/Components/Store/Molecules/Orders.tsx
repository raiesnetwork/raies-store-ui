import React, { useEffect, useState } from "react";
import "../Helpers/scss/Orders.scss";
import Header from "./Header";
import useMystoreStore from "../Core/Store";
import { toast, ToastContainer } from "react-toastify";
import {LineWave,Circles} from "react-loader-spinner"; // Add a loader package

interface resp {
  id: string;
  status: string;
  totalAmount: number;
  productDetails: details;
}

interface details {
  map(arg0: (item: details, index: number) => import("react/jsx-runtime").JSX.Element): React.ReactNode;
  productName: string;
  quantity: number;
  price: number;
}

const UserOrdersPage: React.FC = () => {
  const { getUserOrder } = useMystoreStore((s) => s);
  const [orders, setOrders] = useState<resp[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loader state

  useEffect(() => {
    const apiHelper = async () => {
      setLoading(true); // Start loading
      const data = await getUserOrder();
      if (data.error) {
        toast.error("We can't fetch orders");
      } else {
        setOrders(data.data);
      }
      setLoading(false); // Stop loading
    };
    apiHelper();
  }, []);

  return (
    <>
      <Header />
      <div className="user-orders-page">
        <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Your Orders</h1> {/* Inline style for center heading */}
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px", // Adjust height as needed
            }}
          >
            <Circles  />
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order: resp) => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <span className={`status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>
                <p><strong>Total Amount:</strong> {order.totalAmount}</p>
                <div className="order-items">
                  <h3>Items:</h3>
                  {order?.productDetails?.map((item: details, index: number) => (
                    <div key={index} className="order-item">
                      <p><strong>{item.productName}</strong></p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: {item.price}</p>
                    </div>
                  ))}
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
