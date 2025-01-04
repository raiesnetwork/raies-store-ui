import React from "react";
import "../Helpers/scss/planandbills.css";
import { GiQueenCrown } from "react-icons/gi";
import { BsFillPatchCheckFill } from "react-icons/bs"

const PlansAndBiillings = () => {
  return (
    <div>
      <div className="plans-row-container">
        <div  className="pricing-plan">
          <div className="pricing-plan-top-color-sec"></div>
          <div className="pricing-plan-details-container">
            <div className="pricing-plan-type">free</div>
            <div className="pricing-plan-type-des">best</div>
            <div className="pricing-plan-amount-currency">INR ₹</div>
            <div className="pricing-plan-amount-container">
              <div className="pricing-plan-amount">0</div>
              <div className="pricing-plan-amount-details">0</div>
            </div>
            <div className="plan-icludes">Plan Includes:</div>
            <div className="plan-iclude-item-container">
              
                <div  className="plan-include-item">
                  <BsFillPatchCheckFill className="inlude-item-check" />
                  <div className="plan-include-item-details">msd ms</div>

                </div>
             
            </div>
            <div className="plan-purchase-btn">
              {/* {plan.type === "Free" ? ( */}
                <BsFillPatchCheckFill className="plan-purchase-btn-icon" />
              {/* ) : ( */}
                <GiQueenCrown className="plan-purchase-btn-icon" />
              {/* )} */}
              <div>Get  plan</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlansAndBiillings;
