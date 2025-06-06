import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom';

const VerCliente = () => {
    const { id } = useParams();

    const listaClientes = useSelector(state => state.clienteSlice.id);
    const cliente = listaClientes.find(c => c.id === id)
    
    return (
        <div>
            <h1>Cliente {cliente.nombre}</h1>
            <table>
                <tr>
                    <td></td><td></td>
                </tr>
            </table>
        </div>
    )
}

export default VerCliente