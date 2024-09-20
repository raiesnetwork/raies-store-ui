import React, { useEffect } from "react";
import useAuth from "./Core/Store";
import useMystoreStore from "../Store/Core/Store";
import { Navigate, Route, Routes } from "react-router-dom";
import StoreCart from "../Store/Molecules/Cart";
import ProductBuyingPage from "../Store/Molecules/BuyingPage";
import SuccessPage from "../Store/Molecules/CodSuccessPage";
import UserOrdersPage from "../Store/Molecules/Orders";
import SingleProductView from "../Store/Molecules/SigleViewPage";
const Auth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { AuthApiCall } = useAuth((s) => s);
  const { checkLoggedIn, logedIn } = useMystoreStore((s) => s);
  useEffect(() => {
    const apiHelper = async () => {
      const Data = await AuthApiCall();
      checkLoggedIn(Data.data);
    };
    apiHelper();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Routes>
        {logedIn === true && (
          <>
            <Route path="/cart" element={<StoreCart />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/orders" element={<UserOrdersPage />} />
            <Route path="/details" element={<SingleProductView />} />
            <Route path="/buy" element={<ProductBuyingPage />} />
          </>
        )}
        <Route path="/details" element={<SingleProductView />} />

        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>

      {children}
    </>
  );
};

export default Auth;
