import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./Components/Auth/Auth";
import { MyStore } from "./Components/Store/MyStore";
import { useEffect } from "react";
import useMystoreStore from "./Components/Store/Core/Store";
import { getSubdomain } from "./Utils/Subdomain";
const { hostname } = window.location
let hostName = getSubdomain(hostname)
function App() {
  const { getStoreIconAndName, setStoreIconRefresh } = useMystoreStore((s) => s)
  useEffect(() => {
    const apiHelper = async () => {
      const Data = await getStoreIconAndName(hostName)
      console.log(Data.data);

      if (Data.error) {
        localStorage.setItem('store-data', JSON.stringify({
          storeName: "",
          storeIcon: "",
          storeBanner: ""
        }))

      } else {
        localStorage.setItem('store-data', JSON.stringify(Data?.data));
        setStoreIconRefresh()
      }
    }
    apiHelper()
  }, [])
  return (
    <Router>
      <Auth>
        <Routes>
          {/* Define different routes for your application */}
          <Route path="/" element={<MyStore />} />

        </Routes>
      </Auth>
    </Router>
  );
}

export default App;
