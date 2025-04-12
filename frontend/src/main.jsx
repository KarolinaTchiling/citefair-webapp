import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./input.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SelectedFileProvider } from "./contexts/SelectedFileContext";


createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <AuthProvider>
      <SelectedFileProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      </SelectedFileProvider>
    </AuthProvider>
  // </StrictMode> 
);

