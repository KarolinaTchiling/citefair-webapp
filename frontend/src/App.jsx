import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import DashBoardPage from './pages/DashboardPage';
import LandingPage from './pages/LandingPage';
import StatementPage from './pages/StatementPage';
import RecommendedPage from './pages/RecommendedPage';
import LoginPage from './pages/LoginPage';
import ResultsPage from './pages/ResultsPage';
import ReferenceListPage from './pages/ReferenceListPage';
import SaveGuestPage from './pages/SaveGuestPage';
import NotFound from './pages/NotFoundPage';
import './input.css';
import { useAuth } from "./contexts/AuthContext";
import { Toaster } from 'react-hot-toast';

function App() {
  const { isAuthenticated, user } = useAuth();

  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/" replace />;
  };

  const UserProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/" replace />;
    }
    if (user.isAnonymous) {
      return <Navigate to="/save-guest" replace />;
    }
    return children;
  };

  const GuestProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/" replace />;
    }
    if (!user.isAnonymous) {
      return <Navigate to="/dashboard" replace />;
    }
    return children;
  };
  
  
  return (
    <div>
      <Toaster position="bottom-right" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFound />} />


        <Route
          path="/dashboard"
          element={
            <UserProtectedRoute>
              <DashBoardPage />
            </UserProtectedRoute>
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
          path="/recommended"
          element={
            <PrivateRoute>
              <RecommendedPage />
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
            <GuestProtectedRoute>
              <SaveGuestPage />
            </GuestProtectedRoute>
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

