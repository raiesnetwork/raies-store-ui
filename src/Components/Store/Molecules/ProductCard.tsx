import React from "react";
import "../Helpers/scss/ProductCard.scss";
import { ProductViewCardProps } from "../Core/Interfaces";
import { Link } from "react-router-dom";
import { LiaExchangeAltSolid } from "react-icons/lia";
import { GiReceiveMoney } from "react-icons/gi";

const ProductViewCard: React.FC<ProductViewCardProps> = ({ data }) => {
  // Function to truncate long product names
  const truncateName = (name: string, maxLength: number = 20) => {
    return name.length > maxLength ? `${name.substring(0, maxLength)}...` : name;
  };

  return (
    <div className="product-card">
      <Link style={{ textDecoration: "none" }} to={`/details/${data?._id}`}>
        <div className="product-card__image-sec">
          <img
            src={data.mainImage}
            alt={data.productName}
            className="product-card__img"
            loading="lazy"
          />
          {/* Badge for product type */}
          <div className="product-card__badge">
            {data.priceOption === "barter" ? (
              <span className="product-card__badge--barter">
                <LiaExchangeAltSolid className="product-card__badge-icon" /> Barter
              </span>
            ) : data.priceOption === "bidding" ? (
              <span className="product-card__badge--bidding">
                <GiReceiveMoney className="product-card__badge-icon" /> Bid
              </span>
            ) : data.priceOption === "free" ? (
              <span className="product-card__badge--free">Free</span>
            ) : null}
          </div>
        </div>
        
        <div className="product-card__info">
          <h3 className="product-card__name" title={data.productName}>
            {data.productName}
            {/* {truncateName(data.productName)} */}
          </h3>
          
          <div className="product-card__price">
            {data.priceOption === "free" ? (
              <span className="product-card__price--free">Free</span>
            ) : data.priceOption === "normal" ? (
              <span className="product-card__price--normal">
                {data.price} {data.currency}
              </span>
            ) : data.priceOption === "barter" ? (
              <span className="product-card__price--barter" title={data.barterProductName}>
                For: {truncateName(data.barterProductName, 15)}
              </span>
            ) : data.priceOption === "bidding" ? (
              <span className="product-card__price--bidding">
                Start: {data.minBidPrice}₹
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductViewCard;