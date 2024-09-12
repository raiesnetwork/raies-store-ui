import React, { useEffect } from "react";
import useAuth from "./Core/Store";
import useMystoreStore from "../Store/Core/Store";
import { Navigate, Route, Routes } from "react-router-dom";
import StoreCart from "../Store/Molecules/Cart";
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
  }, []);

  return (
    <>
        <Routes>
      {logedIn === true && (
        <>
          <Route path="/cart" element={<StoreCart />} />
          <Route path="/details" element={<SingleProductView />} />
        </>
        )}
        <Route path="/*" element={<Navigate to='/'/>} />

        </Routes>

      {children}
    </>
  );
};

export default Auth;
