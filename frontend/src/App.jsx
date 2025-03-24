import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import DashBoardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import StatementPage from './pages/StatementPage';
import RelatedPage from './pages/RelatedPage';
import LoginPage from './pages/LoginPage';
import ResultsPage from './pages/ResultsPage';
import ReferenceListPage from './pages/ReferenceListPage';
import SaveGuestPage from './pages/SaveGuestPage';
import './input.css';
import { useAuth } from "./AuthContext";

function App() {
  const { isAuthenticated } = useAuth();

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/" replace />;
  };
  

  return (
    <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />


        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashBoardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/statements"
          element={
            <PrivateRoute>
              <StatementPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/related"
          element={
            <PrivateRoute>
              <RelatedPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/reference-list"
          element={
            <PrivateRoute>
              <ReferenceListPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/save-guest"
          element={
            <PrivateRoute>
              <SaveGuestPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/results"
          element={
            <PrivateRoute>
              <ResultsPage />
            </PrivateRoute>
          }
        />
        </Routes>
    </div>
  );
}

export default App;

