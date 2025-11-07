import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "../components/toast/ToastContext";
import "../styles/components/pages/signin.css";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      addToast({ type: "error", title: "Campos incompletos", message: "Completa nombre y contraseña." });
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/signin",
        { username, password },
        {
          headers: { "Content-Type": "application/json" },
          timeout: 8000,
          withCredentials: true // ← MUY IMPORTANTE para que el navegador acepte Set-Cookie cross-origin
        }
      );

      addToast({ type: "success", title: "Bienvenido", message: res.data.message || "Login correcto" });

      // navegar SOLO si el login fue exitoso
      navigate('/inicio');
    } catch (err) {
      const msg = err?.response?.data?.message || "Error en la conexión";
      addToast({ type: "error", title: "Inicio fallido", message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap">
      <div className="auth-card">
        <h2 className="auth-title">Iniciar sesion</h2>
        <p className="auth-subtitle">Accede con tu usuario y contraseña</p>
        <div className="auth-content">
          <form className="form" onSubmit={handleSubmit}>
            <label className="label">
              Nombre
              <input className="input" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Tu nombre" />
            </label>

            <label className="label">
              Contraseña
              <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" />
            </label>

            <button className="primary-btn" type="submit" disabled={loading}>
              {loading ? "Validando..." : "Entrar"}
            </button>
          </form>

          <p className="aux-text">
            ¿Aún no has creado una cuenta?{" "}
            <Link to="/signup" className="aux-link">Crea una</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
