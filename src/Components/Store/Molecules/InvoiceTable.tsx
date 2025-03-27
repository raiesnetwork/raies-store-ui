import React, { useEffect } from "react";
import { Country } from "country-state-city";
import Swal from "sweetalert2";
import { TbFileDownload} from "react-icons/tb";
import '../Helpers/scss/InvoiceTable.scss'
import useMystoreStore from "../Core/Store";
import { storeInvoice } from "../Core/Interfaces";
import { generateInvoicePDF } from "../../../Utils/GenerateInvoice";
import { BsEye } from "react-icons/bs";

const InvioceTable: React.FC = () => {
  const {postDownloadReceipt, storeInvoices, 
    setInvoiceData, postInvoicePayment,
    getInvoice,createRazorpayOrder } = useMystoreStore(
    (s) => s
  );
  useEffect(()=>{
    getInvoice()

},[])

  const handileSingleInvoiceData = (data: storeInvoice) => {
    setInvoiceData(data);
  };

  const handilePay = async (data: storeInvoice) => {
    const { order } = await createRazorpayOrder(
      parseFloat(data?.amount) + 80.93
    );

    const options = {
      key: import.meta.env.VITE_APP_RAZOR_PAY,
      amount: parseFloat(data?.amount) + 80.93,
      currency: "INR",
      name: data?.subscription?.UserDetails?.profile?.name,
      description: "My store Payment",
      order_id: order?.id,
      handler: async (response: any) => {
        try {
          await postInvoicePayment(
            response,
            data?._id,
            parseFloat(data?.amount) + 80.93
          );
          getInvoice()
          Swal.fire({
            icon: "success",
            title: "Payment successful!",
            showConfirmButton: false,
            timer: 3500,
          });

        } catch (error: any) {
          Swal.fire({
            icon: "error",
            title: "Payment verification failed",
            text: error.message,
          });
        }
      },
      profile: {
        name: data?.subscription?.UserDetails?.profile?.name,
        email: "",
        contact: data?.subscription?.UserDetails?.mobile,
      },
      theme: {
        color: "#3399cc",
      },
      modal: {
        ondismiss: () => {},
      },
    };
    const rzp1 = new (window as any).Razorpay(options);
    rzp1.open();
  };
  const handileDownload =async (id:string) => {
   const data=await postDownloadReceipt(id)
    if (data?.error) {
      Swal.fire({
        icon: "error",
        title: "Download failed",
       
      });
    }else{
      console.log(data.data);
      generateInvoicePDF(data.data);  
    }
  };
  return (
    <div className={`card `}>
      {/* begin::Header */}
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">Recent Invoices</span>
          <span className="text-muted mt-1 fw-semibold fs-7">
            Over {storeInvoices?.length} invoices
          </span>
        </h3>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className="card-body py-3">
        {/* begin::Table container */}
        <div className="table-responsive">
          {/* begin::Table */}
          <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
            {/* begin::Table head */}
            <thead>
              <tr className="fw-bold text-muted">
                <th className="min-w-150px">Invoice No</th>
                <th className="min-w-140px">Country</th>
                <th className="min-w-120px">Issued Date</th>
                <th className="min-w-120px">Due Date</th>
                <th className="min-w-120px">Due Amount</th>
                <th className="min-w-120px">Status</th>
                <th className="min-w-120px">Payment</th>

                <th className="min-w-100px text-end">Actions</th>
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {storeInvoices?.length ? (
                storeInvoices.map((val) => (
                  <tr key={val?._id}>
                    <td>
                      <div className="text-gray-900 fw-bold text-hover-primary fs-6">
                        {val?.invoiceNumber}
                      </div>
                    </td>
                    <td>
                      <div className="text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6">
                        {Country.getCountryByCode(val?.subscription?.region)
                          ?.name || ""}
                      </div>
                    </td>
                    <td>
                      <div className="text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6">
                        {new Date(val?.createdAt)?.toLocaleDateString("en-gb", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td>
                      <div className="text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6">
                        {new Date(val?.dueDate)?.toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </td>
                    <td className="text-gray-900 fw-bold text-hover-primary fs-6">
                    ₹{val?.amount}
                    </td>

                    <td>
                      {val?.status === "Unpaid" ? (
                        <span className="badge badge-light-warning">
                          {val?.status}
                        </span>
                      ) : val?.status === "Paid" ? (
                        <span className="badge badge-light-success">
                          {val?.status}
                        </span>
                      ) : (
                        <span className="badge badge-light-danger">
                          {val?.status}
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          val?.status === "Paid" ? handileDownload(val._id) : handilePay(val)
                        }
                        className={`btn ${
                          val?.status === "Paid"
                            ? "btn-warning"
                            : val?.status === "Due"
                            ? "btn-danger"
                            : "btn-success"
                        }`}
                      >
                        {val?.status === "Paid" ? (
                          <div style={{display:"flex"}}>
                           <TbFileDownload size={28} color="white" title="Download pdf" />
                           {/* <TbFileTypePdf  size={22}/> */}
                          </div>
                        ) : (
                          "Pay"
                        )}
                      </button>
                    </td>

                    <td className="text-end">
                      <button
                        onClick={() => handileSingleInvoiceData(val)}
                        title="view"
                        className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                      >
<BsEye size={17}/>                  
    </button>
                    </td>
                  </tr>
                ))
              ) : (
                <div> currently there is no invoices available</div>
              )}
            </tbody>
            {/* end::Table body */}
          </table>
          {/* end::Table */}
        </div>
        {/* end::Table container */}
      </div>
      {/* begin::Body */}
    </div>
  );
};

export { InvioceTable };
