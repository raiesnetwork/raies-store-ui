import React, { useEffect, useState } from "react";
import "../Helpers/scss/Orders.scss";
import Header from "./Header";
import useMystoreStore from "../Core/Store";
import { toast ,ToastContainer} from "react-toastify";

interface resp{
  id:string
  status:string
  totalAmount:number
  productDetails:details
}
interface details{
    map(arg0: (item: details, index: number) => import("react/jsx-runtime").JSX.Element): React.ReactNode;
  
    productName:string
    quantity:number
    price:number
  
}
const UserOrdersPage: React.FC = () => {
const {getUserOrder}=useMystoreStore((s)=>s)
const [orders,setOrders]=useState([])
  useEffect(()=>{
    const apiHelper=async()=>{
      const data=await getUserOrder()  
        if (data.error) {
          toast.error("we cant fetch orders")
        }else{
          setOrders(data.data)

        }
    }
    apiHelper()  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  console.log(orders);
  
  return (
    <>
    <Header/>
    <div className="user-orders-page">
      <h1>Your Orders</h1>
      <div className="orders-list">
        {orders?.map((order:resp) => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              {/* <h2>Order #{order.orderNumber}</h2> */}
              <span className={`status ${order.status.toLowerCase()}`}>
                {order.status}
              </span>
            </div>
            {/* <p><strong>Date:</strong> {order.date}</p> */}
            <p><strong>Total Amount:</strong> {order.totalAmount}</p>
            <div className="order-items">
              <h3>Items:</h3>
              {order?.productDetails?.map((item:details, index:number) => (
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
    <ToastContainer/>
    </>
  );
};

export default UserOrdersPage;
