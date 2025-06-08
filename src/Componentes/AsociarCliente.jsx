import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { guardarClientes } from '../features/clientesSlice';

const AsociarCliente = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
        
    const clientes = useSelector(state => state.clientesSlice.clientes);
    const maquinas = useSelector(state => state.maquinasSlice.maquinas);
    
    const campoIdClienteElegido = useRef("")
    
    const maquina = maquinas.find(c => c.id === Number(id))
    // const clienteElegido = clientes.find(c => c.id === Number(campoIdClienteElegido)) 
    const clientesAsociados = []

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

    const asociar = () => {
        const arrendamiento = {
            cliente : Number(campoIdClienteElegido.current.value),
            maquina : Number(id),
            fechaInicio : new Date().toISOString(),
            fechaFin : null,
            activo : true,
            cargoFijo : campoCargoFijo.current.value,
        costoPorCopiaBYN : campoCostoBYN.current.value,
            costoPorCopiaColor : campoCostoColor.current.value
        }
    
        fetch("https://localhost:5201/api/maquina", {
            method: 'POST',
            body: JSON.stringify(arrendamiento),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then((response) => response.json())
        .then((datos) => {
            console.log(datos.codigo)
            if(datos.codigo===201 || datos.codigo === undefined){
                console.log(datos.mensaje);
                toast("Cliente asociado con éxito.")
                console.log(maquina)
            }
            else {
                console.log(datos.mensaje)
                toast(datos.mensaje);
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
        <select className="clientes" ref={campoIdClienteElegido}  >
            <option value="">Elegir cliente</option>
            {clientes.map((cliente) => (
                <option key={cliente.id}>{cliente.nombreEmpresa}</option>
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
        {maquina?.tipoImpresion == 'B&N' && 
        <label>Costo por Copia B&N:
            <input type="text" className='costoBYN' ref={campoCostoBYN}/>
        </label>}
        <input type="button" value="Asociar Cliente" onClick={asociar}/><br />
        <h2>Clientes asociados:</h2>
        <table>
            <tr>
                {clientesAsociados.map((cliente) => (
                <td key={cliente.id}>{cliente.nombreEmpresa}</td>
                ))}
                {clientesAsociados.length===0 && <td key="">No hay clientes asociados a esta máquina.</td>}
            </tr>
        </table>
    </div>
  )
}

export default AsociarCliente