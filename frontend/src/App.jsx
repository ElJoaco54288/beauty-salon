// src/App.jsx
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";
import Header from "./components/layout/header";
import './App.css'
import Catalogo from "./components/layout/catalogo";

export default function App() {
  return (
    <div className="app-root">
      <main className="main-area">
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/catalogo" element={<Catalogo />} />
        
        </Routes>
      </main>

    
    </div>
  );
}
