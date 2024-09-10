import React, { useEffect, useState } from "react";
import useMystoreStore from "./Core/Store";
import { respProduct } from "./Core/Interfaces";
import ProductViewCard from "./Molecules/ProductCard";
const {hostname}=window.location
export const MyStore:React.FC = () => {
 


  const { getAllProduct, AllProducts, setHomeLoader,homeLoader } =
    useMystoreStore((state) => state);
  const [data, setData] = useState<respProduct[]>(AllProducts);
  const [filter, setFilter] = useState<string>("All");
  
  setTimeout(() => {
    setHomeLoader(false)
  }, 18000);
  useEffect(() => {
    if (AllProducts) {
      
      
      setData(AllProducts);
    }
  }, [AllProducts]);
  
  useEffect(() => {
    const ApiHelper = async () => {
      getAllProduct(hostname);
    };
   if (hostname) {
    
     ApiHelper()
   }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hostname]);

  useEffect(() => {
    // Filter the products based on the selected filter
    let filteredData = AllProducts;
        if (filteredData.length>0) {
          
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
        if (AllProducts) {
          
          setData(filteredData);
        }
  }, [filter, AllProducts]);

  
  return (
    <>
    {
      homeLoader ?
      <><div style={{textAlign:"center"}}>Loading...</div></>
    :<>
      <div
      style={{
        padding: "15px",
        display:"flex",
        alignItems:"center",
        justifyContent:"flex-end"
      
      }}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "0px solid #ccc",
            fontSize: "16px",
            cursor:"pointer"

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
            !val.flag ? (
              
                <ProductViewCard
                key={val.id}
                 data={val}
                 
                />
            ) : null
          )
        ) : (
          <div
            style={{
              fontSize: "50px",
            }}
          >
            (Store is empty)
          </div>
        )}
      </div>
      </>
      }
    </>
  );
};


  

