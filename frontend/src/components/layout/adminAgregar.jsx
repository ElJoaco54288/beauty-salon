import React, { useMemo, useState } from "react";
import '../../styles/components/layout/adminAgregar.css'

// frontend/src/pages/admin.jsx
// Add a route to this component at path "/agregar" in your router (e.g. <Route path="/agregar" element={<AdminPage/>} />)


function pad(n) {
    return String(n).padStart(2, "0");
}

function formatDate(d) {
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

function isoDate(d) {
    // returns YYYY-MM-DD
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

const AdminPage = () => {
    // date selector (with arrows to go previous/next day)
    const [selectedDate, setSelectedDate] = useState(() => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return now;
    });

    // selected time slots (strings like "07:30")
    const [selectedSlots, setSelectedSlots] = useState([]);

    // build slots from 7:00 to 12:00 inclusive with 30 min step
    const slots = useMemo(() => {
        const list = [];
        const startHour = 7;
        const endHour = 23.5;
        for (let h = startHour; h <= endHour; h++) {
            for (let m of [0, 30]) {
                // avoid adding times past endHour (if endHour + 30)
                const isEndSlot = h === endHour && m > 0;
                if (isEndSlot) continue;
                list.push(`${pad(h)}:${pad(m)}`);
            }
        }
        return list;
    }, []);

    function toggleSlot(slot) {
        setSelectedSlots(prev =>
            prev.includes(slot) ? prev.filter(s => s !== slot) : [...prev, slot]
        );
    }

    function prevDay() {
        setSelectedDate(d => {
            const nd = new Date(d);
            nd.setDate(d.getDate() - 1);
            return nd;
        });
        setSelectedSlots([]); // optional: clear selections when changing date
    }

    function nextDay() {
        setSelectedDate(d => {
            const nd = new Date(d);
            nd.setDate(d.getDate() + 1);
            return nd;
        });
        setSelectedSlots([]); // optional: clear selections when changing date
    }

    function handleSubmit() {
        const payload = {
            date: isoDate(selectedDate), // backend-friendly YYYY-MM-DD
            slots: selectedSlots.sort(), // array of strings like ["07:00","07:30"]
        };
        // replace with fetch/post to your backend endpoint as needed
        console.log("Submitting payload to backend:", payload);
        // Example:
        // fetch('/api/appointments', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload) })
    }

    return (
        <div className="admin-container">
            <div className="cositos-arriba">
                <h1>Agregar disponibilidad</h1>

                <div className="date-arrows">
                    <button onClick={prevDay} aria-label="Anterior">◀</button>
                    <div style={{ minWidth: 220, textAlign: "center" }}>{formatDate(selectedDate)}</div>
                    <button onClick={nextDay} aria-label="Siguiente">▶</button>
                </div>

                <h2> Selecciona las horas de atencion</h2>
            </div>
            
           

            <div className="list-timetable">
                {slots.map(slot => {
                    const active = selectedSlots.includes(slot);
                    return (
                        <button className="botoncito"
                            key={slot}
                            onClick={() => toggleSlot(slot)}
                            style={{
                                border: active ? "2px solid #3fa29d" : "1px solid #ccc", 
                                background: active ? "#b2e3c2ff" : "#C7FFDA"
                            }}
                        >
                            {slot}
                        </button>
                    );
                })}
            </div>

            <p><strong>Fecha a enviar:</strong> {isoDate(selectedDate)}</p>

            <p><strong>Horas seleccionadas:</strong> {selectedSlots.length ? selectedSlots.join(", ") : "—"} </p>

            <div id="button-container">
                <button id="verdecito" onClick={handleSubmit}>
                    Enviar
                </button>
                <button id="rojito" onClick={() => { setSelectedSlots([]); }}>
                    Limpiar selección
                </button>
            </div>
        </div>
    );
}

export default AdminPage;