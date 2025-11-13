// src/components/catalogoPersonas/catalogoPersonas.jsx
import { useEffect, useState } from "react";
import "../../styles/components/layout/catalogoPersonas.css";
import { Link } from "react-router-dom";

const API_BASE = "http://localhost:3000"; // ajustá si tu backend corre en otro puerto
const WORKERS_ENDPOINT = `${API_BASE}/workers`;

const Catalogo = () => {
  const [trabajadores, setTrabajadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrabajadores = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(WORKERS_ENDPOINT, {
          method: "GET"
          // sin credentials según pediste
        });

        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          data = { raw: text };
        }

        if (!response.ok) {
          const serverMsg = data?.message || data?.error || data?.raw || response.statusText;
          throw new Error(`Server ${response.status}: ${serverMsg}`);
        }

        // Aseguramos que sea array
        if (!Array.isArray(data)) {
          console.warn("Respuesta /workers no es array:", data);
          setTrabajadores([]);
        } else {
          setTrabajadores(data);
        }
      } catch (err) {
        console.error("Error al obtener trabajadores:", err);
        setError(err.message || "No se pudieron cargar los trabajadores");
      } finally {
        setLoading(false);
      }
    };

    fetchTrabajadores();
  }, []);

  if (loading) return <p>Cargando catálogo...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div id="catalogo-wrap">
      <div className="catalogo-grid" id="catalogo">
        {trabajadores.length === 0 ? (
          <p>No hay trabajadores disponibles.</p>
        ) : (
          trabajadores.map((t, index) => {
            const keyId = t.id_usuario ?? t.id ?? index;
            const img = t.imagen_url || t.image || "/vite.svg";
            const telefono = t.telefono || t.contact || "—";

            return (
              <div className="card" key={keyId}>
                <img
                  className="img-card"
                  src={img}
                  alt={t.nombre || "trabajador"}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/vite.svg";
                  }}
                />
                <h2 className="titulo-card">{t.nombre || "—"}</h2>
                <p className="precio-card"> Tel: {telefono ? telefono: "—"}</p>

                <Link to={`/servicios/${t.id_usuario}`}>
                  <button type="button">Ver Información</button>
                </Link>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Catalogo;
