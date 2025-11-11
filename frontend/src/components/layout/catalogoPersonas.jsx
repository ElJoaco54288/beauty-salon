import { useEffect, useState } from "react";
import "../../styles/components/layout/catalogoPersonas.css";

const Catalogo = () => {
  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Llamar a la API que ejecuta WorkerFinder
  useEffect(() => {
    const fetchTrabajadores = async () => {
      try {
        const response = await fetch("http://localhost/getWorkerId", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error(`Error HTTP ${response.status}`);
        const data = await response.json();
        setTrabajadores(data);
      } catch (err) {
        console.error("Error al obtener trabajadores:", err);
        setError("No se pudieron cargar los trabajadores");
      } finally {
        setLoading(false);
      }
    };

    fetchTrabajadores();
  }, []);

  const onSubmit = (e, trabajador) => {
    e.preventDefault();
    console.log(`Contrataste el servicio de ${trabajador.nombre}`);
  };

  if (loading) return <p>Cargando catálogo...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div id="catalogo-wrap">
      <div className="catalogo-grid" id="catalogo">
        {trabajadores.map((t, index) => (
          <div className="card" key={index}>
            <img
              className="img-card"
              src={t.imagen_url || "/vite.svg"}
              alt={t.nombre}
              onError={(e) => {
                e.currentTarget.src = "/vite.svg"; // fallback si no carga la imagen
              }}
            />
            <h2 className="titulo-card">{t.nombre}</h2>
            <p className="precio-card">${t.precio || "—"}</p>

            <form onSubmit={(e) => onSubmit(e, t)}>
              <input type="submit" value="Pedir un turno" />
            </form>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalogo;
