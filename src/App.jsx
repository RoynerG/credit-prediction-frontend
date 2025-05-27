import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import PredictionForm from "./components/PredictionForm";
import ResultPage from "./components/ResultPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/form" element={<PredictionForm />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </Router>
  );
}
