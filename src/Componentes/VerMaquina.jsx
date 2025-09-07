import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const VerMaquina = () => {
  const { id } = useParams()
  let navigate = useNavigate()
  const token = localStorage.getItem("token")
  const API_URL=import.meta.env.VITE_API_URL
  
  const [maquina, setMaquina] = useState("")
  const [clientesAsociados, setClientesAsociados] = useState([])

  useEffect(() => {
    
    fetch(`${API_URL}/maquina/${id}`, {
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
      setMaquina(datos)
    })
    .catch(error => {
      console.error("Error al obtener la máquina:", error);
    })
  }, [maquina])

  const cargarClientesAsociados = () => {
    fetch(`${API_URL}/arrendamiento/arrendamiento/maquina/${id}`, {
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
          // console.log('Confirmado');
          desasociar(idCliente)
        }}
        onCancel={() => {
          toast.dismiss(id);
          // console.log('Cancelado');
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
        'Authorization': `Bearer ${token}`

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

  const irAAssociarCliente = () => {
    navigate(`/asociarCliente/${id}`)
  }

  const mostrarFichas = () => {
    navigate(`/fichasMaquina/${id}`)
  }

   const handleModificar = (id) => {
    navigate(`/modificarMaquina/${id}`)
  }

  return (
    <div className="contenedor-menu">

<div className="contenedor-secundario">
  <h1>Datos de la Máquina {maquina.numero}</h1>
  <button onClick={irAAssociarCliente}>Asociar Cliente</button>  
  <button className="btn-contrasenia" onClick={mostrarFichas}>Ver fichas</button>

  <table>
     <thead>
            <tr>
              <th>Número de matrícula</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th></th>
            </tr>
          </thead>
    <tbody>

      <tr><td data-label="Número de matrícula">{maquina.numero}</td></tr>
      <tr><td data-label="Marca">{maquina.marca}</td></tr>
      <tr><td data-label="Modelo">{maquina.modelo}</td></tr>
      <tr>
        <td data-label="Modificar">
          <button onClick={() => handleModificar(maquina.id)}>Modificar</button>
        </td>
      </tr>
    </tbody>
  </table>

  <h2>Cliente/s asociado/s:</h2>

  <table>
    <tbody>
      {clientesAsociados.map((cliente) => (
        <tr key={cliente.id}>
          <td data-label="Cliente">{cliente.nombreEmpresa}</td>
          <td data-label="Acción">
            <button className="eliminar" onClick={() => mostrarToast(cliente.id)}>
              Desasociar
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
</div>

  )
}

export default VerMaquina