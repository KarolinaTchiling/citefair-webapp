import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./input.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./AuthContext";


createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  // </StrictMode> 
);

