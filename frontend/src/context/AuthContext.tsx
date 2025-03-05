import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import Cookies from "js-cookie";
import userService from "../services/user-service";

interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the AuthProvider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);  
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    if (token) {
      setIsAuthenticated(true);
      userService.getUserData().then(setUser).catch(() => {
        setIsAuthenticated(false);
        setUser(null);
      });
    }
  }, []);

  // Authenticate user on login
  const login = (accessToken: string, refreshToken: string) => {
    Cookies.set("accessToken", accessToken, { secure: true, sameSite: 'strict' });
    Cookies.set("refreshToken", refreshToken, { secure: true, sameSite: 'strict' });
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
    <AuthContext.Provider value={{ isAuthenticated, user, setUser, login, logout }}>
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