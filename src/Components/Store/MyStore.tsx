import React, { useEffect, useState } from "react";
import useMystoreStore from "./Core/Store";
import { respProduct } from "./Core/Interfaces";
import ProductViewCard from "./Molecules/ProductCard";
import Header from "./Molecules/Header";
import { getSubdomain } from "../../Utils/Subdomain";
import ClipLoader from "react-spinners/ClipLoader";
import "./Helpers/scss/mystore.scss";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import StoreFooter from "../Footer/Footer";
const { hostname } = window.location;
let subdomain = getSubdomain(hostname);

export const MyStore: React.FC = () => {
  const {
    FetchToCart,
    AllProducts,
    setHomeLoader,
    homeLoader,
    logedIn,
    latestProduct,
    setUserName,
    storeData,
  } = useMystoreStore((state) => state);

  const [data, setData] = useState<respProduct[]>([]);
  const [filteredData, setFilteredData] = useState<respProduct[]>([]);
  const [filter, setFilter] = useState<string>("All");
  const [pageNo, setPageNo] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  // useEffect(()=>{
  //   const storedDataRaw = localStorage.getItem('store-data');
  //   const storedData = storedDataRaw ? JSON.parse(storedDataRaw) : null;
  //       setStoreIcon(storedData)
  // },[storeIconRefresh])
  // console.log("sttt",storeIconRefresh);

  useEffect(() => {
    if (AllProducts.length > 0) {
      setData(AllProducts);
      setHomeLoader(false);
    }
  }, [AllProducts]);

  useEffect(() => {
    if (logedIn) {
      const name = localStorage.getItem("suname");
      setUserName(name);
    }
  }, [logedIn]);

  useEffect(() => {
    const fetchProducts = async () => {
      setHomeLoader(true);
      FetchToCart();
      await latestProduct(subdomain, "");
      setHomeLoader(false);
    };

    if (subdomain) {
      fetchProducts();
    }
  }, [subdomain]);

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

  // Calculate the paginated data based on the current page and itemsPerPage
  const paginatedData = filteredData.slice(
    (pageNo - 1) * itemsPerPage,
    pageNo * itemsPerPage
  );

  // Function to go to the next page
  const handleNextPage = () => {
    if (pageNo < Math.ceil(filteredData.length / itemsPerPage)) {
      setPageNo((prevPage) => prevPage + 1);
    }
  };

  // Function to go to the previous page
  const handlePreviousPage = () => {
    if (pageNo > 1) {
      setPageNo((prevPage) => prevPage - 1);
    }
  };

  return (
    <>
      <Header />
      {homeLoader ? (
        <div className="mystore__spinner-container">
          <ClipLoader size={50} color={"#123abc"} loading={homeLoader} />
        </div>
      ) : (
        <>
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
                  !val.flag ? <ProductViewCard key={val.id} data={val} /> : null
                )
              ) : (
                <div className="mystore__empty_msg">Store is empty</div>
              )}
            </div>

            {/* Pagination Controls */}
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
          <StoreFooter/>
        </>
      )}
    </>
  );
};
