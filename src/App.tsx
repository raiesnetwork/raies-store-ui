import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./Components/Auth/Auth";
import { MyStore } from "./Components/Store/MyStore";
import { useEffect, useState } from "react";
import useMystoreStore from "./Components/Store/Core/Store";
import { getSubdomain } from "./Utils/Subdomain";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './App.scss'

const { hostname } = window.location;
let hostName = getSubdomain(hostname);

function App() {
  const { getStoreIconAndName } = useMystoreStore((s) => s);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const apiHelper = async () => {
      try {
        await getStoreIconAndName(hostName);
      } catch (error) {
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };
    apiHelper();
  }, [getStoreIconAndName, hostName]);

  if (loading) {
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

  return (
    <>
      <Router>
        <Auth>
          <Routes>
            {/* Define different routes for your application */}
            <Route path="/" element={<MyStore />} />
          </Routes>
        </Auth>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
