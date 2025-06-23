import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { guardarClientes } from '../features/clientesSlice';

const AsociarCliente = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
     const tokenSelector = useSelector(state => state.usuarioSlice.token)
    // const [token, setToken] = useState("")
    const token = localStorage.getItem("token")

        
    const clientes = useSelector(state => state.clientesSlice.clientes);
    const [clientesAsociados, setClientesAsociados] = useState([])
    const [maquina, setMaquina] = useState("")
    
    const campoIdClienteElegido = useRef("")
    const campoCargoFijo = useRef("")
    const campoCostoColor = useRef("")
    const campoCostoBYN = useRef("")


    useEffect(() => {
        // if(token==="")setToken(localStorage.getItem("token"))
        //     else setToken(tokenSelector)
        if(clientes.length===0)cargarClientes
        cargarClientesAsociados()

    }, [])

    const cargarClientes = () => {
        fetch("https://localhost:5201/api/cliente", {
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
        fetch(`https://localhost:5201/api/arrendamiento/arrendamiento/maquina/${id}`, {
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
            cargoFijo : campoCargoFijo.current.value,
            costoPorCopiaBYN : campoCostoBYN.current.value,
            costoPorCopiaColor : campoCostoColor.current.value
        }
        console.log("Enviando: " + JSON.stringify(arrendamiento))
     

        fetch("https://localhost:5201/api/arrendamiento", {
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
    <div>
        <h1>Asociar Clientes a la Máquina {maquina.numero}</h1>
        <select className="clientes" ref={campoIdClienteElegido}  /*onChange={mostrarFormulario}*/ >
            <option value="">Elegir cliente</option>
            {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>{cliente.nombreEmpresa}</option>
            ))}
            {clientes.length===0 && <option key="">No hay clientes para mostrar.</option>}
        </select><br />
        <label>Cargo fijo:
            <input type="text" className='cargoFijo' ref={campoCargoFijo}/>
        </label><br />
        {maquina?.tipoImpresion == 'Color' && 
        <label>Costo por Copia Color:
            <input type="text" className='costoColor' ref={campoCostoColor}/>
        </label>}
        {maquina?.tipoImpresion == 'Monocromatico' && 
        <label>Costo por Copia B&N:
            <input type="text" className='costoBYN' ref={campoCostoBYN}/>
        </label>}
        <input type="button" value="Asociar Cliente" onClick={asociar}/><br />
        <h2>Clientes asociados:</h2>
        <table>
            <tbody>
                    {clientesAsociados.map((cliente) => (
                        <tr>
                            <td key={cliente.id}>{cliente.nombreEmpresa}</td>
                        </tr>
                    ))}
                    {clientesAsociados.length===0 && <tr><td key="">No hay clientes asociados a esta máquina.</td></tr>}
                
            </tbody>
        </table>
    </div>
  )
}

export default AsociarCliente