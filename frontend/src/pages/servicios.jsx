import "../styles/components/layout/catalogoPersonas.css";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/layout/header";

const Servicios = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [servicios, setServicios] = useState([]);
  const [loadingService, setLoadingService] = useState(null); 

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await fetch(`http://localhost:3000/workerServices/${id}`, {
          method: "GET"
        });

        if (!response.ok) {
          console.error("Error HTTP al obtener servicios:", response.status);
          setServicios([]);
          return;
        }

        const data = await response.json();
        setServicios(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error al obtener servicios:", error);
        setServicios([]);
      }
    };
    if (id) fetchServicios();
  }, [id]);

  const handleGoToTurnero = async (serviceName) => {
    if (!id || !serviceName) return;
    try {
      setLoadingService(serviceName);
      const encodedName = encodeURIComponent(serviceName);
      const res = await fetch(`http://localhost:3000/serviceTurnero/${id}/${encodedName}`, {
        method: "GET"
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `Error ${res.status}`);
      }
      const body = await res.json();
      const serviceId = body.serviceId;
      if (!serviceId) throw new Error("No se obtuvo id_servicio");

      navigate(`/turnero/${serviceId}`);
    } catch (err) {
      console.error("No se pudo obtener id_servicio:", err);
      alert(err.message || "Error al abrir el turnero");
    } finally {
      setLoadingService(null);
    }
  };

  return (
    <div>
      <Header />
      <h1>Servicios del Trabajador {id}</h1>
      <div id="catalogo-wrap">
        {servicios.length === 0 ? (
          <p>No hay servicios disponibles.</p>
        ) : (
          <div className="catalogo-grid" id="catalogo">
            {servicios.map((s) => {
              const serviceName = s.nombre ?? s.name ?? s.servicio_nombre ?? "";

              return (
                <div className="card" key={s.id_servicio ?? serviceName}>
                  <h2 className="titulo-card">{serviceName || "—"}</h2>
                  <p className="precio-card">Precio: {s.precio ? `$${s.precio}` : "—"}</p>

                  <button
                    className="card-link"
                    onClick={() => handleGoToTurnero(serviceName)}
                    disabled={loadingService === serviceName}
                  >
                    {loadingService === serviceName ? "Abriendo..." : "Ver turnos"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Servicios;
