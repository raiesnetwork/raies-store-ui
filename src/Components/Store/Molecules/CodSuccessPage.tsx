import React, { useEffect, useState } from "react";
import "../Helpers/scss/CodSuccsPage.scss";
import Header from "./Header";
import { Link, useLocation } from "react-router-dom";
import { respStoreCart } from "../Core/Interfaces";
import { FaShoppingCart } from "react-icons/fa";
import { GiShoppingBag } from "react-icons/gi";
import StoreFooter from "../../Footer/Footer";
const SuccessPage: React.FC = () => {
  const location = useLocation();
  const { orderDetails,orderId } = location.state || {};
  const [data, setData] = useState(orderDetails);
  useEffect(() => {
    if (orderDetails) {
      setData(orderDetails);
    }
  }, [orderDetails]);

  return (
    <>
     <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>

<Header />
<div style={{ flex: 1 }}>
      <div className="success-page">
        <div className="success-page-content">
          <h1>Thank You for Your Purchase!</h1>
          <p>
            Your order has been successfully placed. Below are the details of
            your order:
          </p>

          <div className="order-summary">
            <h2>Order Summary</h2>
            {data?.map((val: respStoreCart) => (
              <>
                <hr key={val._id} />

                <p>
                  <strong>Order Id:</strong> {orderId}
                </p>
                <p>
                  <strong>Product Name:</strong>{" "}
                  {val.productDetails.productName}
                </p>

                <p>
                  <strong>Quantity:</strong>
                  {val.quantity}
                </p>
                <p>
                  <strong>Price:</strong> {val.productDetails.price}
                </p>
                {/* <p><strong>Estimated Delivery Date:</strong> {}</p> */}
                {/* <p><strong>Tracking Number:</strong> {ingNumber}</p> */}
                <hr />
              </>
            ))}
          </div>

          <div className="actions">
            <Link to="/orders" className="button">
                <GiShoppingBag/>
              <div>
                View Orders</div>
            </Link>
            <Link to="/" className="button">
            <FaShoppingCart/>
            <div>Continue Shoping</div>
            </Link>
          </div>
        </div>
      </div>
      

      </div>
      <StoreFooter/>
      </div>
    </>
  );
};

export default SuccessPage;
