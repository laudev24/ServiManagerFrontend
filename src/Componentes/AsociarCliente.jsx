import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { guardarClientes } from '../features/clientesSlice';

const AsociarCliente = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const token = localStorage.getItem("token")
    const API_URL=import.meta.env.VITE_API_URL
    let navigate = useNavigate();
        
    const clientes = useSelector(state => state.clientesSlice.clientes);
    const [clientesAsociados, setClientesAsociados] = useState([])
    const [maquina, setMaquina] = useState("")
    
    const campoIdClienteElegido = useRef("")
    const campoCargoFijo = useRef("")
    const campoCostoColor = useRef("")
    const campoCostoBYN = useRef("")


    useEffect(() => {
        if(!clientes.length)cargarClientes()
        cargarClientesAsociados()

    }, [clientes])

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
            dispatch(guardarClientes(datos))

        })
        .catch(error => {
            console.error("Error al obtener los clientes:", error);
        })
    }
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
 

    const asociar = () => {
        const idCliente = Number(campoIdClienteElegido.current.value)
        const arrendamiento = {
            clienteId : idCliente,
            maquinaId : Number(id),
            fechaInicio : null,
            fechaFin : null,
            activo : null,
            cargoFijo : parseFloat(campoCargoFijo.current.value.replace(',', '.')),
            costoPorCopiaBYN : campoCostoBYN.current?.value
    ? parseFloat(campoCostoBYN.current.value.replace(',', '.'))
    : null,
             costoPorCopiaColor: maquinaElegida?.tipoImpresion === "Color" &&
    campoCostoColor.current?.value
    ? parseFloat(campoCostoColor.current.value.replace(',', '.'))
    : null,
        }
        // console.log("Enviando: " + JSON.stringify(arrendamiento))
     

        fetch(`${API_URL}/arrendamiento`, {
            method: 'POST',
            body: JSON.stringify(arrendamiento),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
               'Authorization': `Bearer ${token}`
            },
        })
        .then((response) => {
            response.json()
            console.log(response)
            if(response.status===201){
                toast("Cliente asociado con exito")
                cargarClientesAsociados()
            }
        })
        .catch((error) => {
            console.error("Error al asociar cliente: ", error.message); 
            toast("Error al asociar cliente.");
        });
    }


  return (
    <div className="contenedor-menu">

<div className="contenedor-secundario">
  <h1>Asociar Clientes a la Máquina {maquina.numero}</h1>

  <select ref={campoIdClienteElegido}>
    <option value="">Elegir cliente</option>
    {clientes.map((cliente) => (
      <option key={cliente.id} value={cliente.id}>{cliente.nombreEmpresa}</option>
    ))}
    {clientes.length === 0 && (
      <option key="">No hay clientes para mostrar.</option>
    )}
  </select>

  <label>
    Cargo fijo:
    <input type="text" ref={campoCargoFijo} />
  </label>

  {maquina?.tipoImpresion === "Color" && (
    <label>
      Costo por Copia Color:
      <input type="text" ref={campoCostoColor} />
    </label>
  )}

  
    <label>
      Costo por Copia B/N:
      <input type="text" ref={campoCostoBYN} />
    </label>
  

  <input type="button" value="Asociar Cliente" onClick={asociar} />

  <h2>Clientes asociados:</h2>

  <table>
    <tbody>
      {clientesAsociados.map((cliente) => (
        <tr key={cliente.id}>
          <td>{cliente.nombreEmpresa}</td>
        </tr>
      ))}
      {clientesAsociados.length === 0 && (
        <tr>
          <td>No hay clientes asociados a esta máquina.</td>
        </tr>
      )}
    </tbody>
  </table>
</div>
</div>
  )
}

export default AsociarCliente