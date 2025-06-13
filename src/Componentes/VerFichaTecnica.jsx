import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom';
import { guardarFichasTecnicas } from '../features/fichasTecnicasSlice';

const VerFichaTecnica = () => {
    const { id } = useParams()

    const dispatch = useDispatch()
    const fichas = useSelector(state => state.fichasTecnicasSlice.fichasTecnicas);
    const ficha = fichas.find(m => m.id === Number(id))
    
    useEffect(() => {
        if(fichas.length==0){
            fetch("https://localhost:5201/api/fichaTecnica")
            .then(r =>{
                if(!r.ok){
                    throw new Error("Error en la respuesta del servidor");
                }
                return r.json()
                }) 
            .then(datos => {
                dispatch(guardarFichasTecnicas(datos))
            })
            .catch(error => {
                console.error("Error al obtener las fichas:", error);
            })
        }
    }, [])

    if (!ficha) {
        return <p>Cargando ficha o ficha no encontrada...</p>;
    }

  return (
    <div>
        <h1>Ficha Técnica nro. {id}</h1>
        <Link to ={`/modificarFicha/${id}`}>Modificar ficha</Link><br />
        <table>
            <tbody>
                <tr>
                    <th>Nombre de la empresa: </th>
                    <td>{ficha.cliente.nombreEmpresa}</td>
                </tr> 
                    <tr>
                    <th>Máquina número: </th>
                    <td>{ficha.maquina.numero}</td>
                </tr>
                <tr>
                    <th>Fecha: </th>
                    <td>{ficha.fechaYHora}</td>
                </tr> 
                <tr>
                    <th>Contador BYN: </th>
                    <td>{ficha.maquina.contadorBYN}</td>
                </tr> 
                    <tr>
                    <th>Contador Color: </th>
                    <td>{ficha.maquina.contadorColor}</td>
                </tr> 
                <tr>
                    <th>Insumos: </th>
                    <td>{ficha.insumos.map((i) => (<span>- {i.nombre} -</span>))}</td>
                </tr>
                <tr>
                    <th>Descripción: </th>
                    <td>{ficha.descripcion}</td>
                </tr>
            </tbody>
        </table>
    </div>
  )
}

export default VerFichaTecnica