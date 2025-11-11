import React, { useState, useRef, useEffect, useCallback } from "react";
import "../../styles/components/layout/hamburguesa.css";
import { useNavigate } from "react-router-dom";

const HamburgerMenu = ({ avatarSrc = "/vite.svg" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  // <- MANTENIDO: tu lógica de logout exactamente como la compartiste
  const handleLogout = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/logout", {
        // <- ajustar ruta si tu backend usa /logout
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        // opcional: obtener mensaje de error del backend
        const errBody = await response.json().catch(() => null);
        console.error("Logout failed:", errBody ?? response.statusText);
        // podés mostrar un toast aquí si tenés sistema de notificaciones
        return;
      }

      // Si usás el checkbox para el menú, cerrarlo (si existe)
      const cb = document.getElementById("menu-toggle");
      if (cb && cb.checked) cb.checked = false;

      // usar navigate para ser más "React"
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }, [navigate]);

  // Cierra el menú si se hace click fuera o se presiona Escape
  useEffect(() => {
    function handleOutside(e) {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    }

    function handleKey(e) {
      if (e.key === "Escape") setIsOpen(false);
    }

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  return (
    <div className="hamburger-wrapper" aria-live="polite">
      {/* Avatar / disparador */}
      <button
        ref={buttonRef}
        className="avatar-btn"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls="user-menu"
        onClick={() => setIsOpen((v) => !v)}
        title="Abrir menú"
      >
        <img src={avatarSrc} alt="Usuario" />
      </button>

      {/* Backdrop (cierra al tocar) */}
      {isOpen && (
        <div className="menu-backdrop" onClick={() => setIsOpen(false)} />
      )}

      {/* Menú desplegable */}
      <nav
        id="user-menu"
        ref={menuRef}
        className={`nav ${isOpen ? "open" : ""}`}
        role="menu"
        aria-label="Menú de usuario"
      >
        <ul>
          <li role="menuitem">
            <a href="/perfil">Perfil</a>
          </li>
          <li role="menuitem">
            <a href="/reservas">Reservas</a>
          </li>
          <li role="menuitem">
            <button onClick={handleLogout} className="logout-btn">
              Cerrar sesión
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default HamburgerMenu;
