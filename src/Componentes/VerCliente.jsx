import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom';

const VerCliente = () => {
    const { id } = useParams();

    const listaClientes = useSelector(state => state.clientesSlice.clientes);
    const cliente = listaClientes.find(c => c.id === Number(id))

    useEffect(() => {
        if(listaClientes.length==0){
            fetch("https://localhost:5201/api/cliente")
            .then(r =>{
                if(!r.ok){
                    throw new Error("Error en la respuesta del servidor");
                }
                return r.json()
                }) 
            .then(datos => {
                setClientesFiltrados(datos)
                dispatch(guardarClientes(datos))
            })
            .catch(error => {
                console.error("Error al obtener los clientes:", error);
            })
        }
    }, [])

    if (!cliente) {
        return <p>Cargando cliente o cliente no encontrado...</p>;
    }

    // const maquinasAsociadas = []
    
    return (
        <div>
            <h1>Datos del cliente</h1>
            <Link to ={`/asociarMaquinas/${id}`}>Asociar Máquinas</Link>
                <table>
                    <tbody>
                        <tr>
                            <td>Nombre de la empresa: </td>
                            <td>{cliente.nombreEmpresa}</td>
                        </tr>  
                    </tbody>
                
                  
                </table>
                {/* <label>Máquinas asociadas:
                    <table>

                    </table>
                </label> */}
        </div>
    )
}

export default VerCliente