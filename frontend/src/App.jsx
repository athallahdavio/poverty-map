import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import MapPage from "./Pages/MapPage";
import ProvinceChartPage from "./Pages/ProvinceChartPage";
import RegencyChartPage from "./Pages/RegencyChartPage";
import DataPage from "./Pages/DataPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/province-chart" element={<ProvinceChartPage />} />
        <Route path="/regency-chart" element={<RegencyChartPage />} />
        <Route path="/data" element={<DataPage />} />
      </Routes>
    </Router>
  );
}

export default App;