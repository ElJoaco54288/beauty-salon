import React, { useState, useRef, useEffect, useCallback } from "react";
import "../../styles/components/layout/hamburguesa.css";
import { useNavigate, Link } from "react-router-dom";

const HamburgerMenu = ({ avatarSrc = "/vite.svg" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchSessionUser = async () => {
      try {
        const response = await fetch("http://localhost:3000/getSessionUser", {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json()
          // puede venir null si no hay sesión
          setUser(data?.user ?? null);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error al obtener el usuario de sesión:", error);
        setUser(null);
      }
    };

    fetchSessionUser();
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => null);
        console.error("Logout failed:", errBody ?? response.statusText);
        return;
      }

      const cb = document.getElementById("menu-toggle");
      if (cb && cb.checked) cb.checked = false;

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }, [navigate]);

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

  const userId =
    user?.usuario_id ?? user?.id_usuario ?? user?.id ?? null;

  return (
    <div className="hamburger-wrapper" aria-live="polite">
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

      {isOpen && (
        <div className="menu-backdrop" onClick={() => setIsOpen(false)} />
      )}

      <nav
        id="user-menu"
        ref={menuRef}
        className={`nav ${isOpen ? "open" : ""}`}
        role="menu"
        aria-label="Menú de usuario"
      >
        <ul>
          <li role="menuitem">
            <Link to="/perfil">Perfil</Link>
          </li>
          <li role="menuitem">
            {user ? (
              <Link to={`/misreservas/${userId}`}>Reservas</Link>
            ) : (
              <a href="/" onClick={(e) => e.preventDefault()}>
                Reservas
              </a>
            )}
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
