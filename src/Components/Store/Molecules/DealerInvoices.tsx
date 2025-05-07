import React, { useEffect } from "react";
import useMystoreStore from "../Core/Store";
// import { FaEye } from "react-icons/fa";
import { toast } from "react-toastify";
const DelalerInvoices: React.FC = () => {
    const { dealerInvoices, fetchDealerInvoices, createDealerPayment, dealerPayment } = useMystoreStore();

    useEffect(() => {
        fetchDealerInvoices();
    }, [fetchDealerInvoices]);
    console.log("invoices", dealerInvoices)

    const handleDealerPayment = async (invoice: any) => {
        try {
            // Extract relevant invoice details
            const { amount, _id: invoiceId } = invoice;

            // Create a Razorpay order via your API
            const order = await createDealerPayment(amount);
            if (!order || !order.id) {
                throw new Error("Failed to create Razorpay order");
            }

            // Razorpay options
            const options = {
                key: import.meta.env.VITE_APP_RAZOR_PAY, // Razorpay key
                amount: order.amount,
                currency: "INR",
                name: "STORE CART PURCHASE",
                description: `Payment for Invoice #${invoice.invoiceNumber}`,
                order_id: order.id,
                handler: async (response: any) => {
                    try {
                        // Pass response to dealerPayment API to verify and record the payment


                        await dealerPayment(response,
                            invoiceId,
                            amount,);

                        // Display success message
                        toast.success("Payment completed successfully!");
                    } catch (error: any) {
                        console.error("Payment verification failed:", error);
                        toast.error("Payment verification failed. Please try again.");
                    }
                },
                theme: {
                    color: "#3399cc",
                },
                modal: {
                    ondismiss: () => {
                        toast.info("Payment process was canceled.");
                    },
                },
            };

            // Initialize Razorpay and open the payment modal
            const rzp1 = new (window as any).Razorpay(options);
            rzp1.open();
        } catch (error) {
            console.error("Payment failed:", error);
            toast.error("Failed to initiate payment. Please try again.");
        }
    };



    return (
        <div className={`card`}>
            {/* begin::Header */}
            <div className="card-header border-0 pt-5">
                <h3 className="card-title align-items-start flex-column">
                    <span className="card-label fw-bold fs-3 mb-1">Recent Invoices - </span>
                    <span className="text-muted mt-1 fw-semibold fs-7">
                        {dealerInvoices.length > 0
                            ? `${dealerInvoices.length} invoices`
                            : "No invoices available"}
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
                                <th className="min-w-150px">Order ID</th>
                                <th className="min-w-150px">Dealer</th>
                                <th className="min-w-120px">Issued Date</th>
                                <th className="min-w-120px">Due Date</th>
                                <th >Amount</th>
                                <th>Status</th>
                                {/* <th >view</th> */}
                                <th className="text-end">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dealerInvoices.length > 0 ? (
                                dealerInvoices.map((invoice: any) => (
                                    <tr key={invoice._id}>
                                        <td>
                                            <div className="text-gray-900 fw-bold text-hover-primary fs-6">
                                                {invoice.invoiceNumber}
                                            </div>
                                        </td>
                                        <td>{invoice.orderId}</td>
                                        <td>{invoice.userId}</td>
                                        <td>
                                            {new Date(invoice.createdAt).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td>
                                            {new Date(invoice.dueDate).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td className="text-gray-900 fw-bold">
                                            ₹{invoice.amount.toFixed(2)}
                                        </td>
                                        <td>
                                            {invoice.status === "Unpaid" ? (
                                                <span className="badge badge-light-warning" style={{background:"orange"}}>
                                                    {invoice.status}
                                                </span>
                                            ) : invoice.status === "Paid" ? (
                                                <span className="badge badge-light-success" style={{background:"green"}}>
                                                    {invoice.status}
                                                </span>
                                            ) : (
                                                <span className="badge badge-light-danger">
                                                    {invoice.status}
                                                </span>
                                            )}
                                        </td>
                                        {/* <td className="text-end">
                                            <button
                                                onClick={() => alert(`Viewing invoice ${invoice._id}`)}
                                                title="View"
                                                className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                                            >
                                                <FaEye />
                                            </button>
                                        </td> */}
                                        <td className="text-end">
                                            {invoice.status === "Paid" ? (
                                                <span className="badge badge-light-success">Paid</span>
                                            ) : (
                                                <button
                                                    onClick={() => handleDealerPayment(invoice)}
                                                    title="Pay"
                                                    className="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
                                                >
                                                    Pay
                                                </button>
                                            )}
                                        </td>

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={8} className="text-center">
                                        No invoices available.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DelalerInvoices;
