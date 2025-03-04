import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import MainPage from "./MainPage";
import Login from "./Login";
import Signup from "./Signup";
import Profile from "./Profile";
import { AuthProvider, useAuth } from "../context/AuthContext";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<RequireAuth><MainPage /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />       
        </Routes>
      </Router>
    </AuthProvider>    
  );
};

const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default App;