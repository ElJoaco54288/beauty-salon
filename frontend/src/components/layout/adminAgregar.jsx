// frontend/src/pages/AdminPage.jsx
import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import '../../styles/components/layout/adminAgregar.css';

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatDate(d) {
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function isoDate(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const AdminPage = () => {
  const { id } = useParams(); 
  const [selectedDate, setSelectedDate] = useState(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  });

  const [selectedSlots, setSelectedSlots] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  
  const slots = useMemo(() => {
    const list = [];
    const startHour = 7;
    const endHour = 23; 
    for (let h = startHour; h <= endHour; h++) {
      list.push(`${pad(h)}:00`);
      list.push(`${pad(h)}:30`);
    }
   
    return list.filter(s => {
      const hh = Number(s.split(":")[0]);
      const mm = Number(s.split(":")[1]);
      return hh < 24 && (hh < 23 || (hh === 23 && mm <= 30));
    });
  }, []);

  function toggleSlot(slot) {
    setSelectedSlots(prev => (prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]));
  }

  function prevDay() {
    setSelectedDate(d => {
      const nd = new Date(d);
      nd.setDate(d.getDate() - 1);
      nd.setHours(0,0,0,0);
      return nd;
    });
    setSelectedSlots([]);
  }

  function nextDay() {
    setSelectedDate(d => {
      const nd = new Date(d);
      nd.setDate(d.getDate() + 1);
      nd.setHours(0,0,0,0);
      return nd;
    });
    setSelectedSlots([]);
  }

  // POST a backend
  const handleSubmit = async () => {
    if (!id) {
      alert("Falta el id del servicio en la URL.");
      return;
    }
    if (!selectedSlots.length) {
      alert("Seleccioná al menos una franja horaria.");
      return;
    }

    const payload = {
      fecha: isoDate(selectedDate),
      horariosDisponibles: selectedSlots.slice().sort(), 
    };

    setSubmitting(true);
    try {
      const res = await fetch(`http://localhost:3000/agregar/${encodeURIComponent(id)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({ message: 'Error en la petición' }));
        throw new Error(body?.message || `Error ${res.status}`);
      }

      const body = await res.json().catch(() => null);
      alert(body?.message || "Disponibilidades agregadas correctamente.");
      setSelectedSlots([]);
    } catch (err) {
      console.error("Error al enviar disponibilidades:", err);
      alert(err.message || "Error al enviar disponibilidades");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="admin-container">
      <div className="cositos-arriba">
        <h1>Agregar disponibilidad</h1>

        <div className="date-arrows">
          <button onClick={prevDay} aria-label="Anterior" disabled={submitting}>◀</button>
          <div style={{ minWidth: 220, textAlign: "center" }}>{formatDate(selectedDate)}</div>
          <button onClick={nextDay} aria-label="Siguiente" disabled={submitting}>▶</button>
        </div>

        <h2> Selecciona las horas de atención</h2>
        {id ? <p>ServiceId: <strong>{id}</strong></p> : <p style={{color:'red'}}>No se detectó id de servicio en la URL</p>}
      </div>

      <div className="list-timetable">
        {slots.map(slot => {
          const active = selectedSlots.includes(slot);
          return (
            <button
              className="botoncito"
              key={slot}
              onClick={() => toggleSlot(slot)}
              disabled={submitting}
              style={{
                border: active ? "2px solid #3fa29d" : "1px solid #ccc",
                background: active ? "#b2e3c2ff" : "#C7FFDA",
                cursor: submitting ? "not-allowed" : "pointer",
              }}
            >
              {slot}
            </button>
          );
        })}
      </div>

      <p><strong>Fecha a enviar:</strong> {isoDate(selectedDate)}</p>
      <p><strong>Horas seleccionadas:</strong> {selectedSlots.length ? selectedSlots.join(", ") : "—"}</p>

      <div id="button-container">
        <button id="verdecito" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Enviando..." : "Enviar"}
        </button>
        <button id="rojito" onClick={() => setSelectedSlots([])} disabled={submitting}>
          Limpiar selección
        </button>
      </div>
    </div>
  );
};

export default AdminPage;
