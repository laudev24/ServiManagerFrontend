import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from "react-redux";
import { guardarFichasTecnicas } from '../features/fichasTecnicasSlice' 

const FichasTecnicas = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token")
  const API_URL = import.meta.env.VITE_API_URL  

  const listaFichas = useSelector(state => state.fichasTecnicasSlice.fichasTecnicas);
  const listaClientes = useSelector(state => state.clientesSlice.clientes);
  const listaMaquinas = useSelector(state => state.maquinasSlice.maquinas);
  const listaInsumos = useSelector(state => state.insumosSlice.insumos)

  const [clientes, setClientes] = useState([])
  const [maquinas, setMaquinas] = useState([])
  const [insumos, setInsumos] = useState([])
  const [fichas, setFichas] = useState([])

  
  const [campoClienteElegidoId, setCampoClienteElegidoId] = useState("")
  const [campoMaquinaElegidaId, setCampoMaquinaElegidaId] = useState("")
  const [insumoElegidoId, setInsumoElegidoId] = useState("")
  const [fechaDesde, setFechaDesde] = useState("")
  const [fechaHasta, setFechaHasta] = useState("")

  
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  const totalPaginas = Math.ceil(fichas.length / itemsPorPagina);
  const indiceInicial = (paginaActual - 1) * itemsPorPagina;
  const fichasPaginadas = fichas.slice(indiceInicial, indiceInicial + itemsPorPagina);

  
  useEffect(() => {
    if (listaFichas.length === 0) cargarFichas(); else setFichas(listaFichas);
    if (listaClientes.length === 0) cargarClientes(); else setClientes(listaClientes);
    if (listaMaquinas.length === 0) cargarMaquinas(); else setMaquinas(listaMaquinas);
    if (listaInsumos.length === 0) cargarInsumos(); else setInsumos(listaInsumos);
  }, [])

  const cargarFichas = () => {
    fetch(`${API_URL}/fichaTecnica`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(datos => {
        dispatch(guardarFichasTecnicas(datos))
        setFichas(datos)
      })
  }

  const cargarClientes = () => {
    fetch(`${API_URL}/cliente`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json())
      .then(datos => setClientes(datos))
  }

  const cargarMaquinas = () => {
    fetch(`${API_URL}/maquina`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json())
      .then(datos => setMaquinas(datos))
  }

  const cargarInsumos = () => {
    fetch(`${API_URL}/insumo`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(r => r.json())
      .then(datos => setInsumos(datos))
  }

  
  useEffect(() => {
    let fichasFiltradas = listaFichas;

    if (campoClienteElegidoId) {
      fichasFiltradas = fichasFiltradas.filter(f => f.clienteId === Number(campoClienteElegidoId));
    }
    if (campoMaquinaElegidaId) {
      fichasFiltradas = fichasFiltradas.filter(f => f.maquinaId === Number(campoMaquinaElegidaId));
    }
    if (insumoElegidoId) {
      fichasFiltradas = fichasFiltradas.filter(f => 
        f.insumos?.some(i => i.insumoId === Number(insumoElegidoId))
      );
    }
    if (fechaDesde) {
      const desde = new Date(fechaDesde);
      fichasFiltradas = fichasFiltradas.filter(f => new Date(f.fechaYHora) >= desde);
    }
    if (fechaHasta) {
      const hasta = new Date(fechaHasta);
      fichasFiltradas = fichasFiltradas.filter(f => new Date(f.fechaYHora) <= hasta);
    }

    setFichas(fichasFiltradas);
    setPaginaActual(1); 
  }, [campoClienteElegidoId, campoMaquinaElegidaId, insumoElegidoId, fechaDesde, fechaHasta, listaFichas])

  const handleModificar = (idFicha) => navigate(`/modificarFicha/${idFicha}`)

  const handleEliminar = (idFicha) => {
    fetch(`${API_URL}/fichaTecnica/${idFicha}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => {
        if (r.status === 204) {
          toast("Ficha eliminada");
          setFichas(prev => prev.filter(c => c.id !== idFicha));
        } else {
          toast("Error eliminando ficha");
        }
      })
  }

  const mostrarNombreEmpresa = (id) => clientes.find(c => c.id === id)?.nombreEmpresa || ""
  const mostrarNumeroMaquina = (id) => maquinas.find(m => m.id === id)?.numero || ""

  const formatearFechaHora = (fechaISO) => {
  if (!fechaISO) return "";

  const fechaUTC = new Date(fechaISO);

  // Obtener la hora local ajustando desde UTC
  const fechaLocal = new Date(fechaUTC.getTime() - 3 * 60 * 60 * 1000);

  const dia = String(fechaLocal.getDate()).padStart(2, '0');
  const mes = String(fechaLocal.getMonth() + 1).padStart(2, '0');
  const anio = fechaLocal.getFullYear();
  const horas = String(fechaLocal.getHours()).padStart(2, '0');
  const minutos = String(fechaLocal.getMinutes()).padStart(2, '0');

  return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
};

  return (
    <div className="contenedor-menu">
      <div className="contenedor-secundario">
        <h1>Fichas Técnicas</h1>

        <button className="crear-ficha" onClick={() => navigate('/nuevaFichaTecnica', { state: { from: 'fichasTecnicas' } })}>
          Crear Ficha Técnica
        </button>

        
        <div className="filtros">
          <label>Cliente:
            <select value={campoClienteElegidoId} onChange={(e) => setCampoClienteElegidoId(e.target.value)}>
              <option value="">Todos</option>
              {clientes.map(c => <option key={c.id} value={c.id}>{c.nombreEmpresa}</option>)}
            </select>
          </label>

          <label>Máquina:
            <select value={campoMaquinaElegidaId} onChange={(e) => setCampoMaquinaElegidaId(e.target.value)}>
              <option value="">Todas</option>
              {maquinas.map(m => <option key={m.id} value={m.id}>{m.numero} - {m.marca} - {m.modelo}</option>)}
            </select>
          </label>

          <label>Insumo:
            <select value={insumoElegidoId} onChange={(e) => setInsumoElegidoId(e.target.value)}>
              <option value="">Todos</option>
              {insumos.map(i => <option key={i.id} value={i.id}>{i.nombreInsumo}</option>)}
            </select>
          </label>

          <label>Desde:
            <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
          </label>

          <label>Hasta:
            <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
          </label>
        </div>

        
        <table>
          <tbody>
            {fichasPaginadas.map(ficha => (
              <tr key={ficha.id}>
                <td><Link to={`/verFichaTecnica/${ficha.id}`}>{formatearFechaHora(ficha.fechaYHora)}</Link></td>
                <td>{mostrarNombreEmpresa(ficha.clienteId)}</td>
                <td>{mostrarNumeroMaquina(ficha.maquinaId)}</td>
                <td><button onClick={() => handleModificar(ficha.id)}>Modificar</button></td>
                <td><button className="eliminar" onClick={() => handleEliminar(ficha.id)}>Eliminar</button></td>
              </tr>
            ))}
            {fichas.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: "center" }}>No hay resultados</td></tr>
            )}
          </tbody>
        </table>

        
        {totalPaginas > 1 && (
          <div className="paginador">
            <button disabled={paginaActual === 1} onClick={() => setPaginaActual(paginaActual - 1)}>Anterior</button>
            <span>Página {paginaActual} de {totalPaginas}</span>
            <button disabled={paginaActual === totalPaginas} onClick={() => setPaginaActual(paginaActual + 1)}>Siguiente</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FichasTecnicas
