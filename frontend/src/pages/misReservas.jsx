import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../styles/components/pages/misReservas.css";


const MisReservas = () => {


    const { id } = useParams();

    const [reservas, setReservas] = useState([]);

    useEffect(() => {
        const fetchMisReservas = async () => {
            try {
                const response = await fetch(`http://localhost:3000/misreservas/${id}`, {
                    method: "GET",
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setReservas(data || []);
                }
            }
            catch{
                console.error("Error de red al obtener mis reservas");
            }
        };

        fetchMisReservas();
    }, [id]);

    return (
        <div> 
            <div id="h1wapo"><h1>Mis Reservas</h1></div>
            {reservas.length === 0 ? (
                <p>No tienes reservas.</p>
            ) : (
                <ul id="misReservas">
                    {reservas.map((reserva) => (
                        <li key={reserva.id_turno}>
                            <p><strong>Servicio:</strong> {reserva.nombre}</p> <br />
                            <p><strong>Fecha:</strong> {new Date(reserva.fecha).toLocaleDateString()}</p> <br />
                            <p><strong>Hora:</strong> {reserva.hora}</p> <br />
                            <button id="botonreserva">
                                Cancelar reserva    
                            </button>   
                        </li>
                    ))}
                </ul>
            )}   

        </div>
    );
};

export default MisReservas;