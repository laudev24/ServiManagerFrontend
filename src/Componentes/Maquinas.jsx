import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from "react-redux";
import { guardarMaquinas, eliminarMaquina } from "../features/maquinasSlice";

const Maquinas = () => {
  const [maquinasFiltradas, setMaquinasFiltradas] = useState([])
  const [marcas, setMarcas] = useState([])
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const listaMaquinas = useSelector(state => state.maquinasSlice.maquinas || []);
  const maquinasPorNumero = [...listaMaquinas].sort((a, b) => a.numero - b.numero);
  const token = localStorage.getItem("token")
  const API_URL = import.meta.env.VITE_API_URL

  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  const totalPaginas = Math.ceil(maquinasPorNumero.length / itemsPorPagina);
  const indiceInicial = (paginaActual - 1) * itemsPorPagina;
  const maquinasPaginadas = maquinasFiltradas.slice(indiceInicial, indiceInicial + itemsPorPagina);

  useEffect(() => {
    if (listaMaquinas.length === 0) {
      cargarMaquinas();
    } else {
      setMaquinasFiltradas(listaMaquinas);
    }
    cargarMarcas();
  }, []);

  const cargarMaquinas = () => {
    fetch(`${API_URL}/maquina`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(r => {
        if (!r.ok) {
          throw new Error("Error en la respuesta del servidor");
        }
        return r.json()
      })
      .then(datos => {
        setMaquinasFiltradas(datos)
        dispatch(guardarMaquinas(datos))
      })
      .catch(error => {
        console.error("Error al obtener las maquinas:", error);
      })
  }

  const cargarMarcas = () => {
    fetch(`${API_URL}/maquina/marcas`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(r => {
        if (!r.ok) throw new Error("Error obteniendo marcas");
        return r.json();
      })
      .then(datos => {
        setMarcas(datos); 
      })
      .catch(error => {
        console.error("Error al obtener las marcas:", error);
      });
  };

  const handleMarcaChange = (e) => {
    const marcaSeleccionada = e.target.value;
    setPaginaActual(1); 
    if (marcaSeleccionada === "") {
      setMaquinasFiltradas(listaMaquinas);
    } else {
      setMaquinasFiltradas(listaMaquinas.filter(m => m.marca === marcaSeleccionada));
    }
  };

  const handleModificar = (id) => {
    navigate(`/modificarMaquina/${id}`)
  }

  const handleEliminar = (idMaquina) => {
    fetch(`${API_URL}/maquina/${idMaquina}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
      .then(async (r) => {
        if (r.status === 204) {
          toast("Máquina eliminada");
          setMaquinasFiltradas(prev => prev.filter(c => c.id !== idMaquina));
          dispatch(eliminarMaquina(idMaquina))
        } else {
          toast("Error eliminando máquina");
        }
      })
      .catch((err) => {
        //console.log("Error en la conexión: " + err)
        toast("Error de conexión al eliminar máquina");
      });
  }

  const arrendada = (id) => {
    const maquina = maquinasFiltradas.find(m => m.id === id);
    return maquina && maquina.arrendamientos && maquina.arrendamientos.length > 0
      ? "Sí"
      : "No";
  };

  const irANuevaMaquina = () => {
    navigate('/nuevaMaquina')
  }

  return (
    <div className="contenedor-menu">
      <div className="contenedor-secundario">
        <h1>Máquinas</h1>
        <button onClick={irANuevaMaquina}>Registrar nueva máquina</button>
        <br /><br />
        <select onChange={handleMarcaChange}>
          <option value="">Todas las marcas</option>
          {marcas.map((m, index) => (
            <option key={index} value={m}>{m}</option>
          ))}
          {marcas.length === 0 && <option value="">No hay marcas para mostrar</option>}
        </select><br />

        <table>
          <thead>
            <tr>
              <th>Numero</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Arrendada</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {maquinasPaginadas.map((maquina) => (
              <tr key={maquina.id}>
                <td data-label="Número de matrícula">
                  <Link to={`/verMaquina/${maquina.id}`}>{maquina.numero}</Link>
                </td>
                <td data-label="Marca">{maquina.marca}</td>
                <td data-label="Modelo">{maquina.modelo}</td>
                <td data-label="Arrendada">{arrendada(maquina.id)}</td>
                <td data-label="Modificar">
                  <button onClick={() => handleModificar(maquina.id)}>Modificar</button>
                </td>
                <td data-label="Eliminar">
                  <button className="eliminar" onClick={() => handleEliminar(maquina.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {maquinasFiltradas.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>No hay resultados</td>
              </tr>
            )}
          </tbody>
        </table>

        {totalPaginas > 1 && (
          <div className="paginador">
            <button
              disabled={paginaActual === 1}
              onClick={() => setPaginaActual(paginaActual - 1)}
            >
              Anterior
            </button>
            <span>Página {paginaActual} de {totalPaginas}</span>
            <button
              disabled={paginaActual === totalPaginas}
              onClick={() => setPaginaActual(paginaActual + 1)}
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Maquinas
