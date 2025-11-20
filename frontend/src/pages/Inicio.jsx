import { useEffect, useState } from "react";
import Header from "../components/layout/header";
import Catalogo from "../components/layout/catalogoPersonas";
import Hero from "../components/layout/hero";
import "../styles/components/pages/inicio.css";
import { useNavigate } from "react-router-dom";

const Inicio = () => {
  const [user, setUser] = useState(null);

  const [isWorker, setIsWorker] = useState(false);
  const navigate = useNavigate();

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

  useEffect(() => {
    console.log(user)
    if (user && user.rol === "trabajador") {
      setIsWorker(true);
    }
  }, [user]);

  function handleAdminAccess() {
    navigate("/adminCatalogo/" + user.id_usuario);
  }

  return (
    <div id="inicio">
      <Header />

      <Hero />

      <div id="inicioadmin">
        {isWorker && (
          <button onClick={handleAdminAccess}>
            Acceder al admin
          </button>
        )}
      </div>
      
      <Catalogo />
    </div>
  );
};

export default Inicio;
