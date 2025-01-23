import "../Helpers/scss/planandbills.css";
import { GiQueenCrown } from "react-icons/gi";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { InvioceTable } from "./InvoiceTable";
import useMystoreStore from "../Core/Store";
import InvoiceDetails from "./InvoiceDetails";
import PlanModal from "./PlanModal";

const PlansAndBiillings = () => {
  const { profileData, storeInvoiceData ,setOpenPlanModal} = useMystoreStore((s) => s);
  return (
    <div>
      <div className="plans-row-container">
        <div className="pricing-plan">
          <div className="pricing-plan-top-color-sec"></div>
          <div className="pricing-plan-details-container">
            <div className="pricing-plan-type">
              {profileData?.plan === "paidPlan"
                ? "Paid Plan"
                : profileData?.plan === "freePlan"
                ? "Free"
                : "Talk to us"}
            </div>
            {/* <div className="pricing-plan-type-des">best</div> */}
            <div className="pricing-plan-amount-currency">$10</div>
            <div className="pricing-plan-amount-container">
              {/* <div className="pricing-plan-amount">0</div> */}
              {/* <div className="pricing-plan-amount-details">0</div> */}
            </div>
            <div className="plan-icludes">Plan Includes:</div>
            <div className="plan-iclude-item-container">
               
                    <>
              <div className="plan-include-item">
                <BsFillPatchCheckFill className="inlude-item-check" />
                <div className="plan-include-item-details">
                Basic assistance
                
                </div>
              </div><div className="plan-include-item">
                <BsFillPatchCheckFill className="inlude-item-check" />
                <div className="plan-include-item-details">
                Access to core features
                </div>
              </div>
                    </>
              {
                (profileData.plan==='paidPlan'||profileData.plan==='talkToUs')&&
                <>
              <div className="plan-include-item">
                <BsFillPatchCheckFill className="inlude-item-check" />
                <div className="plan-include-item-details">
                  Subdomain Creation
                </div>
              </div>
              <div className="plan-include-item">
                <BsFillPatchCheckFill className="inlude-item-check" />
                <div className="plan-include-item-details">
                  Advanced features
                </div>
              </div>{" "}
              <div className="plan-include-item">
                <BsFillPatchCheckFill className="inlude-item-check" />
                <div className="plan-include-item-details">
                  Priority support
                </div>
              </div>
                </>
              }
              {
                profileData.plan==='talkToUs'&&
                <>
              <div className="plan-include-item">
                <BsFillPatchCheckFill size={28} className="inlude-item-check" />
                <div className="plan-include-item-details">
                Dedicated support for all your business needs.
                </div>
              </div><div className="plan-include-item">
                <BsFillPatchCheckFill size={28} className="inlude-item-check" />
                <div className="plan-include-item-details">
                Priority access to analytics and premium features.
                </div>
              </div>
                </>
            }
            </div>
            <div className="plan-purchase-btn" 
            onClick={()=>profileData.plan!=='talkToUs'&&setOpenPlanModal()}
            >
              <GiQueenCrown className="plan-purchase-btn-icon" />
              <div>Upgrade Plan</div>
            </div>
          </div>
        </div>
      </div>
      {storeInvoiceData?._id ? <InvoiceDetails /> : <InvioceTable />}
      <PlanModal/>
    </div>
  );
};

export default PlansAndBiillings;
