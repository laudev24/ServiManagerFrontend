import React from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'


const VerMaquina = () => {
    const { id } = useParams();

    const listaMaquinas = useSelector(state => state.maquinasSlice.maquinas);
    const maquina = listaMaquinas.find(c => c.id === Number(id))


  return (
    <div>  
        <h1>Datos de la Máquina</h1>
        <Link to ={`/asociarCliente/${id}`}>Asociar Cliente</Link>
        <table>
            <tr>
                <td>Número: </td>
                <td>{maquina.numero}</td>
            </tr>
        </table>
    </div>
  )
}

export default VerMaquina