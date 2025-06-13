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
        <tbody>
          <tr>
              <td>Número: </td>
              <td>{maquina.numero}</td>
          </tr>
           <tr>
              <td>Marca: </td>
              <td>{maquina.marca}</td>
          </tr>
           <tr>
              <td>Modelo: </td>
              <td>{maquina.modelo}</td>
          </tr>
           <tr>
              <td>Año: </td>
              <td>{maquina.año}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default VerMaquina