// src/App.jsx
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";
import Footer from "./components/layout/footer";
import './App.css'
import Inicio from "./pages/Inicio";

export default function App() {
  return (
    <div className="app-root">
      <main className="main-area">
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/inicio" element={<Inicio />} />
        
        </Routes>
        <Footer></Footer>
      </main>

    
    </div>
  );
}
