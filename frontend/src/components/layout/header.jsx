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


  return (
    <header className="topbar">
      <div className="logo">
        <Link className='linklogo' to="/inicio"><img src="/logo.jpg" alt="Logo" /></Link>
      </div>

      <div className="divInicio">
        <p>Hola {user ? user.nombre : "Invitado"}</p>
      </div>
      

      <HamburgerMenu />

    </header>
  );
}

export default Header;
