import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { guardarClientes } from '../features/clientesSlice';
import { guardarMaquinas } from '../features/maquinasSlice';



const NuevaFichaTecnica = () => {
  const clientes = useSelector(state => state.clientesSlice.clientes);
  const maquinas = useSelector(state => state.maquinasSlice.maquinas);
  const fichas = useSelector(state => state.fichasTecnicasSlice.fichasTecnicas);
  const campoIdClienteElegido = useRef("");
  const campoIdMaquinaElegida = useRef("");
  const campoContadorBYN = useRef("");
  const campoContadorColor = useRef("");
  const campoIdInsumosElegidos = useRef([]);
  const campoDescripcion = useRef("");
  let navigate = useNavigate();
  const dispatch = useDispatch();
  
  

  const [insumos, setInsumos] = useState([])

  useEffect(() => {
    //traigo los clientes
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
    
    // traigo los insumos
    // fetch("https://localhost:5201/api/insumo")
    // .then(r =>{
    //     if(!r.ok){
    //         throw new Error("Error en la respuesta del servidor");
    //     }
    //     return r.json()
    //     }) 
    // .then(datos => {
    //     setInsumos(datos)
    // })
    // .catch(error => {
    //     console.error("Error al obtener los insumos:", error);
    // })
  }, [clientes])

  useEffect(() => {
    //traigo las maquinas
    fetch("https://localhost:5201/api/maquina")
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
  }, [maquinas])
  
  
  const ingresarFicha = () => {
    const insumosElegidos = []
    const selectedIds = Array.from(campoIdInsumosElegidos.current.selectedOptions, option => option.value);

    const insumosSeleccionados = selectedIds
      .map((idIn) => insumos.find((i) => i.id === idIn))
      .filter(Boolean);

    const ficha = {
      clienteId : Number(campoIdClienteElegido.current.value),
      maquinaId : Number(campoIdMaquinaElegida.current.value),
      fechaYHora : null,
      contadorColor : Number(campoContadorColor.current.value),
      contadorBYN : Number(campoContadorBYN.current.value),
      insumos : insumosElegidos,
      descripcion : campoDescripcion.current.value
    }
    // console.log("Datos a enviar:", ficha);
    
    fetch("https://localhost:5201/api/fichaTecnica", {
      method: 'POST',
      body: JSON.stringify(ficha),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      })
      .then((response) => {
        response.json()
        console.log(response)
        if(response.status===201){
            toast("Ficha registrada con éxito")
            navigate('/inicioAdm')
        }
      })
    .catch((error) => {
      console.error("Error al crear ficha:", error.message); 
      toast(error.message);
      // setMensaje(error.message)
    });

  }



  return (
    <div>
      <h1>Crear Ficha Técnica</h1>
      <select className="cliente" ref={campoIdClienteElegido}>
        <option value="">Elegir empresa</option>
        {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>{cliente.nombreEmpresa}</option>
        ))}
        {clientes.length===0 && <option key="">No hay clientes para mostrar</option>}
      </select><br/>
      <select className="maquina" ref={campoIdMaquinaElegida}>
        <option value="">Elegir máquina</option>
        {maquinas.map((maquina) => (
          <option key={maquina.id} value={maquina.id}>{maquina.numero}</option>
        ))}
        {maquinas.length===0 && <option key="">No hay clientes para mostrar</option>}
      </select><br/>
      <label>Contador B&N: 
        <input type="text" ref={campoContadorBYN}/>
      </label><br />
       <label>Contador Color: 
        <input type="text" ref={campoContadorColor}/>
      </label><br />
      <select multiple className="insumos" ref={campoIdInsumosElegidos}>
        <option value="">Elegir insumos: </option>
        {insumos.map((i) => (
          <option key={i.id} value={i.id}>{i.nombre}</option>
        ))}
        {insumos.length===0 && <option key="">No hay insumos para mostrar</option>}
      </select><br/>
      <label>Descripcion: 
        <textarea ref={campoDescripcion}/>
      </label><br />
      <input type="button" value="Crear Ficha" onClick={ingresarFicha}/>
    </div>
  )
}

export default NuevaFichaTecnica