import React, { useEffect, useState } from "react";
import useMystoreStore from "./Core/Store";
import { respProduct } from "./Core/Interfaces";
import ProductViewCard from "./Molecules/ProductCard";
import Header from "./Molecules/Header";
import { getSubdomain } from "../../Utils/Subdomain";
import "./Helpers/scss/mystore.scss";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import StoreFooter from "../Footer/Footer";
import { useAuth } from "../Auth/AuthContext";
import Loader from "../Loader/Loader";

const { hostname } = window.location;
let subdomain = getSubdomain(hostname);

export const MyStore: React.FC = () => {
  const {
    FetchToCart,
    AllProducts,
    setHomeLoader,
    homeLoader,
    
    latestProduct,
    setUserName,
    storeData,
    getShprocketToken
  } = useMystoreStore((state) => state);
const {isAuthenticated}=useAuth()||{}
  const [data, setData] = useState<respProduct[]>([]);
  const [filteredData, setFilteredData] = useState<respProduct[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [pageNo, setPageNo] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);

  useEffect(() => {
    if (AllProducts.length > 0) {
      setData(AllProducts);
      setHomeLoader(false);
    }
  }, [AllProducts]);

  useEffect(() => {
    if (isAuthenticated) {
      const name = localStorage.getItem("suname");
      setUserName(name);
      getShprocketToken()
    }
  }, [isAuthenticated]);
  const {user}=useAuth()||{}

  useEffect(() => {
    const fetchProducts = async () => {
      setHomeLoader(true);
      if (user) {
        
        FetchToCart();
      }
      await latestProduct(subdomain, "");
      setHomeLoader(false);
    };

    if (subdomain) {
      fetchProducts();
    }
  }, [subdomain,user]);

  useEffect(() => {
    let filtered = data;

    if (filter === "Price") {
      filtered = data.filter((product) => product.priceOption === "normal");
    } else if (filter === "Bidding") {
      filtered = data.filter((product) => product.priceOption === "bidding");
    } else if (filter === "Barter") {
      filtered = data.filter((product) => product.priceOption === "barter");
    } else if (filter === "free") {
      filtered = data.filter((product) => product.priceOption === "free");
    }

    setFilteredData(filtered);
    setPageNo(1);
  }, [filter, data]);

  const paginatedData = filteredData.slice(
    (pageNo - 1) * itemsPerPage,
    pageNo * itemsPerPage
  );

  const handleNextPage = () => {
    if (pageNo < Math.ceil(filteredData.length / itemsPerPage)) {
      setPageNo((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageNo > 1) {
      setPageNo((prevPage) => prevPage - 1);
    }
  };

  return (
    <>
    {homeLoader ? (
            <Loader/>

    ) : (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      
        <div style={{ flex: 1 }}>
          <div className="mystore">
            <div className="myStore__banner">
              <img
                src={
                  storeData ? storeData?.storeBanner : "/media/nike banner.png"
                }
                className="mystore__banner_img"
                alt=""
              />
            </div>
            <div className="mystore__category_container">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="mystore__select_category"
              >
                <option value="All">ALL</option>
                <option value="free">FREE</option>
                <option value="Price">NORMAL</option>
                <option value="Bidding">AUCTIONS</option>
                <option value="Barter">EXCHANGE</option>
              </select>
            </div>
            <div className="mystore__products_sec">
              {paginatedData.length > 0 ? (
                paginatedData.map((val) =>
                  !val.flag ? <ProductViewCard key={val._id} data={val} /> : null
                )
              ) : (
                <div className="mystore__empty_msg">Store is empty</div>
              )}
            </div>
            <div className="mystore__pagination">
              <button
                style={{
                  cursor:
                    pageNo >= Math.ceil(filteredData.length / itemsPerPage)
                      ? "pointer"
                      : "not-allowed",
                }}
                onClick={handlePreviousPage}
                disabled={pageNo === 1}
                className="mystore__pagination-btn"
              >
                <GrFormPrevious className="mystore__pagination_icon" />
              </button>
              <div>{pageNo}</div>
              <button
                style={{
                  cursor:
                    pageNo >= Math.ceil(filteredData.length / itemsPerPage)
                      ? "not-allowed"
                      : "pointer",
                }}
                onClick={handleNextPage}
                disabled={
                  pageNo >= Math.ceil(filteredData.length / itemsPerPage)
                }
                className="mystore__pagination-btn"
              >
                <GrFormNext className="mystore__pagination_icon" />
              </button>
            </div>
          </div>
        </div>
      <StoreFooter />
    </div>
      )}
    </>
  );
};
