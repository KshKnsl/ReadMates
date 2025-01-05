import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import './App.css'
import { Analytics } from "@vercel/analytics/react"

const clientId = import.meta.env.VITE_client_id|| "";
createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
    <Analytics/>
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
    </BrowserRouter>
);
