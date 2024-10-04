import React from "react";
import "../Helpers/scss/ProductCard.scss";
import useMystoreStore from "../Core/Store";
import { ProductViewCardProps, respProduct } from "../Core/Interfaces";
import { Link } from "react-router-dom";
import { LiaExchangeAltSolid } from "react-icons/lia";
// import { RiAuctionLine } from "react-icons/ri";
// import { TbMoneybag } from "react-icons/tb";
import { GiReceiveMoney } from "react-icons/gi";

const ProductViewCard: React.FC<ProductViewCardProps> = ({ data }) => {
  const { updateSingleProductData } = useMystoreStore((state) => state);
  const handleDetaildView = (data: respProduct) => {
    updateSingleProductData(data);
  };
  // const [btnDisable, setDisable] = useState<boolean>(false)
  // const handileCart = async (id: string, count: number, userId: string) => {
  //   if (logedIn === true) {
  //     setDisable(true)

  //     const data = await AddToCart(id, count, userId)
  //     setDisable(false)
  //     if (data.error) {
  //       return toast.error("item coun't add to cart")
  //     } else {
  //       FetchToCart()
  //       return toast.success("Item added Successfully")
  //     }
  //   } else {
  //     return toast("You need to login first")

  //   }
  // }
  return (
    <>
      <div className="product-card" onClick={() => handleDetaildView(data)}>
        <Link style={{ textDecoration: "none" }} to="/details">
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

            {data.productCount < 5 && (
              <p className="product-card__limited-stock">
                Only <span style={{ color: "red" }}>{data.productCount} </span>{" "}
                item left
              </p>
            )}
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
