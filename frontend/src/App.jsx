import "./App.css";
import React, { useEffect, useState } from "react";
// import { Navigate } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route }  from 'react-router-dom';
import MainPage from './pages/MainPage';
import LandingPage from './pages/LandingPage';

function App() {

  return (
    <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/main" element={<MainPage />} />
        </Routes>
    </div>
  );
}

export default App;

