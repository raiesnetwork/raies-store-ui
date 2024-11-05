import React from 'react';
import CouponCard from './CouponCard';
import '../Helpers/scss/Coupon.scss';

const CouponCardList:React.FC<any> = ( {coupon} ) => {
    console.log(coupon);
    
  return (
    <div className="coupon-card-list">
      {coupon?.length>0?
      coupon?.map((coupon:any, index:number) => (
        <CouponCard key={index} coupon={coupon} />
      )):<div>Coupons Not available</div>}
    </div>
  );
};

export default CouponCardList;
