import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import MapPage from "./Pages/MapPage";
import ChartPage from "./Pages/ChartPage";
import DataPage from "./Pages/DataPage";
import LoginPage from "./Pages/LoginPage";
import AdminPage from "./Pages/AdminPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/chart" element={<ChartPage />} />
        <Route path="/data" element={<DataPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;