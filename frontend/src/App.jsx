// src/App.jsx
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import './App.css'

export default function App() {
  return (
    <div className="app-root">
      <header className="topbar">
        <div className="brand">MiEstetica</div>
        <nav className="nav">
          <Link to="/signin" className="nav-link">Iniciar sesión</Link>
          <Link to="/signup" className="nav-link">Registro</Link>
        </nav>
      </header>

      <main className="main-area">
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </main>

      <footer className="footer">© {new Date().getFullYear()} MiEstetica</footer>
    </div>
  );
}
