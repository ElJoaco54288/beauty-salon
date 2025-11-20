import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
            <h1>Mis Reservas</h1>
            {reservas.length === 0 ? (
                <p>No tienes reservas.</p>
            ) : (
                <ul>
                    {reservas.map((reserva) => (
                        <li key={reserva.id_turno}>
                            Servicio: {reserva.nombre} <br />
                            Fecha: {new Date(reserva.fecha).toLocaleDateString()} <br />
                            Hora: {reserva.hora} <br />
                            <button >
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