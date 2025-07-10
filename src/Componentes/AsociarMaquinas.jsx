import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { guardarMaquinas } from '../features/maquinasSlice';

const AsociarMaquinas = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    // const tokenSelector = useSelector(state => state.usuarioSlice.token)
    // const [token, setToken] = useState("")
    const token = localStorage.getItem("token")
    
    
    const maquinas = useSelector(state => state.maquinasSlice.maquinas);
    const [maquinaElegida, setMaquinaElegida] = useState(null)
    const [maquinasAsociadas, setMaquinasAsociadas] = useState([])
    
    const campoIdMaquinaElegida = useRef("")
    const campoCargoFijo = useRef("")
    const campoCostoColor = useRef("")
    const campoCostoBYN = useRef("")

    const clientes = useSelector(state => state.clientesSlice.clientes);
    const cliente = clientes.find(c => c.id === Number(id))

    const mostrarFormulario = () => {
        setMaquinaElegida(maquinas.find(c => c.id === Number(campoIdMaquinaElegida)))
    }

    useEffect(() => {
       if(!localStorage.getItem("token"))
      navigate("/")
       if(localStorage.getItem("esAdmin") === "false")
      navigate("/Inicio")
    
        if(!maquinas.length)cargarMaquinas()
        if(!maquinasAsociadas.length)traerMaquinasDelCliente()
        if(!clientes.length)traerClientes()
    }, [maquinas, clientes]);

    const cargarMaquinas = () => {
        fetch("https://localhost:5201/api/maquina", {
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
            dispatch(guardarMaquinas(datos))

        })
        .catch(error => {
            console.error("Error al obtener las maquinas:", error);
        })
    }

    const traerMaquinasDelCliente = () => {
        fetch(`https://localhost:5201/api/cliente/maquinas-del-cliente?id=${id}`, {
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
            setMaquinasAsociadas(datos)
        })
        .catch(error => {
            console.error("Error al obtener las maquinas:", error);
        })
    
    }
    const traerClientes = () => {
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

    const asociar = () => {
        const idMaquina = Number(campoIdMaquinaElegida.current.value);
        const maquinaElegida = maquinas.find(m => m.id === idMaquina);
        const arrendamiento = {
            clienteId : Number(id),
            maquinaId : idMaquina,
            fechaInicio : null,
            fechaFin : null,
            activo : null,
            cargoFijo : campoCargoFijo.current.value,
            costoPorCopiaBYN : campoCostoBYN.current?.value ?? null,
            costoPorCopiaColor : campoCostoColor.current?.value ?? null
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
                toast("Máquina asociada con exito")
                // Actualizar la lista de máquinas asociadas
                traerMaquinasDelCliente()
            }
        })
        .catch((error) => {
            console.error("Error al asociar máquina: ", error.message);
            toast("Error al asociar máquina.");
        });

    }

  return (
    <div className="contenedor-menu">

<div className="formulario-cliente">
  <h1>Asociar Máquina al Cliente {cliente.nombreEmpresa}</h1>

  <select ref={campoIdMaquinaElegida} onChange={mostrarFormulario}>
    <option value="">Elegir máquina</option>
    {maquinas.map((maquina) => (
      <option key={maquina.id} value={maquina.id}>
        {maquina.numero} - {maquina.marca} - {maquina.modelo}
      </option>
    ))}
    {maquinas.length === 0 && (
      <option key="">No hay máquinas para mostrar.</option>
    )}
  </select>

  <label>
    Cargo fijo:
    <input type="text" ref={campoCargoFijo} />
  </label>

  {maquinaElegida?.tipoImpresion === 'Color' && (
    <label>
      Costo por Copia Color:
      <input type="text" ref={campoCostoColor} />
    </label>
  )}

  {maquinaElegida?.tipoImpresion === 'B&N' && (
    <label>
      Costo por Copia B&N:
      <input type="text" ref={campoCostoBYN} />
    </label>
  )}

  <input type="button" value="Asociar Máquina" onClick={asociar} />

  <h2>Máquinas asociadas:</h2>

  <table>
    <tbody>
      {maquinasAsociadas.map((maquina) => (
        <tr key={maquina.id}>
          <td>
            {maquina.numero} - {maquina.marca} - {maquina.modelo}
          </td>
        </tr>
      ))}
      {maquinasAsociadas.length === 0 && (
        <tr>
          <td>No hay máquinas asociadas a este cliente.</td>
        </tr>
      )}
    </tbody>
  </table>
</div>
</div>

  )
}

export default AsociarMaquinas