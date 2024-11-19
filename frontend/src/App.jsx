import "./App.css";
import React, { useEffect, useState } from "react";
// import { Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route }  from 'react-router-dom';
import MainPage from './pages/MainPage';
import LandingPage from './pages/LandingPage';
import StatementPage from './pages/StatementPage';

function App() {

  return (
    <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/statement" element={<StatementPage />} />
        </Routes>
    </div>
  );
}

export default App;

