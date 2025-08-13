import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Insumos = () => {
  const [insumos, setInsumos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;
  const token = localStorage.getItem('token');
  API_URL=import.meta.env.VITE_API_URL
  const navigate = useNavigate();

  useEffect(() => {
    
    traerInsumos();
  }, []);

  const traerInsumos = () => {
    fetch(`${API_URL}/insumo`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(r => {
        if (!r.ok) throw new Error("Error al traer los insumos");
        return r.json();
      })
      .then(data => setInsumos(data))
      .catch(err => {
        console.error(err);
        toast.error("No se pudieron cargar los insumos");
      });
  };

  const handleEliminar = (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este insumo?")) return;

    fetch(`${API_URL}/insumo/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(r => {
        if (r.status === 204) {
          toast.success("Insumo eliminado");
          setInsumos(prev => prev.filter(i => i.id !== id));
        } else {
          toast.error("Error al eliminar insumo");
        }
      })
      .catch(err => {
        console.error(err);
        toast.error("Error de red al eliminar insumo");
      });
  };

  const handleModificar = (id) => {
    navigate(`/modificarInsumo/${id}`);
  };

  const insumosFiltrados = insumos.filter(i =>
    i.nombreInsumo?.toLowerCase().includes(filtro.toLowerCase())
  );

  const totalPaginas = Math.ceil(insumosFiltrados.length / itemsPorPagina);
  const indiceInicial = (paginaActual - 1) * itemsPorPagina;
  const insumosPaginados = insumosFiltrados.slice(indiceInicial, indiceInicial + itemsPorPagina);

   return (

    <div className="contenedor-menu">
  <div className="formulario-cliente">
    <h1>Insumos</h1>

    <Link to="/nuevoInsumo" className="enlace-accion">Crear nuevo insumo</Link>

    <div className="search-bar">
      <input
        type="text"
        placeholder="Buscar insumo..."
        value={filtro}
        onChange={e => {
          setFiltro(e.target.value);
          setPaginaActual(1);
        }}
      />
    </div>

    <table className='tabla-insumos'>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Cantidad</th>
          <th>Modificar</th>
          <th>Eliminar</th>
        </tr>
      </thead>
      <tbody>
        {insumosPaginados.map(insumo => (
          <tr key={insumo.id}>
            <td data-label="Nombre">{insumo.nombreInsumo}</td>
            <td data-label="Cantidad">{insumo.cantidad}</td>
            <td>
              <button onClick={() => handleModificar(insumo.id)}>Modificar</button>
            </td>
            <td>
              <button className="eliminar" onClick={() => handleEliminar(insumo.id)}>Eliminar</button>
            </td>
          </tr>
        ))}
        {insumosFiltrados.length === 0 && (
          <tr><td colSpan="4">No hay resultados</td></tr>
        )}
      </tbody>
    </table>

    {totalPaginas > 1 && (
      <div className="paginador">
        <button
          disabled={paginaActual === 1}
          onClick={() => setPaginaActual(paginaActual - 1)}
        >Anterior</button>

        <span>Página {paginaActual} de {totalPaginas}</span>

        <button
          disabled={paginaActual === totalPaginas}
          onClick={() => setPaginaActual(paginaActual + 1)}
        >Siguiente</button>
      </div>
    )}
  </div>
</div>

    
  //   <div className="contenedor-menu">
  //     <h1>Insumos</h1>

  //     <Link to="/nuevoInsumo">Crear nuevo insumo</Link>

  //     <div className="search-bar">
  //       <input
  //         type="text"
  //         placeholder="Buscar insumo..."
  //         value={filtro}
  //         onChange={e => {
  //           setFiltro(e.target.value);
  //           setPaginaActual(1);
  //         }}
  //       />
  //     </div>

  //     <table>
  //       <thead>
  //         <tr>
  //           <th>Nombre</th>
  //           <th>Cantidad</th>
  //           <th>Modificar</th>
  //           <th>Eliminar</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {insumosPaginados.map(insumo => (
  //           <tr key={insumo.id}>
  //             <td>{insumo.nombreInsumo}</td>
  //             <td>{insumo.cantidad}</td>
  //             <td>
  //               <button onClick={() => handleModificar(insumo.id)}>Modificar</button>
  //             </td>
  //             <td>
  //               <button className="eliminar" onClick={() => handleEliminar(insumo.id)}>Eliminar</button>
  //             </td>
  //           </tr>
  //         ))}
  //         {insumosFiltrados.length === 0 && (
  //           <tr><td colSpan="4">No hay resultados</td></tr>
  //         )}
  //       </tbody>
  //     </table>

  //     {totalPaginas > 1 && (
  //       <div className="paginador">
  //         <button
  //           disabled={paginaActual === 1}
  //           onClick={() => setPaginaActual(paginaActual - 1)}
  //         >Anterior</button>

  //         <span>Página {paginaActual} de {totalPaginas}</span>

  //         <button
  //           disabled={paginaActual === totalPaginas}
  //           onClick={() => setPaginaActual(paginaActual + 1)}
  //         >Siguiente</button>
  //       </div>
  //     )}
  //   </div>
  );
};

export default Insumos;