import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const VerMaquina = () => {
  const { id } = useParams()
  let navigate = useNavigate()
  const [maquina, setMaquina] = useState("")
  const [clientesAsociados, setClientesAsociados] = useState([])

  useEffect(() => {
    fetch(`https://localhost:5201/api/maquina/${id}`)
    .then(r =>{
      if(!r.ok){
        throw new Error("Error en la respuesta del servidor");
      }
      return r.json()
    }) 
    .then(datos => {
      setMaquina(datos)
    })
    .catch(error => {
      console.error("Error al obtener la máquina:", error);
    })
  }, [maquina])

  const cargarClientesAsociados = () => {
    fetch(`https://localhost:5201/api/arrendamiento/arrendamiento/maquina/${id}`)
      .then(r =>{
      if(!r.ok){
        throw new Error("Error en la respuesta del servidor");
      }
      return r.json()
      }) 
      .then(datos => {
        const arrendamientos = datos
        setClientesAsociados(arrendamientos.map((a => a.cliente)))
      })
      .catch(error => {
        console.error("Error al obtener los clientes:", error);
      })
  }
  
  useEffect(() => {
    cargarClientesAsociados()
  }, [])

  const ConfirmToast = ({ onConfirm, onCancel }) => (
    <div>
        <p>¿Estás seguro que deseas desasociar el cliente?</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <button onClick={onConfirm}>Sí</button>
        <button onClick={onCancel}>No</button>
        </div>
    </div>
  )
  
  const mostrarToast = (idCliente) => {
    // const cliente = clientesAsociados.find(c => c.id === Number(idCliente))

    const id = toast(
      <ConfirmToast
        onConfirm={() => {
          toast.dismiss(id);
          console.log('Confirmado');
          desasociar(idCliente)
        }}
        onCancel={() => {
          toast.dismiss(id);
          console.log('Cancelado');
        }}
      />,
      { autoClose: false }
    );
  };
  
  const desasociar = (idCliente) => {
    const cliente = clientesAsociados.find(c => c.id === Number(idCliente))
  
    fetch(`https://localhost:5201/api/arrendamiento/${idCliente}/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(async (r) => {
      if (r.status === 204) {
        toast(`Cliente ${cliente.nombreEmpresa} desasociado.`);
        console.log(r.status)
        cargarClientesAsociados()
      } else {
        console.log(r.status)
        toast(r.mensaje || "Error desasociando cliente");
      }
    })
    .catch((err) => {
      console.log("Error en la conexión: " + err)
      toast("Error de conexión al desasociar cliente");
    });
  }

  const mostrarFichas = () => {
    navigate(`/fichasMaquina/${id}`)
  }

  return (
    <div>  
      <h1>Datos de la Máquina</h1>
      <Link to ={`/asociarCliente/${id}`}>Asociar Cliente</Link>
      <button onClick={mostrarFichas}>Ver fichas</button>
      <table>
        <tbody>
          <tr>
              <td>Número: </td>
              <td>{maquina.numero}</td>
          </tr>
           <tr>
              <td>Marca: </td>
              <td>{maquina.marca}</td>
          </tr>
           <tr>
              <td>Modelo: </td>
              <td>{maquina.modelo}</td>
          </tr>
           <tr>
              <td>Año: </td>
              <td>{maquina.año}</td>
          </tr>
        </tbody>

      </table>
      <h2>Cliente/s asociado/s:</h2>
        <table>
          <tbody>
            {clientesAsociados.map((cliente) => (
              <tr key={cliente.id}>
                <td key={cliente.id}>{cliente.nombreEmpresa}</td>
                <td> <button onClick={() => mostrarToast(cliente.id)}  style={{ color: "red" }}>Desasociar </button></td>
              </tr>
              ))} 
          </tbody>
        </table>
    </div>
  )
}

export default VerMaquina