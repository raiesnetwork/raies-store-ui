import React, { useEffect, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";
// import useMystoreStore from "../core/store/MyStoreStore";
import { toast } from "react-toastify";
import "./billing.scss";
import { Country, State, City } from "country-state-city";
import "react-international-phone/style.css"; // Correct phone input spacing issue
import Swal from "sweetalert2";
import {  plans } from "../../Utils/PricingPlan";
import { createRazorpayBusinessSubscribe, verifyRazorpayBusinessSubscribe } from "../Auth/Core/Api";
import { getSubdomain } from "../../Utils/Subdomain";

const { hostname } = window.location;
let subdomain = getSubdomain(hostname);

const Billing: React.FC = () => {
  const location = useLocation();
  const { mobileNumber,username,userType,paymentType,password } = location.state || {};
//   const selectedPlan=plans[3]
const selectedPlan=plans?.Businesses


  const initialFormData = {
    email: "",

    planDuration: "",
    address1: "",
    address2: "",
    city: "",
    pin: "",
    state: "",
    plan: selectedPlan[0],
    region: "IN",
  };
  const [formData, setFormData] = useState(initialFormData);

  const countries = Country.getAllCountries();
  const states = formData.region
    ? State.getStatesOfCountry(formData.region)
    : [];
  const citys = formData.state
    ? City.getCitiesOfState(formData.region, formData.state)
    : [];

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const [errors, setErrors] = useState<any>({});
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const validatePin = (pin: string) => {
    const pinRegex = /^[0-9]{6}$/; // Ensures exactly 6 digits
    return pinRegex.test(pin);
  };
  const handleValidation = () => {
    const newErrors: any = {};

    if (!formData.email || !validateEmail(formData.email))
      newErrors.email = "Invalid email address";
    if (!formData.planDuration)
      newErrors.planDuration = "Plan duration is required";
    if (!formData.address1) newErrors.address1 = "Billing address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.pin || !validatePin(formData.pin))
      newErrors.pin = "PIN must be exactly 6 digits";
    if (!formData.state) newErrors.state = "State is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [totalAmount, setTotalAmount] = useState(0);
  useEffect(() => {
    if ((selectedPlan[0]?.amount, formData?.planDuration)) {
      const total =
        Number(selectedPlan[0]?.amount) * Number(formData?.planDuration);
      setTotalAmount(total);
    }
  }, [selectedPlan, formData.planDuration]);
  console.log("plan", selectedPlan);
  // /////////////////////////////////////////////////////////////////////////////////



  const handlePayment = async () => {
    if (!handleValidation()) return;
   
    const amount = totalAmount;
    try {
      setLoading(true);

      const { order } = await createRazorpayBusinessSubscribe(amount,subdomain);
      
      console.log(order);

      const options = {
        key: import.meta.env.VITE_APP_RAZOR_PAY,
        amount: order.amount,
        currency: "INR",
        name: username,
        description: "Subscription",
        order_id: order.id,
        handler: async (response: any) => {
          try {
            
          const data=  await verifyRazorpayBusinessSubscribe(
              response,
              amount,
              formData.email,
              formData.planDuration,
              formData.address1,
              formData.address2,
              formData.city,
              formData.pin,
              formData.state,
              formData.plan,
              formData.region,
              mobileNumber,
              username,
              userType,
              paymentType,
              password,
              subdomain
            );
            if(data){
            Swal.fire({
              icon: "success",
              title: "Payment successful!",
              showConfirmButton: false,
              timer: 3500,
            });
          toast.success('Sign up Successfully')
          navigate('/login')
          }else{
              Swal.fire({
                icon: "error",
                title: "Payment verification failed",
                text: data.message,
              });
            }
            setLoading(false);
            // setRefresh(true);
          } catch (error: any) {
            // setLoading(false);
            Swal.fire({
              icon: "error",
              title: "Payment verification failed",
              text: error.message,
            });
          }
        },
        prefill: {
          name: username,
          email: formData.email,
          contact: "",
        },
        
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: () => {
            setLoading(false); // Optionally stop loading if the user dismisses the payment modal
          },
        },
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Payment failed:", error);
      Swal.fire({
        icon: "error",
        title: "Payment failed",
        text: "Please try again.",
      });
    }
  };

  return (
    <>
      <div className="billing-modal">
        <div className="IXES-billing-summary">
          <div className="billing-page-img-sec">
            <img
              src="/media/billingpahe.jpg"
              alt="Plan Image"
              className="billing-page-image"
            />
          </div>
          {selectedPlan ? (
            <>
              <h2>
                Subscribe to {selectedPlan[0].type} {selectedPlan[0].plan} Plan of
                ixes
              </h2>
              <p>{selectedPlan[0].description}</p>
              <div className="plan-info">
                <p>
                  <div className="IXESPlan-billing-amount">
                    {selectedPlan[0]?.price}
                  </div>
                </p>
                <ul className="IXESPlan-billing-includes">
                  {selectedPlan[0]?.type === "Premium" &&
                  selectedPlan[0]?.FreeIncludes ? (
                    <>
                      {selectedPlan[0]?.FreeIncludes?.map(
                        (feature: string, index: number) => (
                          <li key={`free-${index}`}>{feature}</li>
                        )
                      )}
                      {selectedPlan[0].includes
                        .filter(
                          (feature: string) =>
                            feature !== "All Free plan features"
                        )
                        .map((feature: string, index: number) => (
                          <li key={`premium-${index}`}>{feature}</li>
                        ))}
                    </>
                  ) : (
                    selectedPlan[0]?.includes?.map(
                      (feature: string, index: number) => (
                        <li key={index}>{feature}</li>
                      )
                    )
                  )}
                </ul>
              </div>
            </>
          ) : (
            <h2>No plan selected. Please select a plan before subscribing.</h2>
          )}
        </div>

        <div className="payment-info">
          <h3>Contact Information</h3>
          <div style={{ padding: "8px 0px" }}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          <h3>Plan Duration</h3>

          <select
            name="planDuration"
            className={`form-control ${
              errors.planDuration ? "is-invalid" : ""
            }`}
            value={formData.planDuration}
            onChange={handleSelectChange}
          >
            <option value="">Select Duration</option>
            <option value="1">1 Month</option>
            <option value="3">3 Months</option>
            <option value="6">6 Months</option>
            <option value="12">1 Year</option>
          </select>
          {errors.planDuration && (
            <div className="invalid-feedback">{errors.planDuration}</div>
          )}
          <div style={{ padding: "8px 0px" }}>
            <input
              type="text"
              readOnly
              placeholder="Total amount"
              className={`form-control`}
              value={`Total Amount: ₹${totalAmount}`}
            />
          </div>

          <div style={{ padding: "8px 0px" }} className="billing-address">
            <h3>billing-address</h3>
            <div style={{ padding: "8px 0px" }}>
              <label htmlFor="">Country</label>
              <select
                onChange={handleSelectChange}
                name="region"
                value={formData.region}
                className={`form-control ${errors.region ? "is-invalid" : ""}`}
              >
                <option value="">Select Country</option>

                {countries.map((country) => (
                  <option key={country.isoCode} value={country.isoCode}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ padding: "8px 0px" }}>
              <label htmlFor="">State</label>

              <select
                onChange={handleSelectChange}
                name="state"
                value={formData.state}
                className={`form-control ${errors.state ? "is-invalid" : ""}`}
              >
                <option value="">Select State</option>

                {states?.map((state) => (
                  <option key={state.isoCode} value={state.isoCode}>
                    {state.name}
                  </option>
                ))}
              </select>
              {errors.state && (
                <div className="invalid-feedback">{errors.state}</div>
              )}
            </div>
            <div style={{ padding: "8px 0px" }}>
              <label htmlFor="">City</label>

              <select
                onChange={handleSelectChange}
                name="city"
                value={formData.city}
                className={`form-control ${errors.city ? "is-invalid" : ""}`}
              >
                <option value="">Select City</option>

                {citys?.map((city) => (
                  <option key={city.stateCode} value={city.name}>
                    {city.name}
                  </option>
                ))}
              </select>
              {errors.city && (
                <div className="invalid-feedback">{errors.city}</div>
              )}
            </div>

            <div style={{ padding: "8px 0px" }}>
              <input
                type="text"
                name="address1"
                placeholder=" Address Line 1"
                className={`form-control ${
                  errors.address1 ? "is-invalid" : ""
                }`}
                value={formData.address1}
                onChange={handleChange}
              />
              {errors.address1 && (
                <div className="invalid-feedback">{errors.address1}</div>
              )}
            </div>
            <div style={{ padding: "8px 0px" }}>
              <input
                type="text"
                name="address2"
                placeholder="Address Line 2"
                value={formData.address2}
                onChange={handleChange}
                className="form-control"
              />
            </div>

            <div style={{ padding: "8px 0px" }}>
              <input
                type="number"
                name="pin"
                placeholder="PIN"
                className={`form-control ${errors.pin ? "is-invalid" : ""}`}
                value={formData.pin}
                onChange={handleChange}
                maxLength={6}
                max={6}
                min={6}
                minLength={6}
              />
              {errors.pin && (
                <div className="invalid-feedback">{errors.pin}</div>
              )}
            </div>
          </div>
          <div className="checkbox-section"></div>

          <button
            disabled={loading}
            className="btn btn-primary  w-100"
            onClick={handlePayment}
          >
            Subscribe
          </button>
        </div>
      </div>
    </>
  );
};

export default Billing;
