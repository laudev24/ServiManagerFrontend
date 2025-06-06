import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from "react-redux";
import { guardarMaquinas, eliminarMaquina } from "../features/maquinasSlice";



const Maquinas = () => {
  const [maquinasFiltradas, setMaquinasFiltradas] = useState([])
  const [marcas, setMarcas] = useState([])
  const [modelos, setModelos] = useState([])
  const marcaElegidaId = useRef("")
  const modeloElegidoId = useRef("")
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const listaMaquinas = useSelector(state => state.maquinasSlice.maquinas);


  // Pedir al backend el listado de maquinas 
  useEffect(() => {
      fetch("https://localhost:5201/api/maquina")
      .then(r =>{
            if(!r.ok){
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
  }, [])

  //Pedir al backend el listado de marcas
  // useEffect(() => {
  //     fetch("https://localhost:5201/api/maquina")
  //     .then(r =>{
  //           if(!r.ok){
  //               throw new Error("Error en la respuesta del servidor");
  //           }
  //           return r.json()
  //           })
  //     .then(datos => {
  //         setMarcas(datos)
  //     })
  //     .catch(error => {
  //         console.error("Error al obtener las marcas:", error);
  //     })
  // }, [])

  const mostrarModelos = (e) => {
  //   fetch("https://localhost:5201/api/maquina")
  //   .then(r =>{
  //     if(!r.ok){
  //       throw new Error("Error en la respuesta del servidor");
  //     }
  //     return r.json()
  //   })
  //   .then(datos => {
  //     setModelos(datos)
  //   })
  //   .catch(error => {
  //     console.error("Error al obtener los modelos:", error);
  //   })
  }

  const filtrarMaquinas = () => {
  //   const marcaElegida = marcas.find(marcaElegidaId => marcaElegidaId === id)
  //   const modeloElegido = modelos.find(modeloElegidoId => modeloElegidoId === id)
  //   const maquinasPorModelo=[]
  //   if(marcaElegida != "" || modeloElegido != ""){
  //    for(m in maquinasFiltradas){
  //       if(m.marca == marcaElegida || m.modelo == modeloElegido) maquinasPorModelo.push(m)
  //     }
  //     setMaquinasFiltradas(maquinasPorModelo)
  //   }
  //   else{
  //     setMaquinasFiltradas(listaMaquinas)
  //   }
  }


  const handleModificar = (id) => {
      navigate(`/modificarMaquina/${id}`) 
  }

  const handleEliminar = (idMaquina) => { 
    // const index = listaMaquinas.indexOf(idMaquina);
    const index = listaMaquinas.findIndex(m => m.id === idMaquina);


    fetch(`https://localhost:5201/api/maquina/${idMaquina}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(async (r) => {
      if (r.status === 204) {
        toast("Máquina eliminada");
        console.log(r.status)
        setMaquinasFiltradas(prev => prev.filter(c => c.id !== idMaquina));
        dispatch(eliminarMaquina(index))

      } else {
        console.log(r.status)
        toast("Error eliminando máquina");
      }
    })
    .catch((err) => {
      console.log("Error en la conexión: " + err)
      toast("Error de conexión al eliminar máquina");
    });
  }

  const arrendada = (id) =>{
    const maquina = maquinasFiltradas.find(m => m.id === id)
    if(maquina.arrendamientos.length != 0){
      if(maquina.arrendamientos[0].activo) 
        return "Sí"
      else return "No"
    }
  }



  return (
    <div>
      <h1>Máquinas</h1>
      <Link to="/nuevaMaquina">Registrar nueva máquina</Link> <br />
      
      <select value={marcaElegidaId} ref={marcaElegidaId} onChange={mostrarModelos}>
        <option key="" value="">Seleccionar Marca:</option>
        {marcas.map(m => <option key={m.id} value={m.id}> {m.nombre}</option>)}
        {marcas.length === 0 && (
          <option value="">No hay marcas para mostrar</option>
        )}
      </select> 
      <br/>

      <select ref={modeloElegidoId} onChange={filtrarMaquinas}>
        <option key="" value="">Seleccionar Modelo:</option>
        {modelos.map(m => <option key={m.id} value={m.id}> {m.nombre} </option>)}
        {modelos.length === 0 && (
          <option value="">No hay modelos para mostrar</option>
        )}
      </select> 
      <br/>

      <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
        <tbody>
          <thead>
            <tr>
              <th>Numero</th><th>Marca</th><th>Modelo</th><th>Arrendada</th><th></th><th></th>
            </tr>
          </thead>
          {maquinasFiltradas.map((maquina) => (
            <tr key={maquina.id}>
              <td style={{ padding: "8px" }}>
                <span style={{ marginLeft: "10px" }}>{maquina.numero}</span>
              </td>
              <td style={{ padding: "8px" }}>
                <span style={{ marginLeft: "10px" }}>{maquina.marca}</span>
              </td>
               <td style={{ padding: "8px" }}>
                <span style={{ marginLeft: "10px" }}>{maquina.modelo}</span>
              </td>
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
      </table>    
    </div>
  )
}

export default Maquinas