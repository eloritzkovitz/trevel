import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Cookies from "js-cookie";
import userService, { User } from "../services/user-service";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;  
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      userService
        .getUserData()
        .then((fetchedUser) => {
          setUser(fetchedUser);
          setIsAuthenticated(true);
        })
        .catch(() => {
          setIsAuthenticated(false);
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Authenticate user on login
  const login = (accessToken: string, refreshToken: string) => {
    Cookies.set("accessToken", accessToken, { expires: 7 }); 
    Cookies.set("refreshToken", refreshToken, { expires: 7 });
    setIsAuthenticated(true);
    userService.getUserData().then(setUser);
  };

  // Remove authentication on logout
  const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    setIsAuthenticated(false); 
    setUser(null);   
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }
  return context;
};