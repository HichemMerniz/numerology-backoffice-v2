import { createContext, useState, useEffect, ReactNode, useContext } from "react";
import {jwtDecode} from "jwt-decode";
import { useNavigate } from "react-router-dom"; // Add this import

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const navigate = useNavigate(); // Add this line

  // Check token expiration
  useEffect(() => {
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
          setToken(null);
          localStorage.removeItem("token");
          navigate("/login");
        }
      } catch (e) {
        setToken(null);
        localStorage.removeItem("token");
        navigate("/login");
      }
    }
  }, [token, navigate]);

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  const login = (newToken: string) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
    navigate("/login"); // Redirect on logout
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};