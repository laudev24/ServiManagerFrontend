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
  const listaClientes=useSelector(state => state.clientesSlice.clientes);
  const listaMaquinas=useSelector(state => state.maquinasSlice.maquinas);


  useEffect(() => {
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
    })
    .catch(error => {
      console.error("Error al obtener las fichas:", error);
    })
  }, [])

  useEffect(() => {
    fetch("https://localhost:5201/api/cliente")
    .then(r =>{
      if(!r.ok){
        throw new Error("Error en la respuesta del servidor");
      }
      return r.json()
    }) 
    .then(datos => {
      dispatch(guardarClientes(datos))
    })
    .catch(error => {
      console.error("Error al obtener los clientes:", error);
    })
  }, [])

  useEffect(() => {
    fetch("https://localhost:5201/api/maquina")
    .then(r =>{
      if(!r.ok){
        throw new Error("Error en la respuesta del servidor");
      }
      return r.json()
    }) 
    .then(datos => {
      dispatch(guardarMaquinas(datos))
    })
    .catch(error => {
      console.error("Error al obtener las maquinas:", error);
    })
  }, [])  

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
            // setClientesFiltrados(prev => prev.filter(c => c.id !== idFicha));
            dispatch(eliminarFichaTecnica(idFicha))
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
// console.log("🔎 Fichas con posibles IDs duplicados:", listaFichas.map(f => f.id));

  const mostrarNombreEmpresa = (id) => {
    const cliente = listaClientes.find(c => c.id === Number(id))
    if(cliente != undefined) return cliente.nombreEmpresa 
  }

  const mostrarNumeroMaquina = (id) => {
    const maquina = listaMaquinas.find(m => m.id === Number(id))
    if (maquina != undefined) return maquina.numero
  }

  return (
    <div>
      <h1>Fichas Técnicas</h1>
      <Link to="/nuevaFichaTecnica">Crear Ficha Técnica</Link> <br />
      
      {/* <select value={clienteElegidoId} ref={campoClienteElegidoId} onChange={mostrarMaquinasAsociadas}>
        <option key="" value="">Seleccionar Cliente:</option>
        {listaClientes.map(m => <option key={m.id} value={m.id}> {m.nombreEmpresa}</option>)}
        {listaClientes.length === 0 && (
          <option value="">No hay clientes para mostrar</option>
        )}
      </select> 
      <br/>

      <select ref={campoMaquinaElegida} onChange={filtrarFichas}>
        <option key="" value="">Seleccionar Máquina:</option>
        {maquinasAsociadas.map(m => <option key={m.id} value={m.id}> {m.numero} - {m.marca} - {m.modelo} </option>)}
        {maquinasAsociadas.length === 0 && (
          <option value="">No hay maquinas asociadas a este cliente.</option>
        )}
      </select> 
      <br/> */}

      <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
        <tbody>
          {listaFichas.map((ficha) => (
            <tr key={ficha.id}>
              <td style={{ padding: "8px" }}>
                <span style={{ marginLeft: "10px" }}><Link to={`/verFichaTecnica/${ficha.id}`}>{ficha.fechaYHora}</Link></span>
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
          {listaFichas.length === 0 && (
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