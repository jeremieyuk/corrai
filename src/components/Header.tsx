import React from "react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/strategy-markets">Strategy Markets</Link>
          </li>
          <li>
            <Link to="/dashboards">Dashboards</Link>
          </li>
          <li>
            <Link to="/bt-studio">Bt Studio</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
