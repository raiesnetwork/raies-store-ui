import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./Components/Auth/Auth";
import { MyStore } from "./Components/Store/MyStore";
import { Login } from "./Components/Auth/Login/Login";

function App() {
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
