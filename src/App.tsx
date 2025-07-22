import { lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import { useAuth } from "./Components/Auth/AuthContext";
import Loader from "./Components/Loader/Loader";
import './main.css'
import useMystoreStore from './Components/Store/Core/Store';

// Lazy load all major components
const MyStore = lazy(() => import("./Components/Store/MyStore"));
const Auth = lazy(() => import("./Components/Auth/Auth"));
const SingleProductView = lazy(() => import("./Components/Store/Molecules/SigleViewPage"));
const Billing = lazy(() => import("./Components/Billing/Billing"));
const Login = lazy(() => import("./Components/Auth/Login/Login"));
const Register = lazy(() => import("./Components/Auth/Register/Register"));
const OtpPage = lazy(() => import("./Components/Auth/Otp/Otp"));
const RefundAndCancellationPolicy = lazy(() => import("./Components/Footer/RefundAndCancellationPolicy"));

function App() {
  const { isAuthenticated } = useAuth() || {};
  const { storeIconsLoader } = useMystoreStore((s) => s);

  // Show loader immediately if store is loading or undefined
  if (storeIconsLoader === undefined || storeIconsLoader) {
    return <Loader/>;
  }
  
  return (
    <>
      <Router>
        <Suspense fallback={<Loader />}>
          <Routes>
            {isAuthenticated ? (
              <>
                <Route path="/" element={<MyStore />} />
                <Route path="/*" element={<Auth />} />
                <Route path="/login" element={<Navigate to={"/"} />} />
                <Route path="/details/:id" element={<SingleProductView />} />
                <Route path="/billing" element={<Billing />} />
                <Route path="/upgrade-plan" element={<Billing />} />
                <Route path="/upgrade-plan/:id" element={<Billing />} />
                <Route
                  path="/refund-cancellation-policy"
                  element={<RefundAndCancellationPolicy />}
                />
              </>
            ) : (
              <>
                <Route path="/details/:id" element={<SingleProductView />} />
                <Route path="/billing" element={<Billing />} />
                <Route path="/upgrade-plan" element={<Billing />} />
                <Route path="/upgrade-plan/:id" element={<Billing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/otp" element={<OtpPage />} />
                <Route
                  path="/refund-cancellation-policy"
                  element={<RefundAndCancellationPolicy />}
                />
                <Route path="/" element={<MyStore />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </>
            )}
          </Routes>
        </Suspense>
      </Router>
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
}

export default App;