import React from 'react';
import '../Helpers/scss/Coupon.scss';

const CouponCard:React.FC<any> = ({ coupon }) => {
  return (
    <div className="coupon-card" style={{
        position:"relative"
    }}>

        {
            new Date(coupon?.expiryDate).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)?""
        :<div style={{
            position:"absolute",
            color:"red",
            rotate:"40deg",
            right:"8px",
            top:"20px",
            fontStyle:"italic"
        }}>
Expired
        </div>
    }
      {coupon.image && <img src={coupon.image} alt={coupon.name} className="coupon-card__image" />}
      <div className="coupon-card__content">
        <h2 className="coupon-card__name">{coupon.name}</h2>
        <p className="coupon-card__description">{coupon.description}</p>
        <div className="coupon-card__code">
          <span>Code:</span> <strong style={{textDecoration:
            new Date(coupon?.expiryDate).setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)?"none"
            :"line-through"}}>{coupon.code}</strong>
          
        </div>
        <div className="coupon-card__details">
          <p>
            Discount: {coupon.discountType === 'fixed' ? `₹${coupon.discountValue}` : `${coupon.discountValue}%`}
          </p>
          <p>Min Purchase: ${coupon.minPurchaseAmount}</p>
          {/* <p>Usage Limit: {coupon.usageLimit}</p> */}
          {/* <p>Limit Per Customer: {coupon.limitPerCustomer}</p> */}
          <p>Valid from: {
          new Date(coupon.startDate).toLocaleDateString('en-gb',{
            day:"2-digit",
            month:"short",
            year:"numeric"
          })} 
          &nbsp;
            to {
            new Date(coupon.expiryDate).toLocaleDateString('en-gb',{
                day:"2-digit",
                month:"short",
                year:"numeric"
              })
            }</p>
        </div>
      </div>
    </div>
  );
};

export default CouponCard;
