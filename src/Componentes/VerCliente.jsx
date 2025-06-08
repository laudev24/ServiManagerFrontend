import React from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom';

const VerCliente = () => {
    const { id } = useParams();

    const listaClientes = useSelector(state => state.clientesSlice.clientes);
    const cliente = listaClientes.find(c => c.id === Number(id))
    
    return (
        <div>
            <h1>Datos del cliente</h1>
            <Link to ={`/asociarMaquinas/${id}`}>Asociar Máquinas</Link>
                <table>
                    <tr>
                        <td>Nombre de la empresa: </td>
                        <td>{cliente.nombreEmpresa}</td>
                    </tr>
                    {/* <tr>
                        <td></td>
                        <td>{cliente.nombreEmpresa}</td>
                    </tr>
                     <tr>
                        <td>Nombre de la empresa</td>
                        <td>{cliente.nombreEmpresa}</td>
                    </tr>
                     <tr>
                        <td>Nombre de la empresa</td>
                        <td>{cliente.nombreEmpresa}</td>
                    </tr>
                     <tr>
                        <td>Nombre de la empresa</td>
                        <td>{cliente.nombreEmpresa}</td>
                    </tr>
                     <tr>
                        <td>Nombre de la empresa</td>
                        <td>{cliente.nombreEmpresa}</td>
                    </tr>
                     <tr>
                        <td>Nombre de la empresa</td>
                        <td>{cliente.nombreEmpresa}</td>
                    </tr>
                     <tr>
                        <td>Nombre de la empresa</td>
                        <td>{cliente.nombreEmpresa}</td>
                    </tr> */}
                </table>
        </div>
    )
}

export default VerCliente