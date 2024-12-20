import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  token: string;
  _id:string;
};

const AuthContext = createContext<{user: User | null; loading: boolean;login: (token: string, _id: string) => void;logout: () => void;}>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); 
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const _id = localStorage.getItem("_id");
    if (token && _id) setUser({ token, _id });
    setLoading(false);
  }, []);

  // Login function
  const login = (token: string, _id:string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("_id", _id);
    setUser({ token, _id });
    navigate("/profile");
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("_id");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export context and provider
export { AuthContext, AuthProvider };
