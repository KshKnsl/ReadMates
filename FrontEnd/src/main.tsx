import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = import.meta.env.VITE_client_id|| "";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>
);
