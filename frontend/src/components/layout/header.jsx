import '../../styles/components/layout/header.css'
import { Link, useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3000/logout', { // <- ajustar ruta si tu backend usa /logout
        method: 'POST',
        credentials: 'include'
      });

      if (!response.ok) {
        // opcional: obtener mensaje de error del backend
        const errBody = await response.json().catch(() => null);
        console.error('Logout failed:', errBody ?? response.statusText);
        // podés mostrar un toast aquí si tenés sistema de notificaciones
        return;
      }

      // Si usás el checkbox para el menú, cerrarlo (si existe)
      const cb = document.getElementById('menu-toggle');
      if (cb && cb.checked) cb.checked = false;

      // usar navigate para ser más "React"
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }, [navigate]);

  return (
    <header className="topbar">
      <div className="logo">
        <Link to="/">Beauty Salon</Link>
      </div>

      {/* Menu hamburguesa */}
      <input type="checkbox" id="menu-toggle" />
      <label htmlFor="menu-toggle" className="menu-icon" aria-hidden="true">&#9776;</label>

      <nav className="nav" aria-label="User menu">
        <ul>
          <li>
            <button
              onClick={handleLogout}
              style={{ cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
              aria-label="Cerrar sesión"
            >
              Cerrar sesión
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
