import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar: React.FC = () => (
  <nav className="navbar">
    <div className="navbar-logo">
      <Link to="/">SatMathWeb</Link>
    </div>
    <ul className="navbar-links">
      <li><Link to="/">Home</Link></li>
      <li><Link to="/about">About</Link></li>
      <li><Link to="/login">Login</Link></li>
      {/* Add more links as needed */}
    </ul>
  </nav>
);

export default Navbar;