import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Login from "./components/Login";
import { AuthProvider } from "./contexts/AuthContext";
import { initializeTheme } from "./utils/themeUtils";

const AppContent: React.FC = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        {/* Dashboard route removed */}
      </Routes>
    </>
  );
};

function App() {
  useEffect(() => {
    // Initialize theme system
    initializeTheme();
  }, []);

  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;