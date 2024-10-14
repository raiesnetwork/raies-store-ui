import React from "react";
import "../Helpers/scss/ProductCard.scss";
import { ProductViewCardProps } from "../Core/Interfaces";
import { Link } from "react-router-dom";
import { LiaExchangeAltSolid } from "react-icons/lia";

import { GiReceiveMoney } from "react-icons/gi";

const ProductViewCard: React.FC<ProductViewCardProps> = ({ data }) => {
  
  
  return (
    <>
      <div className="product-card" >
        <Link style={{ textDecoration: "none" }} to={`/details/${data?.id}`}>
          <div className="product-card__image-sec">
            <img
              src={data.mainImage}
              alt={data.productName}
              className="product-card_img"
            />
          </div>
          <div className="product-card__info">
            {/* <p className="product-card__brand">{data.brandName}</p> */}
            <div className="product-card__name">{data.productName}</div>
            <div className="prduct-card_swap-icon-sec">
              {data.priceOption === "barter" ? (
                <LiaExchangeAltSolid className="product-card_swap-icon" />
              ) : data.priceOption === "bidding" ? (
                <GiReceiveMoney className="product-card_swap-icon" />
              ) : (
                <></>
              )}
            </div>
            <div className="product-card__price">
              {data.priceOption === "free" ? (
                "Free"
              ) : data.priceOption === "normal" ? (
                `${data.price} ${data.currency} `
              ) : data.priceOption === "barter" ? (
                `${data.barterProductName}`
              ) : data.priceOption === "bidding" ? (
                <>
                  {`${data.minBidPrice}₹`}
                  <br />
                  {/* <span>{`End date: ${data.endDate}`}</span> */}
                </>
              ) : (
                ""
              )}
            </div>

            {/* {data.productCount < 5 && (
              <p className="product-card__limited-stock">
                Only <span style={{ color: "red" }}>{data.productCount} </span>{" "}
                item left
              </p>
            )} */}
          </div>
          {/* {
          (data.priceOption === "normal" || data.priceOption === "free") && data.productCount > 0 && (


            <button
              disabled={btnDisable}
              onClick={() => handileCart(data.id, data.productCount, data.userId)}
              className="product-card__add-to-cart">{
                btnDisable ? "Adding..." : "Add to Cart"
              }</button>
          )} */}
        </Link>
      </div>
    </>
  );
};

export default ProductViewCard;
