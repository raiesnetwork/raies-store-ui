import React, { useEffect, useState } from "react";
import "../Helpers/scss/SinglePageView.scss";
import useMystoreStore from "../Core/Store";
import BarterModal from "./BarterModal";
import Header from "./Header";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import AddressModal from "./BuyAddressModal";
import AddressComponentModal from "./ShowAllAddressModal";
import { FaShoppingCart, FaMapMarkerAlt } from "react-icons/fa";
import { IoBag } from "react-icons/io5";
import { LiaExchangeAltSolid } from "react-icons/lia";
import StoreFooter from "../../Footer/Footer";
import { useAuth } from "../../Auth/AuthContext";
import Loader from "../../Loader/Loader";
import StockRequestModal from "./StockRequestModal";
import { getDeliveryCharge } from "../Core/StoreApi";

const SingleProductView: React.FC = () => {
  const { id } = useParams();
  const Navigate=useNavigate()
  const {
    addressSupparator,
    addressSupparatorBarter,
    isOpenselectAddressModal,
    OpenAddressModal,
    isOpenAddressModal,
    FetchToCart,
    AddToCart,
    isOpenBarteModal,
    isOpenBiddingModal,
    setOpenBiddingModal,
    singleProductData,
    setOpenBarterModal,
    getSingleProduct,
    profileData,
    getProfileInfo,
    shiprocketToken,
    getShprocketToken
  } = useMystoreStore((s) => s);

  const [imageView, setImageView] = useState<string>(singleProductData.mainImage);
  const [disable, setDisable] = useState<boolean>(false);
  const [pincode, setPincode] = useState<string>("");
  const [deliveryEstimate, setDeliveryEstimate] = useState<string>("");
  const [deliveryLoader, setDeliveryLoader] = useState<boolean>(false);
  const [deliveryDetails, setDeliveryDetails] = useState<{
    charge: number;
    days: string;
    courier: string;
  } | null>(null);
  const { isAuthenticated } = useAuth() || {};

  useEffect(() => {
    getProfileInfo();
    getShprocketToken();
  }, []);

  useEffect(() => {
    setImageView(singleProductData.mainImage);
  }, [singleProductData]);

  useEffect(() => {
    getSingleProduct(id);
  }, [id]);

  // eslint-disable-next-line no-unsafe-optional-chaining
  const [year, month, day] = singleProductData?.endDate?.split("-") || [];
  const lastDate = `${day}-${month}-${year}`;

  const handileCart = async (id: string, count: number, userId: string) => {
    if (isAuthenticated) {
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

  const checkDelivery = async () => {
    if (!isAuthenticated) {
      setDeliveryEstimate("Please log in to continue.");
      return 
    }
    if (pincode.length !== 6) {
      setDeliveryEstimate("Please enter a valid 6-digit pincode");
      setDeliveryDetails(null);
      return;
    }

    setDeliveryLoader(true);
    setDeliveryEstimate("Checking delivery options...");
    
    try {
      const payload = {
        pickup_postcode: singleProductData.pickupAddress?.Zip || "673504",
        delivery_postcode: pincode,
        cod: 1, // 1 for COD, 0 for prepaid
        weight: singleProductData.productWeight,
        length: singleProductData.packageLength,
        breadth: singleProductData.packageBreadth,
        height: singleProductData.packageHeight,
      };

      // Convert weight to kg if it's in grams
      if (singleProductData.productWeightType === 'g') {
        // @ts-ignore
        payload.weight = Number(singleProductData.productWeight) / 1000;
      }

      const data = await getDeliveryCharge(payload, shiprocketToken);
      
      if (data?.status === 404 || data?.error === true) {
        setDeliveryEstimate(data.message || "Delivery not available for this pincode");
        setDeliveryDetails(null);
        return;
      }

      const couriers = data.data.available_courier_companies;
      
      if (!couriers || couriers.length === 0) {
        setDeliveryEstimate("No delivery options available for this pincode");
        setDeliveryDetails(null);
        return;
      }

      // Find the best courier based on price and delivery time
      const bestCourier = couriers.reduce((best:any, current:any) => {
        if (current.recommendation_score > best.recommendation_score) {
          return current;
        }
        return best;
      }, couriers[0]);

      const freightCharge = parseFloat(bestCourier.freight_charge || 0);
      const codCharges = parseFloat(bestCourier.cod_charges || 0);
      const otherCharges = parseFloat(bestCourier.other_charges || 0);
      const totalDeliveryCharge = freightCharge + codCharges + otherCharges;

      setDeliveryDetails({
        charge: totalDeliveryCharge,
        days: bestCourier.etd || "3-7",
        courier: bestCourier.courier_name || "Standard Delivery"
      });

      setDeliveryEstimate("");

    } catch (error) {
      console.error("Error checking delivery:", error);
      setDeliveryEstimate("Error checking delivery options. Please try again.");
      setDeliveryDetails(null);
    } finally {
      setDeliveryLoader(false);
    }
  };
  return (
    <div className="single-product-page">
      <Header />
      
      <div className="product-content-wrapper">
        {singleProductData._id ? (
          <div className="product-container">
            {/* Product Images Section */}
            <div className="product-images-section">
              <div className="main-image-container">
                <img 
                  src={imageView} 
                  alt={singleProductData.productName} 
                  className="main-product-image"
                />
              </div>
              
              <div className="thumbnail-container">
                <div 
                  className={`thumbnail ${imageView === singleProductData.mainImage ? 'active' : ''}`}
                  onClick={() => setImageView(singleProductData.mainImage)}
                >
                  <img src={singleProductData.mainImage} alt="Main" />
                </div>
                
                {singleProductData?.subImages?.map((img, index) => (
                  <div 
                    key={index}
                    className={`thumbnail ${imageView === img ? 'active' : ''}`}
                    onClick={() => setImageView(img)}
                  >
                    <img src={img} alt={`Product view ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Product Details Section */}
            <div className="product-details-section">
              <h1 className="product-title">{singleProductData.productName}</h1>
              
              <div className="product-meta">
                <span className="brand">{singleProductData.brandName}</span>
                {singleProductData.productCount < 5 && (
                  <span className="stock-warning">
                    Only {singleProductData.productCount} left in stock
                  </span>
                )}
              </div>
              
              <div className="price-section">
                {singleProductData.priceOption === "free" && (
                  <div className="price-free">FREE</div>
                )}
                
                {singleProductData.priceOption === "normal" && (
                  <div className="price-normal">
                    {singleProductData.currency} {singleProductData.price}
                  </div>
                )}
                
                {singleProductData.priceOption === "barter" && (
                  <div className="price-barter">
                    <LiaExchangeAltSolid /> Exchange for: {singleProductData.barterProductName}
                  </div>
                )}
                
                {singleProductData.priceOption === "bidding" && (
                  <div className="price-bidding">
                    <div className="bid-info">
                      Starting bid: {singleProductData.currency} {singleProductData.minBidPrice}
                    </div>
                    <div className="bid-closing">
                      Auction ends: {lastDate}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="product-description">
                <h3>Description</h3>
                <p>{singleProductData.description}</p>
              </div>
              
              {/* Delivery Estimation */}
              <div className="delivery-estimation">
                <h3>Delivery Options</h3>
                <div className="pincode-checker">
                  <div className="input-group">
                    <FaMapMarkerAlt className="location-icon" />
                    <input
                      type="text"
                      placeholder="Enter pincode"
                      maxLength={6}
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    />
                    <button 
                      onClick={checkDelivery}
                      disabled={deliveryLoader || pincode.length !== 6}
                    >
                      {deliveryLoader ? "Checking..." : "Check"}
                    </button>
                  </div>
                  {deliveryEstimate && (
  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <div className="delivery-result">{deliveryEstimate}</div>
    {!isAuthenticated && (
      <div
        style={{
          cursor: "pointer",
          textDecoration: "underline",
          color: "blueviolet",
        }}
        onClick={() => Navigate("/login")}
      >
        Login
      </div>
    )}
  </div>
)}

                  {deliveryDetails && (
                    <div className="delivery-details">
                      <div className="delivery-row">
                        <span>Delivery Partner:</span>
                        <span>{deliveryDetails.courier}</span>
                      </div>
                      <div className="delivery-row">
                        <span>Estimated Delivery:</span>
                        <span>{deliveryDetails.days} business days</span>
                      </div>
                      <div className="delivery-row">
                        <span>Shipping Charge:</span>
                        <span>₹{deliveryDetails.charge.toFixed(2)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="action-buttons">
                {singleProductData.priceOption === "barter" &&
                 singleProductData.productCount > 0 && (
                  <Link
                    style={{ textDecoration: "none" }}
                    to="/buy"
                    state={{
                      details: [{
                        id: singleProductData._id,
                        quantity: 1,
                        productDetails: singleProductData,
                      }],
                      type: "single",
                      proType: 'barter'
                    }}
                  >
                    <button className="btn-exchange">
                      <LiaExchangeAltSolid />
                      Exchange Now
                    </button>
                  </Link>
                )}
                
                {(singleProductData.priceOption === "free" || 
                  singleProductData.priceOption === "normal") && 
                  singleProductData.productCount > 0 && (
                  <>
                    <button
                      className="btn-cart"
                      disabled={disable}
                      onClick={() =>
                        handileCart(
                          singleProductData._id,
                          singleProductData.productCount,
                          singleProductData.user
                        )
                      }
                    >
                      <FaShoppingCart />
                      Add to Cart
                    </button>
                    
                    <Link
                      style={{ textDecoration: "none" }}
                      to="/buy"
                      state={{
                        details: [{
                          id: singleProductData._id,
                          quantity: 1,
                          productDetails: singleProductData,
                        }],
                        type: "single",
                      }}
                    >
                      <button className="btn-buy">
                        <IoBag />
                        Buy Now
                      </button>
                    </Link>
                  </>
                )}
                
                {singleProductData.priceOption === "bidding" && 
                 singleProductData.productCount > 0 && (
                  <Link
                    style={{ textDecoration: "none" }}
                    to="/buy"
                    state={{
                      details: [{
                        id: singleProductData._id,
                        quantity: 1,
                        productDetails: singleProductData,
                      }],
                      type: "single",
                      proType: 'bid'
                    }}
                  >
                    <button className="btn-bid">
                      Place a Bid
                    </button>
                  </Link>
                )}
                
                {profileData?.dealerView && 
                 singleProductData.priceOption === "normal" && 
                 singleProductData.productCount > 0 && (
                  <button
                    className="btn-stock-request"
                    onClick={() => setOpenBiddingModal()}
                  >
                    Request for Stock
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <Loader />
        )}
      </div>
      
      {/* Modals */}
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
      
      {isOpenBarteModal && <BarterModal product={singleProductData} />}
      {isOpenBiddingModal && <StockRequestModal />}
      
      <StoreFooter />
    </div>
  );
};

export default SingleProductView;