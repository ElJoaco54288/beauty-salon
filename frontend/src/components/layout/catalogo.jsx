import '../../styles/components/layout/catalogo.css'

const BDSimu = [
  { img: "/vite.svg", nombre: "Limpieza facial", trabajador: '1', precio: 1 },
  { img: "/vite.svg", nombre: "Limpieza facial", trabajador: '2', precio: 1 },
  { img: "/vite.svg", nombre: "Limpieza facial", trabajador: '3', precio: 1 }
];

const Catalogo = () => {

  const onSubmit = (e, item) => {
    e.preventDefault();
    console.log(`Contrataste el servicio de ${item.nombre}`);
  };

  return (
    <div id="catalogo-wrap">
      <div className="catalogo-grid" id="catalogo">
        {BDSimu.map((item, index) => (
          <div className="card" key={index}>
            <img className="img-card" src={item.img} alt={item.nombre} />
            <h2 className="titulo-card">{item.nombre}</h2>
            <p className="precio-card">${item.precio}</p>

            <form onSubmit={(e) => onSubmit(e, item)}>
              <input type="submit" value="Pedir un turno" />
            </form>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalogo;
