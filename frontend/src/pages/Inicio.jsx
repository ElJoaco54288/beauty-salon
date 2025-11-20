import { useEffect, useState } from "react";
import Header from "../components/layout/header";
import Catalogo from "../components/layout/catalogoPersonas";
import Hero from "../components/layout/hero";
import "../styles/components/pages/inicio.css";

const Inicio = () => {
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
    <div id="inicio">
      <Header />

      <Hero />

      <div id="inicioadmin">
        <button>Acceder al admin </button>
      </div>
      
      <Catalogo />
    </div>
  );
};

export default Inicio;
