import React, { useState } from "react";
import useMystoreStore from "../core/store/MyStoreStore";
import { GiFastBackwardButton } from "react-icons/gi";
import "../Helpers/Scss/SingleProductView.scss";
import BarterModal from "./BarterModal";
import BiddingModal from "./BiddingModal";

const SingleProductView: React.FC = () => {
  const { setOpenBiddingModal,singleProductData, updateSingleProductData,setOpenBarterModal } = useMystoreStore(
    (s) => s
  );
  const [imageView, setImageView] = useState<string>(
    singleProductData.mainImage
  );
  const [year, month, day] = singleProductData?.endDate.split("-");
  const lastDate = `${day}-${month}-${year}`;
  return (
    <>
      <div
        style={{
          marginBottom: "20px",
          cursor: "pointer",
          display: "flex",
        }}
        onClick={() =>
          updateSingleProductData({ ...singleProductData, id: "" })
        }
      >
        <GiFastBackwardButton size={25} />
      </div>

      <div className="single-product-container">
        <div className="single-product-details">
          <div className="single-product-left">
            <div className="big-image">
              <img src={imageView} alt="fullsize" />
            </div>
            <div className="related-images">
              <img
                onClick={() => setImageView(singleProductData.mainImage)}
                src={singleProductData.mainImage}
                alt=""
                className="related-1"
              />
              {singleProductData?.subImages[0] && (
                <img
                  onClick={() => setImageView(singleProductData?.subImages[0])}
                  src={singleProductData?.subImages[0]}
                  alt="sub1"
                  className="related-1"
                />
              )}
              {singleProductData?.subImages[1] && (
                <img
                  onClick={() => setImageView(singleProductData?.subImages[1])}
                  src={singleProductData?.subImages[1]}
                  alt="sub2"
                  className="related-1"
                />
              )}
              {singleProductData?.subImages[2] && (
                <img
                  onClick={() => setImageView(singleProductData?.subImages[2])}
                  src={singleProductData?.subImages[2]}
                  alt="sub3"
                  className="related-1"
                />
              )}
            </div>
          </div>
          <div className="single-product-right">
            {/* Normal type */}

            <div className="details-product-normal">
              <div>{singleProductData.productName}</div>
              <div>{singleProductData.brandName}</div>
              {/* normal type */}
              {singleProductData.priceOption === "normal" && (
                <div>
                  {singleProductData.currency + " " + singleProductData.price}
                </div>
              )}
              {/*free type */}
              {singleProductData.priceOption === "free" && (
                <div
                  style={{
                    color: "green",
                  }}
                >
                  Free
                </div>
              )}
              {/*bidding type */}
              {singleProductData.priceOption === "bidding" && (
                <div>
                  <p>Start Price: {singleProductData.minBidPrice}</p>
                  <p>Max Price: {singleProductData.maxBidPrice}</p>
                  <p>Ending Date: {lastDate}</p>
                </div>
              )}
              {/*barter type */}
              {singleProductData.priceOption === "barter" && (
                <div
                  style={{
                    color: "green",
                    fontWeight: "bold",
                  }}
                >
                  Ready for exchange with{" "}
                  <samp
                    style={{
                      backgroundColor: "gray",
                      padding: "5px",
                      borderRadius: "60%",
                      color: "white",
                    }}
                  >
                    {" "}
                    {singleProductData.barterProductName}
                  </samp>
                </div>
              )}
              <div>
                {singleProductData.description}
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Inventore provident, deleniti sunt, doloremque quo id assumenda
                unde numquam cupiditate voluptates, aut minus non quisquam eaque
                sequi debitis. Facilis eius debitis, quod, ducimus fuga aliquid
                veniam consectetur quia sit dolore recusandae molestias!
                Necessitatibus, at commodi! Quisquam rerum odit voluptatum.
                Labore, officia.
              </div>
              {singleProductData.productCount < 5 && (
                <p className="product-card__limited-stock">
                  Only{" "}
                  <span style={{ color: "red" }}>
                    {singleProductData.productCount}{" "}
                  </span>{" "}
                  item left
                </p>
              )}

              <div className="purchase-btns">
                {singleProductData.priceOption === "barter" && (
                  <>
                    <button 
                    onClick={setOpenBarterModal}>Exchange</button>
                  </>
                )}
                {singleProductData.priceOption === "free" && (
                  <>
                    <button>Add to cart</button>
                    <button>Buy Now</button>
                  </>
                )}
                {singleProductData.priceOption === "normal" && (
                  <>
                    <button>Add to cart</button>
                    <button>Buy Now</button>
                  </>
                )}
                {singleProductData.priceOption === "bidding" && (
                  <>
                    <button 
                    onClick={setOpenBiddingModal}
                    >Start Auction</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="related-products">
          <div>Related Products</div>
        </div>
      </div>
      <BarterModal/>
      <BiddingModal/>
    </>
  );
};

export default SingleProductView;