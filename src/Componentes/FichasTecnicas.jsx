import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from "react-redux";
import { guardarMaquinas, eliminarMaquina } from "../features/maquinasSlice";
import { guardarClientes } from '../features/clientesSlice' 


const FichasTecnicas = () => {
    const dispatch = useDispatch();

    const listaClientes=useSelector(state => state.clientesSlice.clientes);
    const campoClienteElegidoId = useRef("")
    const [maquinasAsociadas, setMaquinasAsociadas] = useState([])


     useEffect(() => {
        // fetch("https://localhost:5201/api/cliente")
        // .then(r =>{
        //     if(!r.ok){
        //         throw new Error("Error en la respuesta del servidor");
        //     }
        //     return r.json()
        //     }) 
        // .then(datos => {
        //     dispatch(guardarClientes(datos))
        // })
        // .catch(error => {
        //     console.error("Error al obtener los clientes:", error);
        // })
    }, [])

    const mostrarMaquinasAsociadas = () => {
      // fetch("https://localhost:5201/api/maquina")
      //   .then(r =>{
      //       if(!r.ok){
      //           throw new Error("Error en la respuesta del servidor");
      //       }
      //       return r.json()
      //       }) 
      //   .then(datos => {
      //       setMaquinasAsociadas(datos)
      //   })
      //   .catch(error => {
      //       console.error("Error al obtener las maquinas asociadas a este cliente:", error);
      //   })
    }

    const filtrarFichas = () => {

    }



  return (
    <div>
{/* <h1>Máquinas</h1>
      <Link to="/nuevaFichaTecnica">Crear nueva Ficha Técnica</Link> <br />
      
      <select value={clienteElegidoId} ref={campoClienteElegidoId} onChange={mostrarMaquinasAsociadas}>
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
      <br/>

      <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
        <tbody>
          <thead>
              <th>Numero</th><th>Marca</th><th>Modelo</th><th>Arrendada</th><th></th><th></th>
          </thead>
          {maquinasPorNumero.map((maquina) => (
            <tr key={maquina.id}><Link to={`/verMaquina/${maquina.id}`}>
              <td style={{ padding: "8px" }}>
                <span style={{ marginLeft: "10px" }}>{maquina.numero}</span>
              </td>
              <td style={{ padding: "8px" }}>
                <span style={{ marginLeft: "10px" }}>{maquina.marca}</span>
              </td>
               <td style={{ padding: "8px" }}>
                <span style={{ marginLeft: "10px" }}>{maquina.modelo}</span>
              </td>
              </Link>
               <td style={{ padding: "8px" }}>
                <span style={{ marginLeft: "10px" }}>{arrendada(maquina.id)}</span>
              </td>
              <td style={{ padding: "8px" }}>
                <button onClick={() => handleModificar(maquina.id)}>Modificar</button>
              </td>
              <td style={{ padding: "8px" }}>
                <button onClick={() => handleEliminar(maquina.id)} style={{ color: "red" }}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {maquinasFiltradas.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: "center" }}>No hay resultados</td>
            </tr>
          )}
        </tbody>
      </table>   */}
    </div>
  )
}

export default FichasTecnicas