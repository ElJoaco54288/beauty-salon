import '../styles/components/pages/adminCatalogo.css';
import React, { useEffect, useState } from "react";
import Header from "../components/layout/header";
import { useNavigate, useParams } from "react-router-dom";

const AdminCatalogo = () => {
  const { id: paramId } = useParams(); // opcional: id en la URL (puede ser id del trabajador)
  const navigate = useNavigate();

  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // add service UI state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [adding, setAdding] = useState(false);

  // edit UI state
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // Decide si usamos el id de la URL o el id de sesión
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);
        let workerId = paramId;

        if (!workerId) {
          const s = await fetch("http://localhost:3000/getSessionUser", {
            method: "GET",
            credentials: "include",
          });
          if (!s.ok) {
            throw new Error("No hay sesión iniciada");
          }
          const sd = await s.json();
          workerId = sd.user?.id_usuario;
        }

        if (!workerId) throw new Error("No se pudo determinar el id del trabajador");

        const res = await fetch(`http://localhost:3000/workerServices/${workerId}`, { method: "GET" });
        if (!res.ok) {
          const text = await res.text().catch(() => "");
          throw new Error(text || `Error ${res.status}`);
        }
        const data = await res.json();
        setServicios(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error al cargar servicios (admin):", err);
        setError(err.message || "Error cargando servicios");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [paramId]);

  const goToAdmin = (serviceId) => navigate(`/admin/${serviceId}`);
  const openEditForm = (service) => {
    setEditingId(service.id_servicio ?? service.id ?? null);
    setEditName(service.nombre ?? "");
    setEditPrice(service.precio ?? "");
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditPrice("");
  };

  const saveEdit = async (serviceId) => {
    if (!editName.trim()) return alert("El nombre no puede estar vacío");
    const priceNum = editPrice === "" ? null : Number(editPrice);
    if (editPrice !== "" && (Number.isNaN(priceNum) || priceNum < 0)) {
      return alert("Precio inválido");
    }
    try {
      setSavingEdit(true);
      const res = await fetch(`http://localhost:3000/serviceupdate/${serviceId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre: editName.trim(), precio: priceNum }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || `Error ${res.status}`);
      }
      const body = await res.json();
      const updated = body?.service;
      if (updated) {
        setServicios(prev => prev.map(s => (String(s.id_servicio ?? s.id) === String(serviceId) ? updated : s)));
      } else {
        // fallback: mutate local item
        setServicios(prev => prev.map(s => {
          if (String(s.id_servicio ?? s.id) === String(serviceId)) {
            return { ...s, nombre: editName.trim(), precio: priceNum };
          }
          return s;
        }));
      }
      alert("Servicio actualizado");
      cancelEdit();
    } catch (err) {
      console.error("Error guardando edición:", err);
      alert(err.message || "Error al guardar cambios");
    } finally {
      setSavingEdit(false);
    }
  };

  const deleteService = async (serviceId) => {
    if (!confirm("¿Seguro que querés borrar este servicio? Esta acción es irreversible.")) return;
    try {
      setDeleting(serviceId);
      const res = await fetch(`http://localhost:3000/servicedeletion/${serviceId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || `Error ${res.status}`);
      }
      alert("Servicio borrado correctamente");
      setServicios(prev => prev.filter(s => String(s.id_servicio ?? s.id) !== String(serviceId)));
    } catch (err) {
      console.error("Error borrando servicio:", err);
      alert(err.message || "Error al borrar servicio");
    } finally {
      setDeleting(null);
    }
  };

  // ADD service handlers (igual que antes)
  const toggleAddForm = () => {
    setShowAddForm(v => !v);
    if (!showAddForm) {
      setNewName("");
      setNewPrice("");
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return alert("Ingresá un nombre para el servicio");
    const priceNum = Number(newPrice);
    if (newPrice !== "" && (Number.isNaN(priceNum) || priceNum < 0)) {
      return alert("Ingresá un precio válido (número >= 0) o déjalo vacío");
    }
    try {
      setAdding(true);
      let workerId = paramId;
      if (!workerId) {
        const s = await fetch("http://localhost:3000/getSessionUser", {
          method: "GET",
          credentials: "include",
        });
        if (!s.ok) throw new Error("No hay sesión iniciada");
        const sd = await s.json();
        workerId = sd.user?.id_usuario;
      }
      if (!workerId) throw new Error("No se pudo determinar el id del trabajador");

      const payload = { nombre: newName.trim(), precio: priceNum || null };
      const res = await fetch(`http://localhost:3000/service/${workerId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.message || `Error ${res.status}`);
      }
      const body = await res.json();
      const created = body?.service;
      if (created) {
        setServicios(prev => [created, ...prev]);
        setShowAddForm(false);
        setNewName("");
        setNewPrice("");
        alert("Servicio creado correctamente");
      } else {
        alert(body?.message || "Servicio creado. Recargando lista...");
        const r2 = await fetch(`http://localhost:3000/workerServices/${workerId}`);
        const data = await r2.json();
        setServicios(Array.isArray(data) ? data : []);
        setShowAddForm(false);
      }
    } catch (err) {
      console.error("Error creando servicio:", err);
      alert(err.message || "Error creando servicio");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="admin-catalog-page">
      <Header />

      <main className="admin-catalog-wrap">
        <div className="admin-catalog-inner">

          <section className="admin-topbar">
            <h1 className="admin-title">Gestionar mis servicios</h1>
            <div className="admin-top-actions">
              <button
                className="admin-btn admin-btn--add"
                onClick={toggleAddForm}
                aria-expanded={showAddForm}
              >
                {showAddForm ? "Cancelar" : "Agregar servicio"}
              </button>
            </div>
          </section>

          {showAddForm && (
            <form className="admin-add-form" onSubmit={handleAddService}>
              <div className="admin-form-row">
                <label className="admin-label">Nombre del servicio</label>
                <input className="admin-input" type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Ej: Manicura" required />
              </div>

              <div className="admin-form-row">
                <label className="admin-label">Precio (opcional)</label>
                <input className="admin-input" type="number" step="0.01" min="0" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="Ej: 500" />
              </div>

              <div className="admin-form-actions">
                <button className="admin-btn" type="submit" disabled={adding}>{adding ? "Creando..." : "Crear servicio"}</button>
                <button className="admin-btn admin-btn--danger" type="button" onClick={() => setShowAddForm(false)}>Cancelar</button>
              </div>
            </form>
          )}

          {loading && <p className="admin-loading">Cargando servicios...</p>}
          {error && <p className="admin-error">Error: {error}</p>}
          {!loading && !error && servicios.length === 0 && <p className="admin-empty">No hay servicios creados.</p>}

          <section className="admin-grid">
            {servicios.map((s) => {
              const serviceName = s.nombre ?? s.name ?? s.servicio_nombre ?? "—";
              const serviceId = s.id_servicio ?? s.id ?? null;
              const isEditing = String(editingId) === String(serviceId);

              return (
                <article className="admin-card" key={serviceId ?? serviceName}>
                  {s.imagen_url ? <img className="admin-img" src={s.imagen_url} alt={serviceName} /> : null}

                  <div className="admin-card-body">
                    <h2 className="admin-card-title">{serviceName}</h2>
                    <p className="admin-card-price">Precio: {s.precio ? `$${s.precio}` : "—"}</p>

                    {isEditing ? (
                      <div className="admin-edit-panel">
                        <div className="admin-form-row">
                          <label className="admin-label">Nombre</label>
                          <input className="admin-input" value={editName} onChange={(e) => setEditName(e.target.value)} />
                        </div>

                        <div className="admin-form-row">
                          <label className="admin-label">Precio</label>
                          <input className="admin-input" value={editPrice ?? ""} onChange={(e) => setEditPrice(e.target.value)} type="number" step="0.01" min="0" />
                        </div>

                        <div className="admin-form-actions">
                          <button className="admin-btn" onClick={() => saveEdit(serviceId)} disabled={savingEdit}>{savingEdit ? "Guardando..." : "Guardar"}</button>
                          <button className="admin-btn admin-btn--danger" onClick={cancelEdit}>Cancelar</button>
                        </div>
                      </div>
                    ) : (
                      <div className="admin-card-actions">
                        <button className="admin-btn admin-btn--primary" onClick={() => goToAdmin(serviceId)}>Administrar</button>
                        <button className="admin-btn" onClick={() => openEditForm(s)}>Editar</button>
                        <button className="admin-btn admin-btn--danger" onClick={() => deleteService(serviceId)} disabled={deleting === serviceId}>
                          {deleting === serviceId ? "Borrando..." : "Borrar"}
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </section>

        </div>
      </main>
    </div>
  );
};

export default AdminCatalogo;
