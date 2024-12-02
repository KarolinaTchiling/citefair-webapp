import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./input.css";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./UserContext";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UserProvider>
  </StrictMode>
);

