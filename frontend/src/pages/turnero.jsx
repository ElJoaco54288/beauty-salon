import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const Turnero = ()=> {

    const { id } = useParams();

    const [usuarioId, setUsuarioId] = useState(null);
    const [trabajadorNombre, setTrabajadorNombre] = useState("");

    const diasSemana = ["LUN", "MAR", "MIER", "JUE", "VIE", "SAB", "DOM"];

    const [startDate, setStartDate] = useState(new Date());
    const [diaSeleccionado, setDiaSeleccionado] = useState(0);
    const [horarios, setHorarios] = useState({
        Mañana: [],
        Tarde: [],
        Noche: [],
    });

    const cambiarSemana = (cantidadDias) => {
        const nuevaFecha = new Date(startDate);
        nuevaFecha.setDate(nuevaFecha.getDate() + cantidadDias);
        setStartDate(nuevaFecha);
    };

    const getFechaFormateada = (offset) => {
        const fecha = new Date(startDate);
        fecha.setDate(fecha.getDate() + offset);
        return `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;
    };

    const handleDiaClick = (index) => {
        setDiaSeleccionado(index);
    };

    const getDiasRotados = () => {
        const diaInicio = (startDate.getDay() + 6) % 7;
        return [...diasSemana.slice(diaInicio), ...diasSemana.slice(0, diaInicio)];
    };

    useEffect(() => {
        const fetchUsuarioId = async () => {
            try {
                const response = await fetch("http://localhost:3000/getSessionUser", {
                    method: "GET",
                    credentials: "include",
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsuarioId(data.user.id_usuario);
                }
            } catch (error) {
                console.error("Error al obtener el ID del usuario de sesión:", error);
            }
        };

        fetchUsuarioId();
    }, []);

    useEffect(() => {

        const fetchHorarios = async () => {
            // const fecha = new Date(startDate);
            // fecha.setDate(fecha.getDate() + diaSeleccionado);
            // const fechaISO = fecha.toISOString().split("T")[0];

            try {
                const response = await fetch(`http://localhost:3000/turnero/${id}`, {
                    method: "GET"
                });
                if (!response.ok) {
                    throw new Error("Error al obtener horarios");
                }
                const data = await response.json();
                setHorarios(data);
            } catch (error) {
                console.error("Error al traer horarios:", error);
                setHorarios({
                    Mañana: [],
                    Tarde: [],
                    Noche: [],
                });
            }
        };

        fetchHorarios();
    }, [startDate, diaSeleccionado, id]);

    useEffect(() => { 
        const fetchTrabajadorNombre = async () => {
            try {
                const response = await fetch(`http://localhost:3000/getWorkerById/${id}`, {
                    method: "GET"
                });
                if (response.ok) {
                    const data = await response.json();
                    setTrabajadorNombre(data.worker[0].nombre);
                }
            } catch (error) {
                console.error("Error al obtener el nombre del trabajador:", error);
            }
        };

        fetchTrabajadorNombre();
    }, [id]);

    const reservarTurno = async (hora) => {
        const fecha = new Date(startDate);
        fecha.setDate(fecha.getDate() + diaSeleccionado);
        const fechaISO = fecha.toISOString().split("T")[0];
        try {
            const response = await fetch("http://localhost:3000/reservar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: usuarioId,
                    fecha: fechaISO,
                    hora: hora
                }),
            });
            if (!response.ok) {
                throw new Error("No se pudo reservar el turno");
            }
            await response.json();
            alert("Turno reservado con éxito");
            // fetchHorarios(); // 🔄 recargar horarios actualizados
        } catch (error) {
            console.error("Error al reservar turno:", error);
        }
    };

    return(
        <div className="turnero-container">
            <h2 className="turnero-title">Seleccioná tu turno con {trabajadorNombre}</h2>
            <div className="flechas-container">
                <button className="flecha-button" onClick={() => cambiarSemana(-7)}>← Semana anterior</button>
                <button className="flecha-button" onClick={() => cambiarSemana(7)}>Semana siguiente →</button>
            </div>
            <div className="dias-container">
                {getDiasRotados().map((dia, index) => (
                    <button
                        key={dia}
                        className={`dia-button ${index === diaSeleccionado ? "selected" : ""}`}
                        onClick={() => handleDiaClick(index)}
                    >
                        {dia} <br />
                        {getFechaFormateada(index)}
                    </button>
                ))}
            </div>
            <div className="horarios-container">
                {Object.entries(horarios).map(([momento, listaHorarios]) => (
                    <div key={momento} className="momento-section">
                        <h2>{momento}</h2>
                        {listaHorarios.length > 0 ? (
                            <div className="horarios-list"> 
                                {listaHorarios.map((hora) => (
                                    <button
                                        key={hora}
                                        className="horario-button"
                                        onClick={() => reservarTurno(hora)}
                                    >
                                        {hora}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <p className="no-disponible">Sin horarios disponibles</p>
                        )}
                    </div>
                ))}
            </div>
        </div>  
    );
}

export default Turnero;

// import { useState, useEffect } from "react";
// import "./home.css";

// const diasSemana = ["LUN", "MAR", "MIER", "JUE", "VIE", "SAB", "DOM"];

// const Turnero = () => {
//   const [startDate, setStartDate] = useState(new Date());
//   const [diaSeleccionado, setDiaSeleccionado] = useState(0);
//   const [horarios, setHorarios] = useState({
//     Mañana: [],
//     Tarde: [],
//     Noche: [],
//   });

//   const cambiarSemana = (cantidadDias) => {
//     const nuevaFecha = new Date(startDate);
//     nuevaFecha.setDate(nuevaFecha.getDate() + cantidadDias);
//     setStartDate(nuevaFecha);
//   };

//   const getFechaFormateada = (offset) => {
//     const fecha = new Date(startDate);
//     fecha.setDate(fecha.getDate() + offset);
//     return `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}`;
//   };

//   const handleDiaClick = (index) => {
//     setDiaSeleccionado(index);
//   };

//   const getDiasRotados = () => {
//     const diaInicio = (startDate.getDay() + 6) % 7;
//     return [...diasSemana.slice(diaInicio), ...diasSemana.slice(0, diaInicio)];
//   };

//   // 🔥 Sacamos esta función afuera para poder usarla también desde reservarTurno
//   const fetchHorarios = async () => {
//     const fecha = new Date(startDate);
//     fecha.setDate(fecha.getDate() + diaSeleccionado);

//     const fechaISO = fecha.toISOString().split("T")[0];

//     try {
//       const response = await fetch(`http://localhost:3000/home/${fechaISO}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error("Error al obtener horarios");
//       }

//       const data = await response.json();
//       setHorarios(data);

//     } catch (error) {
//       console.error("Error al traer horarios:", error);
//       setHorarios({
//         Mañana: [],
//         Tarde: [],
//         Noche: [],
//       });
//     }
//   };

//   useEffect(() => {
//     fetchHorarios();
//   }, [startDate, diaSeleccionado]);

//   // función original bien puesta
//   const reservarTurno = async (hora) => {
//     const fecha = new Date(startDate);
//     fecha.setDate(fecha.getDate() + diaSeleccionado);

//     const fechaISO = fecha.toISOString().split("T")[0];

//     try {
//       const response = await fetch("http://localhost:3000/reservar", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         body: JSON.stringify({
//           fecha: fechaISO,
//           hora: hora
//         }),
//       });

//       if (!response.ok) {
//         throw new Error("No se pudo reservar el turno");
//       }

//       const data = await response.json();
//       alert("Turno reservado con éxito");
//       fetchHorarios(); // 🔄 recargar horarios actualizados

//     } catch (error) {
//       console.error("Error al reservar turno:", error);
//     }
//   };

//   return (
//     <div className="turnero-container">
//       <h2 className="turnero-title">Seleccioná tu turno</h2>

//       <div className="flechas-container">
//         <button className="flecha-button" onClick={() => cambiarSemana(-7)}>← Semana anterior</button>
//         <button className="flecha-button" onClick={() => cambiarSemana(7)}>Semana siguiente →</button>
//       </div>

//       <div className="dias-container">
//         {getDiasRotados().map((dia, index) => (
//           <button
//             key={dia}
//             className={`dia-button ${index === diaSeleccionado ? "selected" : ""}`}
//             onClick={() => handleDiaClick(index)}
//           >
//             {dia} <br />
//             {getFechaFormateada(index)}
//           </button>
//         ))}
//       </div>

//       <div className="horarios-container">
//         {Object.entries(horarios).map(([momento, listaHorarios]) => (
//           <div key={momento} className="momento-section">
//             <h2>{momento}</h2>
//             {listaHorarios.length > 0 ? (
//               <div className="horarios-list">
//                 {listaHorarios.map((hora) => (
//                   <button
//                     key={hora}
//                     className="horario-button"
//                     onClick={() => reservarTurno(hora)}
//                   >
//                     {hora}
//                   </button>
//                 ))}
//               </div>
//             ) : (
//               <p className="no-disponible">Sin horarios disponibles</p>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Turnero;
