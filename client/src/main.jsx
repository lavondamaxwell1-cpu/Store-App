import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import CartProvider from "./context/CartProvider";
import AuthProvider from "./context/AuthProvider";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <App />

        <Toaster
          position="top-center"
          toastOptions={{
            duration: 2500,
            style: {
              borderRadius: "999px",
              background: "#020617",
              color: "#fff",
              padding: "12px 18px",
              fontSize: "14px",
              fontWeight: "600",
            },
          }}
        />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
);
