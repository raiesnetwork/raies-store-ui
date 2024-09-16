import React, { useEffect, useState } from "react";
import useMystoreStore from "./Core/Store";
import { respProduct } from "./Core/Interfaces";
import ProductViewCard from "./Molecules/ProductCard";
import Header from "./Molecules/Header";
import "react-toastify/dist/ReactToastify.css";
import { getSubdomain } from "../../Utils/Subdomain";

const { hostname } = window.location;
// eslint-disable-next-line prefer-const
let subdomain=getSubdomain(hostname)
export const MyStore: React.FC = () => {
  const {
    FetchToCart,
    getAllProduct,
    AllProducts,
    setHomeLoader,
    homeLoader,
    logedIn,
    latestProduct,
    setUserName,
  } = useMystoreStore((state) => state);
  
  const [data, setData] = useState<respProduct[]>(AllProducts);
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    if (AllProducts.length > 0) {
      setData(AllProducts);
      setHomeLoader(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [AllProducts]);

  useEffect(() => {
    const name = localStorage.getItem("suname");
    setUserName(name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setHomeLoader(true);
      if (logedIn) {
        FetchToCart();
        await getAllProduct(subdomain);
      } else {
        await latestProduct(subdomain);
      }
      setHomeLoader(false);
    };

    if (subdomain) {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logedIn, subdomain]);

  useEffect(() => {
    // Filter the products based on the selected filter
    let filteredData = AllProducts;

    if (filteredData?.length > 0) {
      if (filter === "Price") {
        filteredData = AllProducts.filter(
          (product) => product.priceOption === "normal"
        );
      } else if (filter === "Bidding") {
        filteredData = AllProducts.filter(
          (product) => product.priceOption === "bidding"
        );
      } else if (filter === "Barter") {
        filteredData = AllProducts.filter(
          (product) => product.priceOption === "barter"
        );
      } else if (filter === "free") {
        filteredData = AllProducts.filter(
          (product) => product.priceOption === "free"
        );
      }
    }
    setData(filteredData);
  }, [filter, AllProducts]);

  return (
    <>
      <Header />
      {homeLoader ? (
        <div style={{ textAlign: "center" }}>Loading...</div>
      ) : (
        <>
          <div
            style={{
              padding: "15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "0px solid #ccc",
                fontSize: "16px",
                cursor: "pointer",
              }}
            >
              <option value="All">All</option>
              <option value="free">Free</option>
              <option value="Price">Price</option>
              <option value="Bidding">Bidding</option>
              <option value="Barter">Barter</option>
            </select>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            {data?.length > 0 ? (
              data?.map((val) =>
                !val.flag ? <ProductViewCard key={val.id} data={val} /> : null
              )
            ) : (
              <div style={{ fontSize: "50px" }}>(Store is empty)</div>
            )}
          </div>
        </>
      )}
    </>
  );
};
