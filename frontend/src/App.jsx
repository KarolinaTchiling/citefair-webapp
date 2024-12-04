import React, { useEffect, useState } from "react";
// import { Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route }  from 'react-router-dom';
import DashBoardPage from './pages/DashBoardPage';
import LandingPage from './pages/LandingPage';
import StatementPage from './pages/StatementPage';
import TestPage from './pages/TestPage';
import UploadPage from './pages/UploadPage';
import './input.css';

function App() {

  return (
    <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<DashBoardPage />} />
          <Route path="/statements" element={<StatementPage />} /> 
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/test" element={<TestPage />} />
        </Routes>
    </div>
  );
}

export default App;

