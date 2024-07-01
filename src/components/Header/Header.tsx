import React from "react";
import { NavLink } from "react-router-dom";
import "./Header.css"; // Make sure to create and style this CSS file accordingly

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="logo">
        <NavLink to="/" end>
          <img src="/logo.svg" alt="corr.ai logo" />
        </NavLink>
      </div>
      <nav className="nav">
        <ul>
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/strategy-markets"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Strategy Markets
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboards"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Dashboards
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/bt-studio"
              className={({ isActive }) => (isActive ? "active-link" : "")}
            >
              Bt Studio
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
