import { createContext, useContext, useState } from "react";
import api from "../api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("pfms_user")) || null
  );
  const [token, setToken] = useState(localStorage.getItem("pfms_token") || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (email, password) => {
    setLoading(true);
    setError("");
    
    try {
      const response = await api.post("/auth/login", { email, password });
      
      if (response.data?.token && response.data?.user) {
        const { token, user } = response.data;
        
        localStorage.setItem("pfms_token", token);
        localStorage.setItem("pfms_user", JSON.stringify(user));
        
        setToken(token);
        setUser(user);
        
        return true;
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Login failed";
      setError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError("");
    
    try {
      // First register the user
      await api.post("/auth/register", { name, email, password });
      
      // Then login to get token
      return await login(email, password);
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Registration failed";
      setError(errorMsg);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("pfms_user");
    localStorage.removeItem("pfms_token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
