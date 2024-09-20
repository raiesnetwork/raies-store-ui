import React, { useState } from "react";
import "../Helpers/scss/ProductCard.scss";
import {ToastContainer, toast } from "react-toastify";
import useMystoreStore from "../Core/Store";
import { ProductViewCardProps, respProduct } from "../Core/Interfaces";
import { Link } from "react-router-dom";

const ProductViewCard: React.FC<ProductViewCardProps> = ({ data }) => {
  const {  logedIn,updateSingleProductData,AddToCart,FetchToCart  } =useMystoreStore((state) => state);
  const handleDetaildView = (data: respProduct) => {
 
    updateSingleProductData(data);
    
  };
  const [btnDisable,setDisable]=useState<boolean>(false)
  const handileCart=async(id:string,count:number,userId:string)=>{
    setDisable(true)
    if (logedIn===true) {
      
      const data=await AddToCart(id,count,userId)
      setDisable(false)
      if (data.error) {
      return  toast.error("item coun't add to cart")
      }else{
       await FetchToCart()
       return toast.success("Item added Successfully")
      }
    }else{
     return toast("You need to login first")

    }
  }
  return (
    <>

    <div className="product-card">
      <div className="product-card__image">
        <img src={data.mainImage} alt={data.productName} className="product-card_img" />
      </div>
      <div  onClick={()=>handleDetaildView(data)} className="product-card__info">
        <Link style={{textDecoration:"none",color:"black"}} to='/details'>
        <h4 className="product-card__brand">{data.brandName}</h4>
        <h3 className="product-card__name">{data.productName}</h3>
        <p className="product-card__price">
          {data.priceOption === "free" ? (
            "Free"
          ) : data.priceOption === "normal" ? (
            `${data.currency} ${data.price}`
          ) : data.priceOption === "barter" ? (
            `Exchange for a ${data.barterProductName}`
          ) : data.priceOption === "bidding" ? (
            <>
              {`Start: ${data.minBidPrice} ${data.minBidPrice}`}
              <br />
              <span>{`End date: ${data.endDate}`}</span>
            </>
          ) : (
            ""
          )}
        </p>

        {data.productCount < 5 && (
          <p className="product-card__limited-stock">
            Only <span style={{ color: "red" }}>
              {data.productCount} </span> item
            left
          </p>
        )}
        </Link>
      </div>
      {
       ( data.priceOption==="normal"|| data.priceOption==="free")&&data.productCount>0&&(

       
          <button 
          disabled={btnDisable}
          onClick={()=>handileCart(data.id,data.productCount,data.userId)} 
          className="product-card__add-to-cart">{
            btnDisable ?"Adding...":"Add to Cart"
        }</button>
        )}
    </div>
  <ToastContainer/>
  </>
  );
};

export default ProductViewCard;
