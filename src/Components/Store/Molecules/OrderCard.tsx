import React from 'react';
import '../Helpers/scss/OrderCard.scss';

interface Details {
  productName: string;
  quantity: number;
  price: number;
  productImage?: string;
}

export interface Resp {
  id: string;
  status: string;
  totalAmount: number;
  productDetails: Details[];
}

interface OrderCardProps {
  order: Resp;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  return (
    <div className="order-card">
      <h3 className="order-card__header">Order ID: {order.id}</h3>
      <p className="order-card__status">Status: {order.status}</p>
      <div className="order-card__items">
        {order.productDetails.map((item, index) => (
          <div key={index} className="order-card__item">
            <div className="order-card__item__image">
              {item.productImage ? (
                <img src={item.productImage} alt={item.productName} />
              ) : (
                <div className="order-card__item__no-image">No Image</div>
              )}
            </div>
            <div className="order-card__item__details">
              <h4 className="order-card__item__title">{item.productName}</h4>
              <p className="order-card__item__quantity">Quantity: {item.quantity}</p>
              <p className="order-card__item__price">Price: ₹{item.price}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="order-card__total">
        <strong>Total Amount: ₹{order.totalAmount}</strong>
      </div>
    </div>
  );
};

export default OrderCard;
