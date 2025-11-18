import '../../styles/components/layout/header.css'
import { Link, useNavigate } from 'react-router-dom';
import HamburgerMenu from './hamburguesa.jsx';

import { useEffect, useState } from "react";

const Header = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchSessionUser = async () => {
      try {
        const response = await fetch("http://localhost:3000/getSessionUser", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Error al obtener el usuario de sesión:", error);
      }
    };

    fetchSessionUser();
  }, []);

  const [modoOscuro, setModoOscuro] = useState(() => {
    const saved = localStorage.getItem("mode");
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
  });
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const body = document.body;
    body.classList.add("light-mode");
    body.classList.toggle("dark-mode", modoOscuro);
    localStorage.setItem("mode", JSON.stringify(modoOscuro));
  }, [modoOscuro]);

  const toggleModoOscuro = () => setModoOscuro(v => !v);

  return (
    <header className="topbar">
      <div className="logo">
        <Link className='linklogo' to="/inicio"><img src="/logo.jpg" alt="Logo" /></Link>
      </div>

      <div className="divInicio">
        <p>Hola {user ? user.nombre : "Invitado"}</p>
      </div>

      <button
      className="toggle-mode"
      type="button"
      onClick={toggleModoOscuro}
      aria-pressed={modoOscuro}
      aria-label={modoOscuro ? "Cambiar a modo claro (Alt+D)" : "Cambiar a modo oscuro (Alt+D)"}
      title={modoOscuro ? "Modo oscuro activo — Alt+D" : "Modo claro activo — Alt+D"}
      >
      {modoOscuro ? "🌙 Dark" : "☀️ Light"}
      </button>
      <HamburgerMenu />

    </header>
  );
}

export default Header;
