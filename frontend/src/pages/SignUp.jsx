import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthCard from "../components/layout/AuthCard";
import { useToast } from "../components/toast/ToastContext";
import "../styles/components/pages/signup.css";

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [contact, setContact] = useState("");
  const [role, setRole] = useState("usuario");
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password || !contact || !role) {
      addToast({ type: "error", title: "Campos incompletos", message: "Rellena todos los campos." });
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/signup", { username, password, contact, role }, {
        headers: { "Content-Type": "application/json" },
        timeout: 8000
      });
      addToast({ type: "success", title: "Registrado", message: res.data.message || "Usuario creado" });
      // Opcional: redirigir al signin si querés automatic redirect:
      // navigate('/signin')
    } catch (err) {
      const msg = err?.response?.data?.message || "Error en la conexión";
      addToast({ type: "error", title: "Registro fallido", message: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap">
      <AuthCard title="Registro" subtitle="Crea tu cuenta">
        <form className="form" onSubmit={handleSubmit}>
          <label className="label">
            Nombre
            <input className="input" type="text" value={username} onChange={(e)=>setUsername(e.target.value)} placeholder="Tu nombre"/>
          </label>

          <label className="label">
            Contraseña
            <input className="input" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Contraseña"/>
          </label>

          <label className="label">
            Contacto
            <input className="input" type="text" value={contact} onChange={(e)=>setContact(e.target.value)} placeholder="Teléfono o contacto"/>
          </label>

          <label className="label">
            Rol
            <select className="input" value={role} onChange={(e)=>setRole(e.target.value)}>
              <option value="usuario">usuario</option>
              <option value="trabajador">trabajador</option>
            </select>
          </label>

          <button className="primary-btn" type="submit" disabled={loading}>
            {loading ? "Creando..." : "Crear cuenta"}
          </button>
        </form>

        <p className="aux-text">
          ¿Ya tienes cuenta?{" "}
          <Link to="/signin" className="aux-link">Inicia sesión</Link>
        </p>
      </AuthCard>
    </div>
  );
}

export default SignUp;