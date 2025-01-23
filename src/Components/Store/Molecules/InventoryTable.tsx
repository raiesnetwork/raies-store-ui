import React, { useEffect, useState } from "react";

import "../Helpers/scss/InvoiceTable.scss";
import useMystoreStore from "../Core/Store";
import { getSubdomain } from "../../../Utils/Subdomain";
const { hostname } = window.location;
let subdomain = getSubdomain(hostname);
const InventoryTable: React.FC = () => {
  const {  getInventory } = useMystoreStore((s) => s);
  const [inventory, setInventory] = useState<any>([]);
//   const [loader, setLoader] = useState<boolean>(false);
  useEffect(() => {
    const apiHelper = async () => {
    //   try {
        // setLoader(true);
        const { data } = await getInventory(subdomain);
        console.log(data);
        setInventory(data?.storeOrders);
    //   } catch (e) {
    //     setLoader(false);
    //   } finally {
    //     setLoader(false);
    //   }
    };
    if (subdomain) {
      apiHelper();
    }
  }, [subdomain]);

  return (

    <div className={`card `}>
      {/* begin::Header */}
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold fs-3 mb-1">Recent Invoices</span>
          <span className="text-muted mt-1 fw-semibold fs-7">
             &nbsp;Over {inventory.length||0} Inventorys
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
                <th className="min-w-150px">Item ID</th>
                <th className="min-w-140px">Item Name</th>
                <th className="min-w-120px">Ordered Date</th>
                <th className="min-w-120px">Quantity</th>
                <th className="min-w-120px">Unit Price </th>
                <th className="min-w-120px">Payment Method</th>
                {/* <th className="min-w-120px">Last Restocked</th> */}
              </tr>
            </thead>
            {/* end::Table head */}
            {/* begin::Table body */}
            <tbody>
              {inventory?.length ? (
                inventory.map((val: any) =>
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
                <div> currently there is no Inventorys available</div>
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

export { InventoryTable };
