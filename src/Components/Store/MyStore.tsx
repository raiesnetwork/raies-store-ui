import React, { useEffect, useState } from "react";
import useMystoreStore from "./Core/Store";
import { respProduct } from "./Core/Interfaces";
import ProductViewCard from "./Molecules/ProductCard";
import Header from "./Molecules/Header";
import "react-toastify/dist/ReactToastify.css";
import { getSubdomain } from "../../Utils/Subdomain";
import ClipLoader from "react-spinners/ClipLoader"; // Spinner import
import "./Helpers/scss/mystore.scss"; // Import your custom styles

const { hostname } = window.location;
// eslint-disable-next-line prefer-const
let subdomain = getSubdomain(hostname);

export const MyStore: React.FC = () => {
  const {
    FetchToCart,
    // getAllProduct,
    AllProducts,
    setHomeLoader,
    homeLoader,
    logedIn,
    latestProduct,
    setUserName,
  } = useMystoreStore((state) => state);

  const [data, setData] = useState<respProduct[]>(AllProducts);
  const [filter, setFilter] = useState<string>("All");
const [loaded,setLoaded]=useState<boolean>(false)
  useEffect(() => {
    if (AllProducts.length > 0) {
      setData(AllProducts);
      setHomeLoader(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [AllProducts]);

  useEffect(() => {
    if (logedIn) {
      
      const name = localStorage.getItem("suname");
      setUserName(name);
    }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logedIn]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoaded(true)
      setHomeLoader(true);
        FetchToCart();
        await latestProduct(subdomain);
      }
      setHomeLoader(false);
    

    if (subdomain&&loaded===false) {
      fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subdomain]);

  useEffect(() => {
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
        <div className="mystore__spinner-container">
          <ClipLoader size={50} color={"#123abc"} loading={homeLoader} />
        </div>
      ) : (
        <>
          <div className="mystore">
          <div className="myStore__banner"
            >
              <img src="/media/nike banner.png"className="mystore__banner_img" alt="" />
            </div>
            <div className="mystore__category_container"
            >
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="mystore__select_category"

              >
                <option value="All">All</option>
                <option value="free">Free</option>
                <option value="Price">Price</option>
                <option value="Bidding">Bidding</option>
                <option value="Barter">Barter</option>
              </select>
            </div>

         
            <div className="mystore__products_sec">
              {data?.length > 0 ? (
                data?.map((val) =>
                  !val.flag ? <ProductViewCard key={val.id} data={val} /> : null
                )
              ) : (
                <div className="mystore__empty_msg">Store is empty</div>
              )}
            </div>


          </div>

        </>
      )}
    </>
  );
};
