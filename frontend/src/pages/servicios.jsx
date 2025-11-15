import "../styles/components/layout/catalogoPersonas.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const Servicios = () => {

    const { id } = useParams();
  
    const [servicios, setServicios] = useState([]);

    useEffect(() => {
        const fetchServicios = async () => {
            try {
                const response = await fetch(`http://localhost:3000/workerServices/${id}`, {
                    method: "GET"
                });
                const data = await response.json();
                setServicios(data);
            } catch (error) {
                console.error("Error al obtener servicios:", error);
            }
        };
        fetchServicios();
    }, [id]);

    return(
        <div>
            <h1>Servicios del Trabajador {id}</h1>
            <div id="catalogo-wrap">
                {servicios.length === 0 ? (
                    <p>No hay servicios disponibles.</p>
                ) : (
                    <div className="catalogo-grid" id="catalogo">
                        {servicios.map((s, index) => (
                            <div className="card" key={index}>
                                <h2 className="titulo-card">{s.nombre || "—"}</h2>
                                <p className="precio-card">Precio: {s.precio ? `$${s.precio}` : "—"}</p>
                                <Link to={`/turnero/${s.id_usuario}`} className="card-link">
                                    Ver turnos
                                 </Link>
                                
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            
        </div>
    );
}

export default Servicios 

/*
<div className="card" key={keyId}>
                <h2 className="titulo-card">{t.nombre || "—"}</h2>
                <p className="precio-card"> Tel: {telefono ? telefono: "—"}</p>
                <form onSubmit={(e) => onSubmit(e, t)}>
                  <input type="submit" value="pedir servicio" />
                </form>
                div
*/