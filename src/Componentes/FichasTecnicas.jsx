import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from "react-redux";
import { guardarMaquinas } from "../features/maquinasSlice";
import { guardarFichasTecnicas, eliminarFichaTecnica } from '../features/fichasTecnicasSlice' 
import { guardarClientes } from '../features/clientesSlice';


const FichasTecnicas = () => {
  const dispatch = useDispatch();
  let navigate = useNavigate()
  const token = localStorage.getItem("token")
  const API_URL=import.meta.env.VITE_API_URL  

  const listaFichas=useSelector(state => state.fichasTecnicasSlice.fichasTecnicas);
  const listaClientes=useSelector(state => state.clientesSlice.clientes);
  const listaMaquinas=useSelector(state => state.maquinasSlice.maquinas);
  const listaInsumos=useSelector(state => state.insumosSlice.insumos)

  const [insumos, setInsumos] = useState([])
  const [insumosElegidos, setInsumosElegidos] = useState("") // Ojo que esta recibiendo ahora solo un insumo, pero la idea es que pueda recibir una lista
  const [clientes, setClientes] = useState([])
  const [maquinas, setMaquinas] = useState([])
  const [fichas, setFichas] = useState([])
  const [campoMaquinaElegidaId, setCampoMaquinaElegidaId] = useState("")
  const [campoClienteElegidoId, setCampoClienteElegidoId] = useState("")
  
 const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 10;

  const totalPaginas = Math.ceil(fichas.length / itemsPorPagina);
  const indiceInicial = (paginaActual - 1) * itemsPorPagina;
  const fichasPaginadas = fichas.slice(indiceInicial, indiceInicial + itemsPorPagina);


  useEffect(() => {
    if(listaFichas.length===0){
      cargarFichas()
    }else{
      setFichas(listaFichas)
    }
    if(listaClientes.length===0){
    cargarClientes()
    }else{
      setClientes(listaClientes)
    }
    if(listaMaquinas.length===0){
      cargarMaquinas()
    }else{
      setMaquinas(listaMaquinas)
    }
    if(listaInsumos.length===0){
      cargarInsumos()
    }else{
      setInsumos(listaInsumos)
    }
  }, [])

   const cargarFichas = () => {
    fetch(`${API_URL}/fichaTecnica`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            }
        })
    .then(r =>{
      if(!r.ok){
        throw new Error("Error en la respuesta del servidor");
      }
      return r.json()
    }) 
    .then(datos => {
      //  console.log("📦 Fichas traídas del backend:", datos);
      dispatch(guardarFichasTecnicas(datos))
      setFichas(datos)
    })
    .catch(error => {
      console.error("Error al obtener las fichas:", error);
    })
  }

  const cargarClientes = () => {
    fetch(`${API_URL}/cliente`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            }
        })
    .then(r =>{
      if(!r.ok){
        throw new Error("Error en la respuesta del servidor");
      }
      return r.json()
    }) 
    .then(datos => {
      // dispatch(guardarClientes(datos))
      setClientes(datos)
    })
    .catch(error => {
      console.error("Error al obtener los clientes:", error);
    })
  }

  const cargarMaquinas = () => {
    fetch(`${API_URL}/maquina`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            }
        })
    .then(r =>{
      if(!r.ok){
        throw new Error("Error en la respuesta del servidor");
      }
      return r.json()
    }) 
    .then(datos => {
      // dispatch(guardarMaquinas(datos))
      setMaquinas(datos)
    })
    .catch(error => {
      console.error("Error al obtener las maquinas:", error);
    })
  }

  const cargarInsumos = () => {
    fetch(`${API_URL}/Insumo`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            }
        })
    .then(r =>{
      if(!r.ok){
        throw new Error("Error en la respuesta del servidor");
      }
      return r.json()
    }) 
    .then(datos => {
      setInsumos(datos)
    })
    .catch(error => {
      console.error("Error al obtener los insumos:", error);
    })
  }

  const filtrarMaquinas = () => {
    if(campoClienteElegidoId != ""){
      const clienteElegidoId = Number(campoClienteElegidoId)
      fetch(`${API_URL}/arrendamiento/arrendamiento/cliente/${clienteElegidoId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            }
        })
      .then(r =>{
        if(!r.ok){
          throw new Error("Error en la respuesta del servidor");
        }
        return r.json()
      }) 
      .then(datos => {
        const arrendamientos = datos
        setMaquinas(arrendamientos.map((a => a.maquina)))
      })
      .catch(error => {
        console.error("Error al obtener las máquinas:", error);
      })
    }
    else{
      cargarMaquinas()
      // setMaquinas(listaMaquinas)
    }
  }

  const filtrarClientes = () => {
    if(campoMaquinaElegidaId != ""){
      const maquinaElegidaId = Number(campoMaquinaElegidaId)
      fetch(`${API_URL}/arrendamiento/arrendamiento/maquina/${maquinaElegidaId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            }
        })
      .then(r =>{
        if(!r.ok){
          throw new Error("Error en la respuesta del servidor");
        }
        return r.json()
      }) 
      .then(datos => {
        const arrendamientos = datos
        setClientes(arrendamientos.map((a => a.cliente)))
      })
      .catch(error => {
        console.error("Error al obtener los clientes:", error);
      })
    }
    else{
      cargarClientes()
    }
  }

  const handleChange = (event) => {
    if(insumosElegidos!="")
    setInsumosElegidos(event.target.value);
    else
    cargarInsumos()
    //Si queremos usar select multiple:
  //   const options = event.target.options;
  //   const values = [];

  //   for (let i = 0; i < options.length; i++) {
  //     if (options[i].selected) {
  //       values.push(options[i].value);
  //     }
    // }

  //   setInsumosElegidos(values);
  };

  const filtrarFichas = () => {
  
    const maqId = Number(campoMaquinaElegidaId)
    const cliId = Number(campoClienteElegidoId)
    const insId = Number(insumosElegidos)

    if(campoMaquinaElegidaId == "" && campoClienteElegidoId == "" && insumosElegidos == ""){
      cargarFichas()
      // setFichas(listaFichas)
    }
    else if(campoMaquinaElegidaId != "" && campoClienteElegidoId != "" && insumosElegidos != ""){
      //[HttpGet("Cliente/{clienteId}/Maquina/{maquinaId}/Insumo/{insumoId}")]
        fetch(`${API_URL}/fichaTecnica/cliente/${cliId}/maquina/${maqId}/insumo/${insId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            }
        })
      .then(r =>{
        if(!r.ok){
          throw new Error("Error en la respuesta del servidor");
        }
        return r.json()
      }) 
      .then(datos => {
        setFichas(datos)
        // console.log(fichas)
      })
      .catch(error => {
        console.error("Error al obtener las fichas:", error);
      })
    }
    else if(campoMaquinaElegidaId == "" && campoClienteElegidoId != "" && insumosElegidos != ""){
      //        [HttpGet("Cliente/{clienteId}/Insumo/{insumoId}")]
      fetch(`${API_URL}/fichaTecnica/cliente/${cliId}/insumo/${insId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            }
        })
      .then(r =>{
        if(!r.ok){
          throw new Error("Error en la respuesta del servidor");
        }
        return r.json()
      }) 
      .then(datos => {
        setFichas(datos)
        // console.log(fichas)
      })
      .catch(error => {
        console.error("Error al obtener las fichas:", error);
      })
    }
    else if(campoMaquinaElegidaId != "" && campoClienteElegidoId == "" && insumosElegidos != ""){
      //     [HttpGet("Maquina/{maquinaId}/Insumo/{insumoId}")]
      fetch(`${API_URL}/fichaTecnica/maquina/${maqId}/insumo/${insId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            }
        })
      .then(r =>{
        if(!r.ok){
          throw new Error("Error en la respuesta del servidor");
        }
        return r.json()
      }) 
      .then(datos => {
        setFichas(datos)
        // console.log(fichas)
      })
      .catch(error => {
        console.error("Error al obtener las fichas:", error);
      })
    }
    else if(campoMaquinaElegidaId != "" && campoClienteElegidoId != "" && insumosElegidos == ""){
      //        [HttpGet("Cliente/{clienteId}/Maquina/{maquinaId}")]
      fetch(`${API_URL}/fichaTecnica/cliente/${cliId}/maquina/${maqId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            }
        })
      .then(r =>{
        if(!r.ok){
          throw new Error("Error en la respuesta del servidor");
        }
        return r.json()
      }) 
      .then(datos => {
        setFichas(datos)
        // console.log(fichas)
      })
      .catch(error => {
        console.error("Error al obtener las fichas:", error);
      })
    }
    else if(campoMaquinaElegidaId == "" && campoClienteElegidoId == "" && insumosElegidos != ""){
      //        [HttpGet("Insumo/{id}")]
      fetch(`${API_URL}/fichaTecnica/insumo/${insId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            }
        })
      .then(r =>{
        if(!r.ok){
          throw new Error("Error en la respuesta del servidor");
        }
        return r.json()
      }) 
      .then(datos => {
        setFichas(datos)
        // console.log(fichas)
      })
      .catch(error => {
        console.error("Error al obtener las fichas:", error);
      })
    }
    else if(campoMaquinaElegidaId == "" && campoClienteElegidoId != "" && insumosElegidos == ""){
      //     
      fetch(`${API_URL}/fichaTecnica/cliente/${cliId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            }
        })
      .then(r =>{
        if(!r.ok){
          throw new Error("Error en la respuesta del servidor");
        }
        return r.json()
      }) 
      .then(datos => {
        setFichas(datos)
        // console.log(fichas)
      })
      .catch(error => {
        console.error("Error al obtener las fichas:", error);
      })
    }
    else if(campoMaquinaElegidaId != "" && campoClienteElegidoId == "" && insumosElegidos == ""){
      //          [HttpGet("Maquina/{id}")]
      fetch(`${API_URL}/fichaTecnica/maquina/${maqId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            }
        })
      .then(r =>{
        if(!r.ok){
          throw new Error("Error en la respuesta del servidor");
        }
        return r.json()
      }) 
      .then(datos => {
        setFichas(datos)
        // console.log(fichas)
      })
      .catch(error => {
        console.error("Error al obtener las fichas:", error);
      })
    }
  }


  const handleModificar = (idFicha) => {
    navigate(`/modificarFicha/${idFicha}`)
  }

  const handleEliminar = (idFicha) => {
    fetch(`${API_URL}/fichaTecnica/${idFicha}`, {
      method: 'DELETE',
      headers: {
      'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`

      }
    })
    .then(async (r) => {
      if (r.status === 204) {
          toast("Ficha eliminada");
          console.log(r.status)
          setFichas(prev => prev.filter(c => c.id !== idFicha));
      } else {
          console.log(r.status)
          toast(r.mensaje || "Error eliminando ficha");
      }
    })
    .catch((err) => {
      console.log("Error en la conexión: " + err)
      toast("Error de conexión al eliminar ficha");
    });
  }

  const mostrarNombreEmpresa = (id) => {
    
    const cliente = clientes.find(c => c.id === Number(id))
    if(cliente != undefined) return cliente.nombreEmpresa 
  }

  const mostrarNumeroMaquina = (id) => {
    const maquina = maquinas.find(m => m.id === Number(id))
    if (maquina != undefined) return maquina.numero
  }

  const formatearFechaHora = (fechaISO) => {
    const fecha = new Date(fechaISO); // convierte desde UTC a local automáticamente
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const anio = fecha.getFullYear();
    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');

    return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
  }

  return (
    <div className="contenedor-menu">

<div className="ver-fichas">
  <h1>Fichas Técnicas</h1>

  <button onClick={() => navigate('/nuevaFichaTecnica', { state: { from: 'fichasTecnicas' } })}>
    Crear Ficha Técnica
  </button>

  <label>Seleccionar Cliente: 
    <select value={campoClienteElegidoId} onChange={(e) => {
      setCampoClienteElegidoId(e.target.value);
      filtrarMaquinas(e.target.value);
    }}>
      <option value="">Todos los Clientes</option>
      {clientes.map(m => <option key={m.id} value={m.id}>{m.nombreEmpresa}</option>)}
      {clientes.length === 0 && <option value="">No hay clientes para mostrar</option>}
    </select>
  </label>

  <label>Seleccionar Máquina: 
    <select value={campoMaquinaElegidaId} onChange={(e) => {
      setCampoMaquinaElegidaId(e.target.value);
      filtrarClientes(e.target.value);
    }}>
      <option value="">Todas las Máquinas</option>
      {maquinas.map(m => (
        <option key={m.id} value={m.id}>{m.numero} - {m.marca} - {m.modelo}</option>
      ))}
      {maquinas.length === 0 && <option value="">No hay maquinas para mostrar.</option>}
    </select>
  </label>

  <label>Seleccionar Insumo: 
    <select value={insumosElegidos} onChange={handleChange}>
      <option value="">Todos los Insumos</option>
      {insumos.map(i => <option key={i.id} value={i.id}>{i.nombreInsumo}</option>)}
      {insumos.length === 0 && <option value="">No hay insumos para mostrar.</option>}
    </select>
  </label>

  <button onClick={filtrarFichas}>Filtrar</button>

  <table>
    <tbody>
      {fichasPaginadas.map((ficha) => (
        <tr key={ficha.id}>
          <td data-label="Fecha">
            <Link to={`/verFichaTecnica/${ficha.id}`}>{formatearFechaHora(ficha.fechaYHora)}</Link>
          </td>
          <td data-label="Cliente">{mostrarNombreEmpresa(ficha.clienteId)}</td>
          <td data-label="Máquina">{mostrarNumeroMaquina(ficha.maquinaId)}</td>
          <td data-label="Modificar">
            <button onClick={() => handleModificar(ficha.id)}>Modificar</button>
          </td>
          <td data-label="Eliminar">
            <button className="eliminar" onClick={() => handleEliminar(ficha.id)}>Eliminar</button>
          </td>
        </tr>
      ))}
      {fichas.length === 0 && (
        <tr>
          <td colSpan={5} style={{ textAlign: "center" }}>No hay resultados</td>
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

export default FichasTecnicas