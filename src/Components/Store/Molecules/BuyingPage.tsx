/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import "../Helpers/scss/BuyPage.scss";
import Header from "./Header";
import { useLocation, useNavigate } from "react-router-dom";
import { respStoreCart } from "../Core/Interfaces";
import AddressModal from "./BuyAddressModal";
import { toast } from "react-toastify";
import useMystoreStore from "../Core/Store";
import AddressComponent from "./ShowAllAddressModal";
import StoreFooter from "../../Footer/Footer";
import { getDeliveryCharge } from "../Core/StoreApi";

const CheckoutPage: React.FC = () => {
  const {
    createRazorpayOrder,
    verifyRazorpayPayment,
    selectedAddress,
    addressData,
    getAddress,
    isOpenselectAddressModal,
    setIsOpenSelectAddressModal,
    createOrdr,
    FetchToCart,
    postCouponApi,
    shiprocketToken
  } = useMystoreStore((s) => s);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("online");
    const [deliveryDetails,setDeliveryDetails]=useState<any>()
  const location = useLocation();
  const { details } = location.state || {};
  const [btnDisable, setBtndesable] = useState<boolean>(false);
  // const [loading, setLoading] = useState<boolean>(false);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [couponAmount,setCouponAmount]=useState<{amount:number,type:string,couponId:string}>({amount:0,type:"",couponId:""})

  let totalPrice = details.reduce(
    (total: number, product: respStoreCart) =>
      total + Number(product.productDetails.price) * product.quantity,
    0
  );
const [totalAmount,setTotalAmount]=useState(0)
useEffect(()=>{
  setTotalAmount(totalPrice)
},[totalPrice])
  const [isOpenAddressModal, setAddressModal] = useState<boolean>(false);
  const OpenAddressModal = () => {
    setAddressModal(true);
  };
  const closeAddressModal = () => {
    setAddressModal(false);
  };
  useEffect(() => {
    const apiHelper = async () => {
      await getAddress();
    };
    apiHelper();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh]);
  const navigate = useNavigate();
  const handilPlaceOrder = async () => {
    if (selectedAddress._id.trim() && selectedPaymentMethod.trim()) {
      setBtndesable(true);
      const productDetais = details.map((val: respStoreCart) => {
        return {
          _id: val?.productDetails?._id,
          quantity: val?.quantity,
          productName: val?.productDetails?.productName,
          mainImage: val?.productDetails?.mainImage,
          cartId: val?._id,
          price: val?.productDetails?.price,
        };
      });

      const totalAmountWithDelivery = totalPrice + deliveryDetails;
      if (selectedPaymentMethod === "offline") {
        const data = await createOrdr({
          addressId: selectedAddress._id,
          paymentMethod: selectedPaymentMethod,
          productDetails: productDetais,
          totalAmount: totalAmount+deliveryDetails,
          couponData:couponAmount
        });
        setBtndesable(false);

        if (data.error) {
          setBtndesable(false);

          return toast.error(
            "We couldn't create your order. Please try again."
          );
        } else {
          setBtndesable(false);
          await FetchToCart();
          navigate("/success", { state: { orderDetails: details } });
        }
      } else {
        setBtndesable(false);

        try {
          // setLoading(true)

          const { order } = await createRazorpayOrder(totalAmountWithDelivery);

          const options = {
            key: import.meta.env.VITE_APP_RAZOR_PAY,
            amount: order.amount,
            currency: "INR",
            name: "STORE CART PURCHASE",
            description: "",
            order_id: order.id,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            handler: async (response: any) => {
              try {
                // eslint-disable-next-line prefer-const
                let data = {
                  response,
                  addressId: selectedAddress._id,
                  paymentMethod: selectedPaymentMethod,
                  productDetails: productDetais,
                  totalAmount: totalAmount+deliveryDetails,
                  couponData:couponAmount

                };
                await verifyRazorpayPayment(data);

                // setLoading(false);
                setRefresh(true);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } catch (error: any) {
                // setLoading(false);
                toast.error(
                  "Payment verification failed. Please check your payment details and try again."
                );
              }
            },
            profile: {
              name: "John Doe",
              email: "john.doe@example.com",
              contact: "9999999999",
            },
            theme: {
              color: "#3399cc",
            },
            modal: {
              ondismiss: () => {
                // setLoading(false);
                // Optionally stop loading if the user dismisses the payment modal
              },
            },
          };

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const rzp1 = new (window as any).Razorpay(options);
          rzp1.open();
        } catch (error) {
          console.error("Payment failed:", error);
          toast.error("Payment failed. Please try again.");
        }
        await FetchToCart();
        navigate("/success", { state: { orderDetails: details } });
      }
    } else {
      setBtndesable(false);

      toast.error(
        "Please make sure to select your delivery address and payment method."
      );
    }
  };
  const [couponCode,setCouponCode]=useState<string>("")
  const [couponCodeErr,setCouponCodeErr]=useState<string>("")
  const [CouponBtnDisable,setCouponBtnDesable]=useState<boolean>(false)

  const handileCoupon=async()=>{
if(couponCode.trim()){
  setCouponBtnDesable(true)
  const data=await postCouponApi(couponCode,details)
  setCouponBtnDesable(false)
  if(data.error){
    setCouponCodeErr(data?.message)
  }else{
    if(data?.data?.type==="fixed"){
      setCouponAmount({
        amount:data?.data?.amount,
        type:"fixed",
        couponId:data?.data?.couponId
      })
      totalPrice = Math.max(0, totalPrice - (data?.data?.amount || 0));
      setTotalAmount(totalPrice)
    }else if(data?.data?.type==="percentage"){
      totalPrice -= totalPrice*(data?.data?.amount / 100);
      setTotalAmount(totalPrice)
      setCouponAmount({
        amount:data?.data?.amount,
        type:"percentage",
        couponId:data?.data?.couponId

      })

    }
    setCouponCodeErr("")

    toast.success("Coupon Apply Successfully")
  }

}else{
  setCouponCodeErr("Enter a valid coupon code")
}
  }
const [expetedDeliveryData,setExpectedDeliveryDate]=useState<any>()
const getDeliveryCharges=async()=>{
  const payload = {
    pickup_postcode: details[0]?.productDetails?.pickupAddress?.Zip||'673504',
    delivery_postcode: selectedAddress.pincode,
    cod: selectedPaymentMethod==='offline'?1:0, // 1 for COD, 0 for prepaid
    weight: details[0]?.productDetails?.productWeight,
    length: details[0]?.productDetails?.packageLength,
    breadth: details[0]?.productDetails?.packageBreadth,
    height: details[0]?.productDetails?.packageHeight,
    width:details[0]?.productDetails?.packageWidth
  };
  try {
   
    
    const data=await getDeliveryCharge(payload,shiprocketToken)
    const couriers = data.data.available_courier_companies;
    const getBestCourier = (couriers: any[]) => {
      return couriers.reduce((best, current) => {
        if (
          (current.total_charge < best.total_charge && current.etd < best.etd) ||
          current.recommendation_score > best.recommendation_score
        ) {
          return current;
        }
        return best;
      }, couriers[0]);
    };
    const bestCourier = getBestCourier(couriers);
    const freightCharge = parseFloat(bestCourier.freight_charge || 0);
const codCharges = parseFloat(bestCourier.cod_charges || 0);
const otherCharges = parseFloat(bestCourier.other_charges || 0);
const totalDeliveryCharge = freightCharge + codCharges + otherCharges;
setExpectedDeliveryDate(bestCourier?.etd)
    setDeliveryDetails(totalDeliveryCharge);
    console.log("Selected Best Courier:", bestCourier);
} catch (error) {
    console.log(error,'delivery charges err');
    
  }

}

console.log(deliveryDetails);



  useEffect(()=>{

    if (details&&selectedAddress) {
      getDeliveryCharges()
      console.log('delivery useeffect');
      
    }

  },[details,selectedAddress,selectedPaymentMethod])











  return (
    <>
     <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>

<Header />
<div style={{ flex: 1 }}>
      <div className="checkout-page">
        {/* Delivery Address Section */}
        <div className="section address-section">
          <div className="section-header">1. Delivery Address</div>
          <div className="address-details">
            {selectedAddress._id && (
              <>
                <div className="checkout-page-address-details">
                  <p>
                    <span>{selectedAddress.fullName}</span>
                  </p>
                  <p>{selectedAddress.fullAddress}</p>
                  <p>
                    {selectedAddress.landmark},{selectedAddress.pincode}
                  </p>
                  <p>{selectedAddress.mobileNumber}</p>
                </div>
                <button onClick={() => setIsOpenSelectAddressModal()}>
                  Change
                </button>
              </>
            )}
            {!addressData?.length && !selectedAddress._id && (
              <button onClick={setIsOpenSelectAddressModal}>
                Add new Address
              </button>
            )}
            {addressData?.length && !selectedAddress._id && (
              <button onClick={setIsOpenSelectAddressModal}>
                Select Address
              </button>
            )}
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="section payment-section">
          <div className="section-header">2. Payment Method</div>
          <div className="payment-methods">
            <div>
              <label>
                <input
                  type="radio"
                  name="payment"
                  value="online"
                  checked={selectedPaymentMethod === "online"}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                />
                Online Payment
              </label>
              <label style={{ marginLeft: "20px" }}>
                <input
                  type="radio"
                  name="payment"
                  value="offline"
                  checked={selectedPaymentMethod === "offline"}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                />
                Pay on Delivery (Cash)
              </label>
            </div>
          </div>
        </div>

        {/* Product Review Section */}
        <div className="section product-review-section">
          <div className="section-header">3. Review Items and Delivery</div>
          <div className="product-list">
            <div
              style={{
                overflowY: "scroll",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
              }}
            >
              '
              {details?.length &&
                details?.map((product: respStoreCart) => (
                  <>
                    <hr key={product._id} />

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "15px",

                        width: "100%",
                      }}
                    >
                      <img
                        style={{
                          maxWidth: "100px",
                          marginRight: "20px",
                          marginBottom: "5px",
                        }}
                        src={product.productDetails.mainImage}
                        alt={product.productDetails.productName}
                      />
                      <div className="product-details">
                        <h4>{product.productDetails.productName}</h4>
                        <p>Price: ₹{product.productDetails.price}.00</p>
                        {/* <p>Delivery: {product.deliveryDate}</p> */}
                      </div>
                      <div className="quantity">
                        <p>Qty: {product.quantity}</p>
                      </div>
                    </div>
                    <hr />
                  </>
                ))}
            </div>
          </div>
        </div>

        {/* coupon section */}
        <div className="section order-summary">
        <div className="section-header">Apply Coupon</div>
       <div style={{
        display:"flex",
        alignItems:"center",
        justifyContent:"center",
        gap:"10px"

       }}>
       <input style={{
        width:"85%",
        height:"35px",
        borderRadius:"5px",
        outline:"none",
        border:"1px solid"

       }} 
       value={couponCode}
       placeholder="Enter coupon code"
       onChange={(e)=>setCouponCode(e.target.value)}
       />
       <button style={{
        width:"15%"
       }}
       onClick={handileCoupon}
       >
        {
          CouponBtnDisable?"Applying...":"Apply"
        }
        
       </button>
       
       </div>
<div style={{
  color:"red"
}}>{couponCodeErr}</div>
        </div>
        {/* Order Summary Section */}
        <div className="section order-summary">
          <>
            <div className="summary-row">
              <span>Expected delivery:</span>
              <span>{expetedDeliveryData}</span>
            </div><div className="summary-row">
              <span>Items:</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="summary-row">
              <span>Delivery:</span>
              <span>{deliveryDetails||0}</span>
            </div>
             <div className="summary-row">
              <span>Discount Coupon:</span>
              <span>{couponAmount.amount}</span>
            </div>
            <div className="summary-row">
              <span>Total:</span>
              <span className="total-price">₹{totalAmount + deliveryDetails}</span>
            </div>
          </>

          <button disabled={btnDisable} onClick={handilPlaceOrder}>
            {btnDisable ? "Loading..." : " Place Your Order"}
          </button>
        </div>
      </div>
      {isOpenAddressModal && <AddressModal closeModal={closeAddressModal} />}
      {isOpenselectAddressModal && (
        <AddressComponent opencreateAddressModal={OpenAddressModal} />
      )}
      

      </div>
      <StoreFooter/>
      </div>
    </>
  );
};

export default CheckoutPage;
