import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import StrategyMarkets from "./pages/StrategyMarkets";
import Dashboards from "./pages/Dashboards";
import BtStudio from "./pages/BtStudio";
import Header from "./components/Header";

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/strategy-markets" element={<StrategyMarkets />} />
        <Route path="/dashboards" element={<Dashboards />} />
        <Route path="/bt-studio" element={<BtStudio />} />
      </Routes>
    </Router>
  );
};

export default App;
