// src/App.jsx
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import SignIn from "./pages/signin";
import SignUp from "./pages/signup";
import Footer from "./components/layout/footer";
import './App.css'
import Inicio from "./pages/Inicio";
import Servicios from "./pages/servicios";
import Turnero from "./pages/turnero";
import Admin from "./pages/admin";

//prueba para ingresar trabajador img: https://i.pinimg.com/736x/0a/b2/29/0ab2290b5905085e67f5f30658ac2caf.jpg

export default function App() {
  return (
    <div className="app-root">
      <main className="main-area">
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/servicios/:id" element={<Servicios />} />
          <Route path="/turnero/:id" element={<Turnero />} />
          <Route path="/admin/:id" element={< Admin/>} />
        
        </Routes>
        <Footer></Footer>
      </main>

    
    </div>
  );
}
