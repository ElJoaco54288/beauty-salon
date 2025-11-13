import "../../styles/components/layout/catalogoPersonas.css";


const Servicios = () => {
    return(
        <div>
            <div className="card" key={keyId}>
                <h2 className="titulo-card">{t.nombre || "—"}</h2> {/* servicio */}
                <p className="precio-card"> Tel: {telefono ? telefono: "—"}</p>   {/* precio  */}
                <form onSubmit={(e) => onSubmit(e, t)}>
                  <input type="submit" value="pedir servicio" />
                </form>
              </div>
        </div>
    );
}

export default Servicios 