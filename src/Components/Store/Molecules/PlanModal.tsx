import React from "react";
import useMystoreStore from "../Core/Store";
import { IoClose } from "react-icons/io5";
import { BsFillPatchCheckFill } from "react-icons/bs";
import { GiQueenCrown } from "react-icons/gi";
import { Link } from "react-router-dom";

const PlanModal: React.FC = () => {
  const { profileData, isOpenPlanModal, setOpenPlanModal } = useMystoreStore(
    (state) => state
  );

  return (
    <>
      <div
        className={`modal ${isOpenPlanModal ? "d-block show" : "d-none fade"}`}
        id="kt_modal_barter_form"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header d-flex justify-content-between ">
              {/* <h5 className="modal-title">Upgrade Plan</h5> */}
              <div
                className="btn btn-icon btn-sm btn-active-light-primary ms-2"
                onClick={() => setOpenPlanModal()}
                style={{ color: "black" }}
              >
                <IoClose size={22} />
              </div>
            </div>

            <div className="modal-body">


            <div className="plans-row-container">
        <div className="pricing-plan">
          <div className="pricing-plan-top-color-sec"></div>
          <div className="pricing-plan-details-container">
            <div className="pricing-plan-type">
              {profileData?.plan === "paidPlan"
                ? "Talk to us"
                : profileData?.plan === "freePlan"
                ? "Paid Plan"
                : ""}
            </div>
            {/* <div className="pricing-plan-type-des">best</div> */}
            <div className="pricing-plan-amount-currency">{profileData?.plan==='paidPlan'?'contact@raisnetwork.com':
            profileData.plan==='freePlan'?'$10':""}</div>
            <div className="pricing-plan-amount-container">
              {/* <div className="pricing-plan-amount">0</div> */}
              {/* <div className="pricing-plan-amount-details">0</div> */}
            </div>
            <div className="plan-icludes">Plan Includes:</div>
            <div className="plan-iclude-item-container">
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
              {
                profileData.plan==='paidPlan'&&
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
            <Link to={profileData.plan==='paidPlan'?
                'https://raisnetwork.com/contact-us':
                'https://raisnetwork.com/mystore'
            }  className="plan-purchase-btn" style={{color:"white",textDecoration:"none"}}
            
            >
              <GiQueenCrown className="plan-purchase-btn-icon" />
              <div>{profileData.plan==='paidPlan'?'Talk to us':'Subscribe'}</div>
            </Link>
          </div>
        </div>
      </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlanModal;
