import React, { useEffect, useState } from "react";
import "../Helpers/scss/SinglePageView.scss";
import useMystoreStore from "../Core/Store";
import BarterModal from "./BarterModal";
import BiddingModal from "./BiddingModal";
import Header from "./Header";
import { toast } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import AddressModal from "./BuyAddressModal";
import AddressComponentModal from "./ShowAllAddressModal";
import { FaShoppingCart } from "react-icons/fa";
import { IoBag } from "react-icons/io5";
import { LiaExchangeAltSolid } from "react-icons/lia";
import StoreFooter from "../../Footer/Footer";
const SingleProductView: React.FC = () => {
  const {id}=useParams()
  
  const {
    addressSupparator,
    addressSupparatorBarter,
    setaddressSupparatorBarter,
    setAddressSuparator,
    isOpenselectAddressModal,
    OpenAddressModal,
    isOpenAddressModal,
    logedIn,
    FetchToCart,
    AddToCart,
    isOpenBarteModal,
    isOpenBiddingModal,
    setOpenBiddingModal,
    singleProductData,
    setOpenBarterModal,
    getSingleProduct
  } = useMystoreStore((s) => s);
  const [imageView, setImageView] = useState<string>(
    singleProductData.mainImage
  );
  useEffect(()=>{
    setImageView( singleProductData.mainImage)
  },[ singleProductData])
  useEffect(()=>{
     getSingleProduct(id);
  },[id])
  // eslint-disable-next-line no-unsafe-optional-chaining
  const [year, month, day] = singleProductData?.endDate.split("-");
  const lastDate = `${day}-${month}-${year}`;
  const [disable, setDisable] = useState<boolean>(false);

  const handileCart = async (id: string, count: number, userId: string) => {
    if (logedIn) {
      setDisable(true);
      const data = await AddToCart(id, count, userId);
      setDisable(false);
      if (data.error) {
        toast.error("Unable to add the item to your cart. Please try again.");
      } else {
        FetchToCart();
        toast.success("Item added to cart successfully!");
      }
    } else {
      return toast("Please log in to continue.");
    }
  };
  const handleBarterAddressModalClose = () => {
    OpenAddressModal();
    setOpenBarterModal();
  };
  const handleBidAddressModalClose = () => {
    OpenAddressModal();
    setOpenBiddingModal();
  };

  return (
    <>
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>

      <Header />
      <div style={{ flex: 1 }}>

      {singleProductData._id ? (
        <>
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
                      onClick={() =>
                        setImageView(singleProductData?.subImages[0])
                      }
                      src={singleProductData?.subImages[0]}
                      alt="sub1"
                      className="related-1"
                    />
                  )}
                  {singleProductData?.subImages[1] && (
                    <img
                      onClick={() =>
                        setImageView(singleProductData?.subImages[1])
                      }
                      src={singleProductData?.subImages[1]}
                      alt="sub2"
                      className="related-1"
                    />
                  )}
                  {singleProductData?.subImages[2] && (
                    <img
                      onClick={() =>
                        setImageView(singleProductData?.subImages[2])
                      }
                      src={singleProductData?.subImages[2]}
                      alt="sub3"
                      className="related-1"
                    />
                  )}
                </div>
              </div>
              <div className="single-product-right">
                {/* Normal type */}

                <div className="details-product-info-container">
                  <div className="product-details-info-sec">
                    <div className="product-name">
                      {singleProductData.productName}
                    </div>
                    {singleProductData.priceOption === "free" && (
                      <div className="product-type-info">Free</div>
                    )}

                    {singleProductData.priceOption === "normal" && (
                      <div className="product-details-page-price">
                        {singleProductData.currency +
                          " " +
                          singleProductData.price}
                      </div>
                    )}

                    {singleProductData.priceOption === "barter" && (
                      <div className="product-type-info-barter">
                        <LiaExchangeAltSolid /> Exchange With{" "}
                        {singleProductData.barterProductName}
                      </div>
                    )}
                    {singleProductData.priceOption === "bidding" && (
                      <div className="product-type-info-auction">Auction</div>
                    )}
                  </div>
                  <div className="single-product-brand">
                    {singleProductData.brandName}
                  </div>

                  {/* normal type */}

                  {/*free type */}

                  {/*bidding type */}
                  {singleProductData.priceOption === "bidding" && (
                    <div className="single-product-page-auction-details">
                      <div className="single-product-page-auction-bid">
                        Bid start @ {singleProductData.minBidPrice}
                      </div>
                      <div className="single-product-page-auction-clse">
                        Closing Date {lastDate}
                      </div>
                    </div>
                  )}
                  {/*barter type */}

                  <div className="product-description">
                    {singleProductData.description}
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Inventore provident, deleniti sunt, doloremque quo id
                    assumenda unde numquam cupiditate voluptates, aut minus non
                    quisquam eaque sequi debitis. Facilis eius debitis, quod,
                    ducimus fuga aliquid veniam consectetur quia sit dolore
                    recusandae molestias! Necessitatibus, at commodi! Quisquam
                    rerum odit voluptatum. Labore, officia.
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
                </div>
                <div className="purchase-btns">
                  {singleProductData.priceOption === "barter" && (
                    <>
                      <button
                        onClick={() => {
                          setOpenBarterModal();
                          setaddressSupparatorBarter(true);
                        }}
                      >
                        {" "}
                        <LiaExchangeAltSolid />
                        Exchange
                      </button>
                    </>
                  )}
                  {singleProductData.priceOption === "free" &&
                    singleProductData.productCount > 0 && (
                      <>
                        <button
                          disabled={disable}
                          onClick={() =>
                            handileCart(
                              singleProductData._id,
                              singleProductData.productCount,
                              singleProductData.user
                            )
                          }
                        >
                          <FaShoppingCart className="product-details-page-cart-icon" />
                          Add to cart
                        </button>
                        <Link
                          style={{ textDecoration: "none" }}
                          to="/buy"
                          state={{
                            details: [
                              {
                                id: singleProductData._id,
                                quantity: 1,
                                productDetails: singleProductData,
                              },
                            ],
                            type: "single",
                          }}
                        >
                          <button>
                            <IoBag className="product-details-page-cart-icon" />
                            Buy Now
                          </button>
                        </Link>
                      </>
                    )}
                  {singleProductData.priceOption === "normal" &&
                    singleProductData.productCount > 0 && (
                      <>
                        <button
                          disabled={disable}
                          onClick={() =>
                            handileCart(
                              singleProductData._id,
                              singleProductData.productCount,
                              singleProductData.user
                            )
                          }
                        >
                          <FaShoppingCart className="product-details-page-cart-icon" />
                          Add to cart
                        </button>
                        <Link
                          style={{ textDecoration: "none" }}
                          to="/buy"
                          state={{
                            details: [
                              {
                                id: "",
                                quantity: 1,
                                productDetails: singleProductData,
                              },
                            ],
                            type: "single",
                          }}
                        >
                          <button>
                            <IoBag className="product-details-page-cart-icon" />
                            Buy Now
                          </button>
                        </Link>
                      </>
                    )}
                  {singleProductData.priceOption === "bidding" && (
                    <>
                      <button
                        onClick={() => {
                          setOpenBiddingModal();
                          setAddressSuparator(true);
                        }}
                      >
                        Start Auction
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          {isOpenAddressModal && (
            <AddressModal
              closeModal={
                addressSupparatorBarter
                  ? handleBarterAddressModalClose
                  : addressSupparator
                  ? handleBidAddressModalClose
                  : () => {}
              }
            />
          )}
          {isOpenselectAddressModal && (
            <AddressComponentModal opencreateAddressModal={OpenAddressModal} />
          )}

          {isOpenBarteModal && <BarterModal />}
          {isOpenBiddingModal && <BiddingModal />}
        </>
      ) : (
        <>
          <div style={{ textAlign: "center" }}>
            Loading...
          </div>
        </>
      )}
      

      </div>
      <StoreFooter/>
      </div>
    </>
  );
};

export default SingleProductView;
