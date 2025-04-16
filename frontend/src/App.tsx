import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import MainPage from "./pages/MainPage";
import NavigationBar from './components/Navbar'; 
import Trips from './pages/Trips';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import { AuthProvider, useAuth } from "./context/AuthContext";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <ConditionalNavbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<RequireAuth><MainPage /></RequireAuth>} />
          <Route path="/profile/:userId" element={<RequireAuth><Profile /></RequireAuth>} />
          <Route path="/trips" element={<RequireAuth><Trips /></RequireAuth>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

// Component to conditionally render the Navbar
const ConditionalNavbar: React.FC = () => {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/signup"]; // Routes where the Navbar should not appear

  // Check if the current route is in the list of routes to hide the Navbar
  if (hideNavbarRoutes.includes(location.pathname)) {
    return null;
  }

  return <NavigationBar />;
};

// Authentication wrapper
const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default App;