import { useEffect, useState } from "react";
import Header from "../components/layout/header";

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
    <div>
      <Header />

      <div>Hola iniciaste {user ? user.username : "Invitado"}</div>
    </div>
  );
};

export default Inicio;
