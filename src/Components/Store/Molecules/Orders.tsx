import React from "react";
import "../Helpers/scss/O.scss";

const orders = [
  {
    orderNumber: "123456789",
    date: "2024-09-10",
    totalAmount: "$299.99",
    status: "Shipped",
    items: [
      { productName: "Cool Gadget", quantity: 1, price: "$199.99" },
      { productName: "Smart Watch", quantity: 1, price: "$100.00" },
    ],
  },
  {
    orderNumber: "987654321",
    date: "2024-08-25",
    totalAmount: "$49.99",
    status: "Delivered",
    items: [
      { productName: "Wireless Mouse", quantity: 1, price: "$49.99" },
    ],
  },
];

const UserOrdersPage: React.FC = () => {
  return (
    <div className="user-orders-page">
      <h1>Your Orders</h1>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order.orderNumber} className="order-card">
            <div className="order-header">
              <h2>Order #{order.orderNumber}</h2>
              <span className={`status ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>
            <p><strong>Date:</strong> {order.date}</p>
            <p><strong>Total Amount:</strong> {order.totalAmount}</p>
            <div className="order-items">
              <h3>Items:</h3>
              {order.items.map((item, index) => (
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
    </div>
  );
};

export default UserOrdersPage;
