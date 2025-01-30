import React, { useEffect, useState } from "react";
import { Spinner, Button } from "react-bootstrap";
import "../Helpers/scss/InvoiceTable.scss";
import useMystoreStore from "../Core/Store";
import { getStockRequestApi } from "../Core/StoreApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface Stock {
  _id: string;
  productName: string;
  productId: any;
  stock: string;
  createdAt: string;
  expectedDate: string;
  approve: boolean;
  adwancePaymentMode: boolean;
  dealerId: { fullName: string };
  status: string;
  notes: string;
  deuAmount: string;
  notesType: string;
}

const StockRequestTable: React.FC = () => {
  const { setStockPaymentPageData } = useMystoreStore((s) => s);
  const navigate = useNavigate();

  const [stock, setStock] = useState<Stock[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pageNo, setPageNo] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data } = await getStockRequestApi(pageNo.toString(), "user");
        setLoading(false);

        if (data.error) {
          toast.error("We can't access the data right now. Please try again later.");
        } else {
          setStock(data?.requests || []);
          setTotalPages(data?.totalPages || 1);
        }
      } catch (e) {
        toast.error("Something went wrong while fetching stock requests.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [pageNo]);

  return (
    <div className="card">
      {/* Header */}
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">Recent Stock Requests</span>
        </h3>
      </div>

      {/* Body */}
      <div className="card-body py-3">
        <div className="table-responsive">
          {loading ? (
            // Show Spinner while loading data
            <div className="text-center my-4">
              <Spinner animation="border" role="status" />
              <p>Loading stock requests...</p>
            </div>
          ) : stock.length ? (
            // Show Table if data is available
            <>
              <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                <thead>
                  <tr className="fw-bold text-muted">
                    <th className="min-w-50px">No</th>
                    <th className="min-w-140px">Product Name</th>
                    <th className="min-w-120px">Requested Date</th>
                    <th className="min-w-120px">Expect Delivery Date</th>
                    <th className="min-w-120px">Advance Payment</th>
                    <th className="min-w-120px">Due Amount</th>
                    <th className="min-w-120px">Status</th>
                    <th className="min-w-120px">Response</th>
                    <th className="min-w-120px">Notes</th>
                    <th className="min-w-100px text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stock.map((val, i) => (
                    <tr key={val._id}>
                      <td>{(pageNo - 1) * 10 + (i + 1)}</td>
                      <td>{val.productName}</td>
                      <td>
                        {new Date(val.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td>
                        {new Date(val.expectedDate).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td>{val.adwancePaymentMode ? "Yes" : "No"}</td>
                      <td>{val.deuAmount }</td>
                      <td style={{color:val.status==='Rejected'?"red":val.status==='Accepted'?"green":"yellow"}}>{val.status}</td>
                      <td>{val.notesType || "N/A"}</td>
                      <td>{val.notes || "N/A"}</td>
                      <td>
                        <Button
                          variant="success"
                          disabled={!val.approve}
                          onClick={() => {
                            setStockPaymentPageData({
                              productData: val.productId,
                              paymentType: val.adwancePaymentMode ? "online" : "credit",
                            });
                            navigate("/businessorder");
                          }}
                        >
                          Place Order
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination Controls */}
              <div className="d-flex justify-content-between align-items-center mt-3">
                <Button
                  variant="secondary"
                  disabled={pageNo <= 1}
                  onClick={() => setPageNo((prev) => Math.max(prev - 1, 1))}
                >
                  Previous
                </Button>
                <span>Page {pageNo} of {totalPages}</span>
                <Button
                  variant="secondary"
                  disabled={pageNo >= totalPages}
                  onClick={() => setPageNo((prev) => Math.min(prev + 1, totalPages))}
                >
                  Next
                </Button>
              </div>
            </>
          ) : (
            // Show message if no data is available
            <div className="text-center my-4">
              <p>No stock requests available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { StockRequestTable };
