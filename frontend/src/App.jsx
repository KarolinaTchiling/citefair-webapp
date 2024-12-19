import React, { useEffect, useState } from "react";
// import { Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route }  from 'react-router-dom';
import DashBoardPage from './pages/DashBoardPage';
import LandingPage from './pages/LandingPage';
import StatementPage from './pages/StatementPage';
import TestPage from './pages/TestPage';
import GuestDashboardPage from './pages/GuestDashboard';
import './input.css';

function App() {

  return (
    <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashBoardPage />} />
          <Route path="/guest-dashboard" element={<GuestDashboardPage />} />
          <Route path="/statements" element={<StatementPage />} /> 
          <Route path="/test" element={<TestPage />} />
        </Routes>
    </div>
  );
}

export default App;

