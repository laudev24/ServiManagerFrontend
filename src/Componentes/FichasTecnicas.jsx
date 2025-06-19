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

  const listaFichas=useSelector(state => state.fichasTecnicasSlice.fichasTecnicas);
  // const listaClientes=useSelector(state => state.clientesSlice.clientes);
  // const listaMaquinas=useSelector(state => state.maquinasSlice.maquinas);

  const [insumos, setInsumos] = useState([])
  const [insumosElegidos, setInsumosElegidos] = useState("") // Ojo que esta recibiendo ahora solo un insumo, pero la idea es que pueda recibir una lista
  const [clientes, setClientes] = useState([])
  const [maquinas, setMaquinas] = useState([])
  const [fichas, setFichas] = useState([])
  const [campoMaquinaElegidaId, setCampoMaquinaElegidaId] = useState("")
  const [campoClienteElegidoId, setCampoClienteElegidoId] = useState("")
  
 

  useEffect(() => {
    cargarFichas()
    cargarClientes()
    cargarMaquinas()
    cargarInsumos()
  }, [])

   const cargarFichas = () => {
    fetch("https://localhost:5201/api/fichaTecnica")
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
    fetch("https://localhost:5201/api/cliente")
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
    fetch("https://localhost:5201/api/maquina")
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
    fetch("https://localhost:5201/api/Insumo")
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
      fetch(`https://localhost:5201/api/arrendamiento/arrendamiento/cliente/${clienteElegidoId}`)
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
      fetch(`https://localhost:5201/api/arrendamiento/arrendamiento/maquina/${maquinaElegidaId}`)
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
        fetch(`https://localhost:5201/api/fichaTecnica/cliente/${cliId}/maquina/${maqId}/insumo/${insId}`)
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
      fetch(`https://localhost:5201/api/fichaTecnica/cliente/${cliId}/insumo/${insId}`)
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
      fetch(`https://localhost:5201/api/fichaTecnica/maquina/${maqId}/insumo/${insId}`)
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
      fetch(`https://localhost:5201/api/fichaTecnica/cliente/${cliId}/maquina/${maqId}`)
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
      fetch(`https://localhost:5201/api/fichaTecnica/insumo/${insId}`)
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
      fetch(`https://localhost:5201/api/fichaTecnica/cliente/${cliId}`)
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
      fetch(`https://localhost:5201/api/fichaTecnica/maquina/${maqId}`)
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
    fetch(`https://localhost:5201/api/fichaTecnica/${idFicha}`, {
      method: 'DELETE',
      headers: {
      'Content-Type': 'application/json',
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
    <div>
      <h1>Fichas Técnicas</h1>
      <button onClick={() => navigate('/nuevaFichaTecnica', { state: { from: 'fichasTecnicas' }})} > 
        Crear Ficha Técnica
      </button> <br />
      <label>Seleccionar Cliente:
        <select value={campoClienteElegidoId}  onChange={(e) => {
          setCampoClienteElegidoId(e.target.value);
          filtrarMaquinas(e.target.value);
          }}>
          <option key="" value="">Todos los Clientes</option>
          {clientes.map(m => <option key={m.id} value={m.id}> {m.nombreEmpresa}</option>)}
          {clientes.length === 0 && (
            <option value="">No hay clientes para mostrar</option>
          )}
        </select> 
      </label>
      <br/>

      <label>Seleccionar Máquina:
        <select value={campoMaquinaElegidaId} onChange={(e) => {
          setCampoMaquinaElegidaId(e.target.value);
          filtrarClientes(e.target.value);
        }}>
          <option key="" value="">Todas las Máquinas</option>
          {maquinas.map(m => <option key={m.id} value={m.id}> {m.numero} - {m.marca} - {m.modelo} </option>)}
          {maquinas.length === 0 && (
            <option value="">No hay maquinas para mostrar.</option>
          )}
        </select> 
      </label>
      <br/>

      <label>Seleccionar Insumo:  
        <select /*multiple*/ value={insumosElegidos} onChange={handleChange}>
          <option key="" value="">Todos los Insumos</option>
          {insumos.map(i => <option key={i.id} value={i.id}>{i.nombreInsumo}</option>)}
          {insumos.length === 0 && (
            <option value="">No hay insumos para mostrar.</option>
          )}
        </select>
      </label>
      <br />

      <button onClick={filtrarFichas}>Filtrar</button>

      <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
        <tbody>
          {fichas.map((ficha) => (
            <tr key={ficha.id}>
              <td style={{ padding: "8px" }}>
                <span style={{ marginLeft: "10px" }}><Link to={`/verFichaTecnica/${ficha.id}`}>{formatearFechaHora(ficha.fechaYHora)}</Link></span>
              </td>
              <td style={{ padding: "8px" }}>
                <span style={{ marginLeft: "10px" }}>{mostrarNombreEmpresa(ficha.clienteId)}</span>
              </td>
               <td style={{ padding: "8px" }}>
                <span style={{ marginLeft: "10px" }}>{mostrarNumeroMaquina(ficha.maquinaId)}</span>
              </td>
              
              <td style={{ padding: "8px" }}>
                <button onClick={() => handleModificar(ficha.id)}>Modificar</button>
              </td>
              <td style={{ padding: "8px" }}>
                <button onClick={() => handleEliminar(ficha.id)} style={{ color: "red" }}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {fichas.length === 0 && (
            <tr key="noResult">
              <td colSpan={5} style={{ textAlign: "center" }}>No hay resultados</td>
            </tr>
          )}
        </tbody>
      </table> 
    </div>
  )
}

export default FichasTecnicas