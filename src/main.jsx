import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
export const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter basename="/100096-dowell-customer-support/">
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>
);
