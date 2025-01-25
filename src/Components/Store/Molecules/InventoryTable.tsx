import React, { useEffect, useState } from "react";

import "../Helpers/scss/InvoiceTable.scss";
import useMystoreStore from "../Core/Store";
import { getSubdomain } from "../../../Utils/Subdomain";
const { hostname } = window.location;
let subdomain = getSubdomain(hostname);

const InventoryTable: React.FC = () => {
  const { getInventory } = useMystoreStore((s) => s);
  const [inventory, setInventory] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState<number>(1); // Current page state
  const itemsPerPage = 10; // Limit to 10 items per page
  const [loading, setLoading] = useState<boolean>(false); // Loading state

  useEffect(() => {
    const apiHelper = async () => {
      setLoading(true); // Start loading
      try {
        const { data } = await getInventory(subdomain);
        setInventory(data?.storeOrders);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      } finally {
        setLoading(false); // End loading
      }
    };

    if (subdomain) {
      apiHelper();
    }
  }, [subdomain]);

  // Calculate the indices for pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInventory = inventory.slice(startIndex, endIndex);

  const totalPages = Math.ceil(inventory.length / itemsPerPage);

  // Handle page navigation
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className={`card`}>
      {/* begin::Header */}
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">Recent Inventory</span>
          <span className="text-muted mt-1 fw-semibold fs-7">
            &nbsp;Over {inventory.length || 0} Inventory Items
          </span>
        </h3>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className="card-body py-3">
        {/* begin::Loader */}
        {loading ? (
          <div className="d-flex justify-content-center align-items-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <>
            {/* begin::Table container */}
            <div className="table-responsive">
              {/* begin::Table */}
              <table className="table table-row-bordered table-row-gray-100 align-middle gs-0 gy-3">
                {/* begin::Table head */}
                <thead>
                  <tr className="fw-bold text-muted">
                    <th className="min-w-150px">Item ID</th>
                    <th className="min-w-140px">Item Name</th>
                    <th className="min-w-120px">Ordered Date</th>
                    <th className="min-w-120px">Quantity</th>
                    <th className="min-w-120px">Unit Price</th>
                    <th className="min-w-120px">Payment Method</th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody>
                  {currentInventory.length ? (
                    currentInventory.map((val: any) =>
                      val.productDetails.map((p: any) => (
                        <tr key={val?._id}>
                          <td>
                            <div className="text-gray-900 fw-bold text-hover-primary fs-6">
                              {val?._id}
                            </div>
                          </td>
                          <td>
                            <div className="text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6">
                              {p.productName}
                            </div>
                          </td>
                          <td>
                            <div className="text-gray-900 fw-bold text-hover-primary d-block mb-1 fs-6">
                              {new Date(val?.createdAt)?.toLocaleDateString(
                                "en-gb",
                                {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}
                            </div>
                          </td>
                          <td>{p.quantity}</td>
                          <td className="text-gray-900 fw-bold text-hover-primary fs-6">
                            {p.price}
                          </td>{" "}
                          <td className="text-gray-900 fw-bold text-hover-primary fs-6">
                            {val.paymentMethod}
                          </td>
                        </tr>
                      ))
                    )
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center">
                        Currently, there is no Inventory available
                      </td>
                    </tr>
                  )}
                </tbody>
                {/* end::Table body */}
              </table>
              {/* end::Table */}
            </div>
            {/* end::Table container */}
            {/* Pagination Controls */}
            <div className="pagination-container d-flex justify-content-center mt-4">
              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    className={`btn btn-sm ${
                      page === currentPage ? "btn-primary" : "btn-light"
                    } mx-1`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                )
              )}
            </div>
          </>
        )}
      </div>
      {/* end::Body */}
    </div>
  );
};

export { InventoryTable };
