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
            <Link to ={`/modificarCliente/${id}`}>Modificar Cliente</Link><br />
            <Link to ={`/asociarMaquinas/${id}`}>Asociar Máquinas</Link>
                <table>
                    <tbody>
                        <tr>
                            <th>Nombre de la empresa: </th>
                            <td>{cliente.nombreEmpresa}</td>
                        </tr> 
                         <tr>
                            <th>Categoría: </th>
                            <td>{cliente.categoria}</td>
                        </tr> 
                         <tr>
                            <th>Dirección: </th>
                            <td>{cliente.direccion}</td>
                        </tr> 
                         <tr>
                            <th>Nombre del contacto: </th>
                            <td>{cliente.nombreContacto}</td>
                        </tr> 
                         <tr>
                            <th>Teléfono/Celular de contacto: </th>
                            <td>{cliente.telefono}</td>
                        </tr>
                         <tr>
                            <th>Correo electrónico: </th>
                            <td>{cliente.email}</td>
                        </tr>
                         <tr>
                            <th>RUT: </th>
                            <td>{cliente.rut}</td>
                        </tr>  
                         <tr>
                            <th>Fecha de pago: </th>
                            <td>{cliente.fechaPago}</td>
                        </tr>  
                         <tr>
                            <th>Nombre de usuario: </th>
                            <td>{cliente.fechaPago}</td>
                        </tr>  
                    </tbody>
                
                  
                </table>
                <h2>Máquinas asociadas:</h2>
                    <table>

                    </table>
        </div>
    )
}

export default VerCliente