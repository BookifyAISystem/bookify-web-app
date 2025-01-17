import React from "react";
import ReactDOM from "react-dom/client";
import RoutePath from "./routes/RoutePath.jsx";
import './index.css'
import { CookiesProvider } from "react-cookie";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CookiesProvider>
    <RoutePath/>
    </CookiesProvider>
  </React.StrictMode>
);
