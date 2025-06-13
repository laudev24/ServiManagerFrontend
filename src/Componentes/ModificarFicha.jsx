import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { guardarFichasTecnicas } from '../features/fichasTecnicasSlice'

const ModificarFicha = () => {
    const { id } = useParams();

    let navigate = useNavigate()
    const [insumosSeleccionados, setInsumosSeleccionados] = useState([])
    const [idClienteElegido, setIdClienteElegido] = useState("")
    const [idMaquinaElegida, setIdMaquinaElegida] = useState("")
    const [contadorBYN, setContadorBYN] = useState("")
    const [contadorColor, setContadorColor] = useState("")
    const [descripcion, setDescripcion] = useState("")
    const campoIdInsumosElegidos = useRef("")

    const fichas = useSelector(state => state.fichasTecnicasSlice.fichasTecnicas);
    const clientes = useSelector(state => state.clientesSlice.clientes);
    const maquinas = useSelector(state => state.maquinasSlice.maquinas);
    const ficha = fichas.find(m => m.id === Number(id))
    
    useEffect(() => {
        setInsumosSeleccionados(ficha.insumos)
        setIdClienteElegido(ficha.clienteId)
        setIdMaquinaElegida(ficha.maquinaId)
        setContadorBYN(ficha.contadorBYN)
        setContadorColor(ficha.contadorColor)
        setDescripcion(ficha.descripcion)
    }, [ficha])
    

   
  
    const modificar = () => {
        const selectedIds = Array.from(campoIdInsumosElegidos.current.selectedOptions, option => option.value);

        if(selectedIds.length!=0){
             setInsumosSeleccionados(selectedIds
            .map((idIn) => insumos.find((i) => i.id === idIn))
            .filter(Boolean))
        }

        const fichaAMandar = {
            id : Number(id),
            clienteId : Number(idClienteElegido),
            maquinaId : Number(idMaquinaElegida),
            fechaYHora : null,
            contadorColor : Number(contadorColor),
            contadorBYN : Number(contadorBYN),
            // insumos : insumosSeleccionados,
            descripcion : descripcion
        }
        console.log("Datos a enviar:", fichaAMandar);
        
        fetch(`https://localhost:5201/api/fichaTecnica/${id}`, {
          method: 'PUT',
          body: JSON.stringify(fichaAMandar),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
          })
          .then((response) => {
            response.json()
            console.log(response)
            if(response.status===201){
                toast("Ficha modificada con éxito")
                navigate('/inicioAdm')
            }
          })
        .catch((error) => {
          console.error("Error al modificar ficha:", error.message); 
          toast(error.message);
        });
    
      }


    return (
    <div>
        <h1>Modificar Ficha Técnica {id}</h1>
        <select className="cliente" onChange={(e) => setIdClienteElegido(e.target.value)} value={idClienteElegido || ""}>
            <option value="">Elegir empresa</option>
            {clientes.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>{cliente.nombreEmpresa}</option>
            ))}
            {clientes.length===0 && <option key="">No hay clientes para mostrar</option>}
        </select><br/>
        <select className="maquina" onChange={(e) => setIdMaquinaElegida(e.target.value)} value={idMaquinaElegida || ""}>
            <option value="">Elegir máquina</option>
            {maquinas.map((maquina) => (
                <option key={maquina.id} value={maquina.id}>{maquina.numero}</option>
            ))}
            {maquinas.length===0 && <option key="">No hay clientes para mostrar</option>}
        </select><br/>
        <label>Contador B&N: 
            <input type="text" onChange={(e) => setContadorBYN(e.target.value)} value={contadorBYN || ""}/>
        </label><br />
        <label>Contador Color: 
            <input type="text" onChange={(e) => setContadorColor(e.target.value)} value={contadorColor || ""}/>
        </label><br />
        <select multiple className="insumos" ref={campoIdInsumosElegidos} >
            <option value="">Elegir insumos: </option>
        {insumosSeleccionados.map((i) => (
            <option key={i.id} value={i.id}>{i.nombre}</option>
        ))}
        {insumosSeleccionados.length===0 && <option key="">No hay insumos para mostrar</option>}
        </select><br/>
        <label>Descripcion: 
            <textarea onChange={(e) => setDescripcion(e.target.value)} value={descripcion || ""}/>
        </label><br />
        <input type="button" value="Modificar Ficha" onClick={modificar}/>
    </div>
  )
}

export default ModificarFicha