import React from "react";
import { State, Country } from "country-state-city";
import Swal from "sweetalert2";
import { TbFileDownload } from "react-icons/tb";
import { generateInvoicePDF } from "../../../Utils/GenerateInvoice";
import useMystoreStore from "../Core/Store";

const InvoiceDetails: React.FC = () => {
  const { createRazorpayOrder,postDownloadReceipt, 
    storeInvoiceData, setInvoiceData, postInvoicePayment 

  } = useMystoreStore((s) => s);
  
  const handileCancel = () => {
    setInvoiceData({
      _id: "",
      subscription: {
        cardholderName: "",
        storeName: "",
        region: "",
        state: "",
        city: "",
        UserDetails: {
          mobile: "",
          profile: {
            name: "",
          },
        },
      },
      amount: "",
      status: "",
      createdAt: "",
      dueDate: "",
      invoiceNumber: "",
    });
  };

  const handilePay = async () => {
    const { order } = await createRazorpayOrder(parseFloat(storeInvoiceData?.amount) + 80.93);

    const options = {
      key: import.meta.env.VITE_APP_RAZORPAY_LIVE,
      amount: parseFloat(storeInvoiceData?.amount) + 80.93,
      currency: "INR",
      name: storeInvoiceData.subscription.UserDetails.profile.name,
      description: "Fund for the campaign",
      order_id: order?.id,
      handler: async (response: any) => {
        try {
          await postInvoicePayment(response, storeInvoiceData?._id, parseFloat(storeInvoiceData?.amount) + 80.93);
          Swal.fire({
            icon: 'success',
            title: 'Payment successful!',
            showConfirmButton: false,
            timer: 3500
          });

        } catch (error: any) {

          Swal.fire({
            icon: 'error',
            title: 'Payment verification failed',
            text: error.message,
          });

        }
      },
      profile: {
        name: storeInvoiceData?.subscription?.UserDetails?.profile?.name,
        email: "",
        contact: storeInvoiceData?.subscription?.UserDetails?.mobile,
      },
      theme: {
        color: "#3399cc",
      },
      modal: {
        ondismiss: () => {
        },
      }
    };
    const rzp1 = new (window as any).Razorpay(options);
    rzp1.open();
  };
  const handileDownload = async () => {
    const data = await postDownloadReceipt(storeInvoiceData?._id)
    if (data?.error) {
      Swal.fire({
        icon: "error",
        title: "Download failed",

      });
    } else {
      console.log(data.data);
      generateInvoicePDF(data.data);
    }
  }
  return (
    <div className="container-fluid">
      {/* Invoice Header */}
      <div className="row justify-content-between mb-5">
        <div className="col-lg-6">
          <h1 className="fw-bold text-[100]"
            style={{
              fontSize: "5rem"
            }}
          >Invoice</h1>
        </div>
        <div className="col-lg-6 text-end" >
          <p className="mb-2">
            <strong>RAIS NETWORK</strong>{" "}

          </p>
          <p className="mb-2">
            WeWork Olympia Cyberspace No 21/22, Alandur Road, Arulayiammanpet,
          </p>
          <p>
            2nd Street, Guindy, Chennai 600032
          </p>
          <p>
            contact@raisnetwork.com

          </p>
        </div>
      </div>

      {/* Billing Information and Invoice Summary */}
      <div className="row">
        <div className="col-lg-6">


          <h5 className="fw-bold">Billed To</h5>
          <address>
            {storeInvoiceData?.subscription?.UserDetails?.profile?.name}
            <br />
            {Country.getCountryByCode(storeInvoiceData?.subscription?.region)
              ?.name || ""}

            <br />
            {State.getStateByCode(storeInvoiceData?.subscription?.state)
              ?.name || ""}

            <br />
            {storeInvoiceData?.subscription?.city}
            <br />
            <a href="tel:+1-888-123-8910" className="text-dark">
              {storeInvoiceData?.subscription?.UserDetails?.mobile}
            </a>
          </address>
        </div>
        <div className="col-lg-6 text-end">
          <p className="mb-2">
            <strong>Date Issued:</strong>{" "}
            {new Date(storeInvoiceData?.createdAt)?.toLocaleDateString(
              "en-GB",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            )}
          </p>
          <p className="mb-2">
            <strong>Invoice Number:</strong> {storeInvoiceData?.invoiceNumber}
          </p>
          <p>
            <strong>Amount Due:</strong>{" "}
            <span className="text-danger">${storeInvoiceData?.amount}</span>
          </p>
          <p>
            <strong>Due Date:</strong>{" "}
            {new Date(storeInvoiceData?.dueDate)?.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </p>

        </div>
      </div>
      <hr
        style={{
          height: "4px",
          backgroundColor: "blue",
          border: "none",
          marginBottom: "5px",
        }}
      />

      {/* Table for Invoice Items */}
      <div className="row mt-4">
        <div className="col-lg-12">
          <table className="table table-bordered table-responsive-md">
            <thead>
              <tr className="fw-bold text-dark">
                <th>Description</th>

                <th>Month</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>{storeInvoiceData?.subscription?.storeName}</strong>{" "}
                  Store Services
                </td>
                <td>
                  {" "}
                  {new Date(storeInvoiceData?.createdAt)?.toLocaleDateString(
                    "en-GB",
                    {
                      month: "short",
                    }
                  )}
                </td>
                <td>${storeInvoiceData?.amount}.00</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="text-end fw-bold">
                  Tax
                </td>
                <td>+$80.93</td>
              </tr>
              <tr>
                <td colSpan={3} className="text-end fw-bold">
                  Total
                </td>
                <td className="fw-bold">
                  ${parseFloat(storeInvoiceData?.amount) + 80.93}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Notes and Terms Section */}
      <div className="row mt-5">
        <div className="col-lg-6">
          <h5 className="fw-bold">Notes</h5>
          <p>Thank you for your business!</p>
        </div>
        <div className="col-lg-6">
          <h5 className="fw-bold">Terms</h5>
          <p>Please pay within 30 days.</p>
        </div>
        <div className="col-lg-6">
          <button
            onClick={handileCancel}
            style={{
              marginRight: "10px",
            }}
            className="btn btn-danger"
          >
            {storeInvoiceData?.status === "Paid" ? "Go Back" : "Cancel"}
          </button>
          <button onClick={
            storeInvoiceData?.status === "Paid" ? handileDownload : handilePay}
            className={`btn ${storeInvoiceData?.status === "Paid"
              ? "btn-warning" : storeInvoiceData?.status === "Due" ?
                "btn-danger" :
                "btn-success"}`}
          >
            {storeInvoiceData?.status === "Paid" ?
              <>
                <TbFileDownload size={28} color="white" />
                Download Receipt
              </>

              : "Proceed to Payment"}


          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;
