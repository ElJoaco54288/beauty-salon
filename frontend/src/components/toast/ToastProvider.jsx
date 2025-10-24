import React, { useState, useCallback, useEffect, useRef } from "react";
import { ToastContext } from "./ToastContext";
import "./toast.css";

/* Componente interno Toast (NO exportado desde este archivo) */
function Toast({type = "error", title, message, duration = 4000, onClose }) {
  const [progress, setProgress] = useState(100);
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
    const tick = 50;
    const timer = setInterval(() => {
      const elapsed = Date.now() - startRef.current;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(pct);
      if (elapsed >= duration) {
        clearInterval(timer);
        onClose();
      }
    }, tick);
    return () => clearInterval(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast ${type}`}>
      <div className="toast-body">
        <strong className="toast-title">{title}</strong>
        <div className="toast-message">{message}</div>
      </div>
      <div className="toast-progress" style={{ width: `${progress}%` }} />
    </div>
  );
}

/* Este archivo EXPORTA SOLO COMPONENTES (cumple la regla de Fast Refresh) */
export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ type = "error", title = "", message = "", duration = 4000 }) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, type, title, message, duration }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="toast-container" aria-live="polite">
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// Nota: No se exporta ToastContext desde este archivo para cumplir la regla de Fast Refresh