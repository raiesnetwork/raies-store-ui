import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Auth from "./Components/Auth/Auth";
import { MyStore } from "./Components/Store/MyStore";
import useMystoreStore from "./Components/Store/Core/Store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.scss";
import { useAuth } from "./Components/Auth/AuthContext";
import SingleProductView from "./Components/Store/Molecules/SigleViewPage";
import { Login } from "./Components/Auth/Login/Login";
import { Register } from "./Components/Auth/Register/Register";
import { OtpPage } from "./Components/Auth/Otp/Otp";
import RefundAndCancellationPolicy from "./Components/Footer/RefundAndCancellationPolicy";



function App() {
  
  const { storeIconsLoader } = useMystoreStore((s) => s);

  if (storeIconsLoader) {
    // Show loader while data is being fetched
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <div className="loader">Loading...</div>
      </div>
    );
  }
  const { isAuthenticated } = useAuth() || {};
  
  return (
    <>
      <Router>
        <Routes>
          {isAuthenticated ? (
            <>
              <Route path="/" element={<MyStore />} />
              <Route path="/*" element={<Auth />} />
              <Route path="/login" element={<Navigate to={"/"} />} />
            </>
          ) : (
            <>
              <Route path="/details/:id" element={<SingleProductView />} />

              <Route path="/login" element={<Login></Login>} />
              <Route path="/register" element={<Register></Register>} />
              <Route path="/otp" element={<OtpPage></OtpPage>} />
              <Route
                path="/refund-cancellation-policy"
                element={<RefundAndCancellationPolicy />}
              />
              <Route path="/" element={<MyStore />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}

          {/* Define different routes for your application */}
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
