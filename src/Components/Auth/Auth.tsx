import React, { useEffect } from "react";
import useAuth from "./Core/Store";
import useMystoreStore from "../Store/Core/Store";
import { Navigate, Route, Routes } from "react-router-dom";
import StoreCart from "../Store/Molecules/Cart";
import ProductBuyingPage from "../Store/Molecules/BuyingPage";
import SuccessPage from "../Store/Molecules/CodSuccessPage";
import UserOrdersPage from "../Store/Molecules/Orders";
import SingleProductView from "../Store/Molecules/SigleViewPage";
import { Login } from "./Login/Login";
import { Register } from "./Register/Register";
import { OtpPage } from "./Otp/Otp";
import ProfilePage from "../Store/Molecules/ProfilePage";
import OrderDetails from "../Store/Molecules/OrderDetails";
import RefundAndCancellationPolicy from "../Footer/RefundAndCancellationPolicy";
const Auth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { AuthApiCall } = useAuth((state) => state);
  const { checkLoggedIn, logedIn } = useMystoreStore((s) => s);
  useEffect(() => {
    const apiHelper = async () => {
      const {data} = await AuthApiCall();
      checkLoggedIn(data);
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
            <Route path="/details/:id" element={<SingleProductView />} />
            <Route path="/buy" element={<ProductBuyingPage />} />
            <Route path="/login" element={<Navigate to='/'/>} />
            <Route path="/register" element={<Navigate to='/'/>} />
            <Route path="/otp" element={<Navigate to='/'/>} />
            <Route path="/profile" element={<ProfilePage/>} />
            <Route path="/orderdetails" element={<OrderDetails/>} />
            <Route path="/refund-cancellation-policy" element={<RefundAndCancellationPolicy/>}/>

          </>
        )}
        <Route path="/details/:id" element={<SingleProductView />} />
        <Route path="/order" element={<Navigate to='/login'/>} />
        <Route path="/cart" element={<Navigate to='/login'/>} />
        <Route path="/success" element={<Navigate to='/login'/>} />
        <Route path="/orders" element={<Navigate to='/login'/>} />
        <Route path="/login" element={<Login></Login>}/>
        <Route path="/register" element={<Register></Register>}/>
        <Route path="/otp" element={<OtpPage></OtpPage>}/>
        <Route path="/refund-cancellation-policy" element={<RefundAndCancellationPolicy/>}/>

        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>

      {children}
    </>
  );
};

export default Auth;
