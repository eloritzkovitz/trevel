import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import MainPage from "./pages/MainPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import { AuthProvider, useAuth } from "./context/AuthContext";

const App: React.FC = () => {
  return (
    <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<RequireAuth><MainPage /></RequireAuth>} />
            <Route path="/profile/:userId" element={<RequireAuth><Profile /></RequireAuth>} />       
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