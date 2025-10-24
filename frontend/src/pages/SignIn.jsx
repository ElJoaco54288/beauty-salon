import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthCard from "../components/layout/AuthCard";
import { useToast } from "../components/toast/ToastContext";
import "../styles/components/pages/signin.css";

const SignIn = ()=> {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      addToast({ type: "error", title: "Campos incompletos", message: "Completa nombre y contraseña." });
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/signin", { username, password }, {
        headers: { "Content-Type": "application/json" },
        timeout: 8000
      });
      addToast({ type: "success", title: "Bienvenido", message: res.data.message || "Login correcto" });
      // Ejemplo: guardar usuario en localStorage si el backend devuelve datos
      // localStorage.setItem('user', JSON.stringify(res.data.user));
    } catch (err) {
      const msg = err?.response?.data?.message || "Error en la conexión";
      addToast({ type: "error", title: "Inicio fallido", message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap">
      <AuthCard title="Iniciar sesión" subtitle="Accede con tu usuario y contraseña">
        <form className="form" onSubmit={handleSubmit}>
          <label className="label">
            Nombre
            <input
              className="input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tu nombre"
            />
          </label>

          <label className="label">
            Contraseña
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
            />
          </label>

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? "Validando..." : "Entrar"}
          </button>
        </form>

        <p className="aux-text">
          ¿Aún no has creado una cuenta?{" "}
          <Link to="/signup" className="aux-link">Crea una</Link>
        </p>
      </AuthCard>
    </div>
  );
}

export default SignIn;