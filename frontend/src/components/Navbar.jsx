import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">💡</span>
          <span className="brand-title">EmprendeIdeas</span>
        </Link>
        <nav className="navbar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Inicio
          </NavLink>
          <NavLink
            to="/registro"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Registrar Idea
          </NavLink>
          <NavLink
            to="/lista"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            Consultar Ideas
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
