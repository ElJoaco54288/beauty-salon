import { useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import '../styles/components/pages/turnero.css';

const diasSemana = ["LUN", "MAR", "MIER", "JUE", "VIE", "SAB", "DOM"];

const Turnero = () => {
  const { id } = useParams(); // aquí id = serviceId (id_servicio)

  const [usuarioId, setUsuarioId] = useState(null);
  const [trabajadorNombre, setTrabajadorNombre] = useState("");
  const [trabajadorId, setTrabajadorId] = useState(null);

  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    const dayIndex = (d.getDay() + 6) % 7; // 0 = lunes
    d.setDate(d.getDate() - dayIndex);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const [diaSeleccionado, setDiaSeleccionado] = useState(0); // 0..6
  const [horarios, setHorarios] = useState({ Mañana: [], Tarde: [], Noche: [] });
  const [loadingHorarios, setLoadingHorarios] = useState(false);

  // cambiar semana (suma días)
  const cambiarSemana = (cantidadDias) => {
    setStartDate((prev) => {
      const nueva = new Date(prev);
      nueva.setDate(nueva.getDate() + cantidadDias);
      nueva.setHours(0, 0, 0, 0);
      return nueva;
    });
    setDiaSeleccionado(0);
  };

  const getFechaFormateada = (offset) => {
    const fecha = new Date(startDate);
    fecha.setDate(fecha.getDate() + offset);
    const dd = fecha.getDate().toString().padStart(2, "0");
    const mm = (fecha.getMonth() + 1).toString().padStart(2, "0");
    return `${dd}/${mm}`;
  };

  const handleDiaClick = (index) => setDiaSeleccionado(index);

  // devuelve array [{ label, date, iso }]
  const getDiasRotados = useCallback(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const fecha = new Date(startDate);
      fecha.setDate(startDate.getDate() + i);
      fecha.setHours(0, 0, 0, 0);
      const iso = fecha.toISOString().split("T")[0];
      return {
        label: diasSemana[i],
        date: fecha,
        iso,
      };
    });
  }, [startDate]);

  // obtener usuario en sesión (id)
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:3000/getSessionUser", {
          method: "GET",
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUsuarioId(data.user?.id_usuario ?? null);
        } else {
          setUsuarioId(null);
        }
      } catch (err) {
        console.error("Error al obtener usuario:", err);
        setUsuarioId(null);
      }
    })();
  }, []);

  // --- NUEVO: obtener información del servicio (y del trabajador relacionado) ---
  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        console.log("Turnero: pidiendo info del serviceId =", id);
        const res = await fetch(`http://localhost:3000/service/${id}`, { method: "GET" });
        if (!res.ok) {
          console.warn("Turnero: service not found", res.status);
          setTrabajadorNombre("");
          setTrabajadorId(null);
          return;
        }
        const data = await res.json().catch(() => null);
        const svc = data?.service ?? null;
        if (svc) {
          // nombres según lo que devuelve el backend
          setTrabajadorNombre(svc.trabajador_nombre ?? svc.nombre_trabajador ?? svc.nombre ?? "");
          setTrabajadorId(svc.trabajador_id ?? svc.id_usuario ?? null);
        } else {
          setTrabajadorNombre("");
          setTrabajadorId(null);
        }
      } catch (err) {
        console.error("Error al obtener servicio por id:", err);
        setTrabajadorNombre("");
        setTrabajadorId(null);
      }
    })();
  }, [id]);

  // traer horarios por serviceId y fecha
  const fetchHorarios = useCallback(async () => {
    if (!id) return;
    setLoadingHorarios(true);
    try {
      const fecha = new Date(startDate);
      fecha.setDate(fecha.getDate() + diaSeleccionado);
      const fechaISO = fecha.toISOString().split("T")[0];

      console.log("Turnero: fetch horarios para serviceId =", id, "fecha =", fechaISO);
      const res = await fetch(`http://localhost:3000/turnero/${id}?fecha=${fechaISO}`, { method: "GET" });

      if (!res.ok) {
        // Propagar estado vacío si error
        console.warn("Turnero: error al traer horarios", res.status);
        setHorarios({ Mañana: [], Tarde: [], Noche: [] });
        return;
      }

      const data = await res.json().catch(() => null);
      setHorarios({
        Mañana: Array.isArray(data?.Mañana) ? data.Mañana : [],
        Tarde: Array.isArray(data?.Tarde) ? data.Tarde : [],
        Noche: Array.isArray(data?.Noche) ? data.Noche : [],
      });
    } catch (err) {
      console.error("Error al traer horarios:", err);
      setHorarios({ Mañana: [], Tarde: [], Noche: [] });
    } finally {
      setLoadingHorarios(false);
    }
  }, [id, startDate, diaSeleccionado]);

  useEffect(() => {
    fetchHorarios();
  }, [fetchHorarios]);

  // reservar turno: enviar userId (usuarioId), serviceId (id), fecha, hora
  const reservarTurno = async (hora) => {
    if (!usuarioId) {
      alert("Debes iniciar sesión para reservar.");
      return;
    }

    try {
      const fecha = new Date(startDate);
      fecha.setDate(fecha.getDate() + diaSeleccionado);
      const fechaISO = fecha.toISOString().split("T")[0];

      const payload = {
        userId: usuarioId,
        serviceId: id,
        fecha: fechaISO,
        hora,
      };

      const res = await fetch("http://localhost:3000/reservar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => null);
        throw new Error(errBody?.message || "No se pudo reservar el turno");
      }

      alert("Turno reservado con éxito");
      await fetchHorarios();
    } catch (err) {
      console.error("Error al reservar turno:", err);
      alert(err.message || "Error al reservar turno");
    }
  };

  return (
    <div className="turnero-container">
      <h2 className="turnero-title">Seleccioná tu turno con {trabajadorNombre || "el trabajador"}</h2>

      <div className="flechas-container" style={{ marginBottom: 12 }}>
        <button
          className="flecha-button"
          onClick={() => {
            cambiarSemana(-7);
            setDiaSeleccionado(0);
          }}
        >
          ← Semana anterior
        </button>
        <button
          className="flecha-button"
          onClick={() => {
            cambiarSemana(7);
            setDiaSeleccionado(0);
          }}
        >
          Semana siguiente →
        </button>
      </div>

      <div className="dias-container">
        {getDiasRotados().map((d, index) => (
          <button
            key={`${d.iso}-${index}`}
            className={`dia-button ${index === diaSeleccionado ? "selected" : ""}`}
            onClick={() => handleDiaClick(index)}
          >
            <div>{d.label}</div>
            <div style={{ fontSize: 12 }}>{getFechaFormateada(index)}</div>
          </button>
        ))}
      </div>

      <div className="horarios-container" style={{ marginTop: 12 }}>
        {loadingHorarios ? (
          <p>Cargando horarios...</p>
        ) : (
          Object.entries(horarios).map(([momento, lista]) => (
            <div key={momento} className="momento-section">
              <h3>{momento}</h3>
              {lista.length > 0 ? (
                <div className="horarios-list">
                  {lista.map((hora) => (
                    <button key={hora} className="horario-button" onClick={() => reservarTurno(hora)}>
                      {hora}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="no-disponible">Sin horarios disponibles</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Turnero;
