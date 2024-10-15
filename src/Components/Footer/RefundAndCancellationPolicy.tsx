// RefundAndCancellationPolicy.tsx
import React from "react";
import "./RefundAndCancellationPolicy.scss";
import Header from "../Store/Molecules/Header";
import StoreFooter from "./Footer";
import useMystoreStore from "../Store/Core/Store";

const RefundAndCancellationPolicy: React.FC = () => {
  const { storeData } = useMystoreStore((state) => state);
  return (
    <>
      <Header />
      <div className="refund-cancellation-policy">
        <h2>Refund and Cancellation Policy</h2>
        <div
        dangerouslySetInnerHTML={{ __html: storeData?.refundAndCancelPolicy || '' }} 
        >
          
        </div>
        <span>
        Platform's Refund and Cancellation Policy for additional information.
        <a
          href="https://raies.net/Refund-and-Cancellation-Policy/"
          className="refund-cancellation-policy__link"
          target="_blank"
          rel="noopener noreferrer"
        >
          click here
        </a>
        </span>
        
      </div>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
        }}
      >
        <StoreFooter />
      </div>
    </>
  );
};

export default RefundAndCancellationPolicy;
