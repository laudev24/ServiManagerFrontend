import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Maquinas = () => {
  console.log("🔍 Renderizando componente Maquinas");
  const [maquinasFiltradas, setMaquinasFiltradas] = useState([])
  const navigate = useNavigate();


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
      })
      .catch(error => {
          console.error("Error al obtener las maquinas:", error);
      })
  }, [])

  const handleModificar = (id) => {
      navigate(`/modificarMaquina/${id}`) 
  }

  const handleEliminar = (idMaquina) => { 
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
      } else {
        console.log(r.status)
        toast("Error eliminando máquina");
      }
    })
    .catch((err) => {
      console.log("Error en la conexión: " + err)
      toast("Error de conexión al eliminar maquina");
    });
  }
  return (
    <div>
      <h1>Máquinas</h1>
      <Link to="/nuevaMaquina">Crear nueva máquina</Link> <br />
      <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
        <tbody>
          {maquinasFiltradas.map((maquina) => (
            <tr key={maquina.id}>
              <td style={{ padding: "8px" }}>
                <span style={{ marginLeft: "10px" }}>{maquina.numero}</span>
              </td>
              <td style={{ padding: "8px" }}>
                <span style={{ marginLeft: "10px" }}>{maquina.marca}</span>
              </td>
               {/* <td style={{ padding: "8px" }}>
                <span style={{ marginLeft: "10px" }}>{maquina.modelo}</span>
              </td> */}
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