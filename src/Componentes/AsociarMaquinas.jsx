import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { guardarMaquinas } from '../features/maquinasSlice';

const AsociarMaquinas = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    // const tokenSelector = useSelector(state => state.usuarioSlice.token)
    // const [token, setToken] = useState("")
    const token = localStorage.getItem("token")
    
    
    const maquinas = useSelector(state => state.maquinasSlice.maquinas);
    const [idMaquinaElegida, setIdMaquinaElegida] = useState("")
    const [maquinaElegida, setMaquinaElegida] = useState(null)
    const [maquinasAsociadas, setMaquinasAsociadas] = useState([])
    const [maquinasSinAsociar, setMaquinasSinAsociar] = useState([])
    const [cliente, setCliente] = useState(null)
    
    // const campoIdMaquinaElegida = useRef("")
    const campoCargoFijo = useRef("")
    const campoCostoColor = useRef("")
    const campoCostoBYN = useRef("")

   

  

    useEffect(() => {
       if(!localStorage.getItem("token"))
      navigate("/")
       if(localStorage.getItem("esAdmin") === "false")
      navigate("/Inicio")
       
        if(!maquinas.length)cargarMaquinas()
        if(!maquinasAsociadas.length)traerMaquinasDelCliente()
        traerCliente()
    }, [maquinas]);
    useEffect(() => {
      cargarMaquinasSinAsociar()
    }, [maquinas, maquinasAsociadas])
    

    

    const cargarMaquinas = () => {
        fetch("https://localhost:5201/api/maquina", {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            }
        })
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
    }

    const traerMaquinasDelCliente = () => {
      fetch(`https://localhost:5201/api/cliente/maquinas-del-cliente?id=${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }
      })
      .then(r =>{
          if(!r.ok){
              throw new Error("Error en la respuesta del servidor");
          }
          return r.json()
      }) 
      .then(datos => {
          setMaquinasAsociadas(datos)
      })
      .catch(error => {
          console.error("Error al obtener las maquinas:", error);
      })
    }

const cargarMaquinasSinAsociar = () => {
  const lista = maquinas.filter((maq) => 
    !maquinasAsociadas.some((asociada) => asociada.id === maq.id)
  );
  setMaquinasSinAsociar(lista);
};


    const traerCliente = () => {
      fetch(`https://localhost:5201/api/cliente/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
          }
      })
      .then(r =>{
          if(!r.ok){
              throw new Error("Error en la respuesta del servidor");
          }
          return r.json()
          }) 
      .then(datos => {
          setCliente(datos)
      })
      .catch(error => {
          console.error("Error al obtener al cliente:", error);
      })
    }

   
  const mostrarFormulario = (e) => {
    const id = e.target.value;
    setIdMaquinaElegida(id);

    const maquina = maquinas.find(m => m.id === Number(id));
    setMaquinaElegida(maquina);
  };

    const asociar = () => {
        // const idMaquina = Number(campoIdMaquinaElegida.current.value);
        // const maquinaElegida = maquinas.find(m => m.id === idMaquina);
        const arrendamiento = {
            clienteId : Number(id),
            maquinaId : idMaquinaElegida,
            fechaInicio : null,
            fechaFin : null,
            activo : null,
            cargoFijo : Number(campoCargoFijo.current.value),
            costoPorCopiaBYN : campoCostoBYN.current?.value ?? null,
            costoPorCopiaColor : campoCostoColor.current?.value ?? null
        }
        // console.log("Enviando: " + JSON.stringify(arrendamiento))
        fetch("https://localhost:5201/api/arrendamiento", {
            method: 'POST',
            body: JSON.stringify(arrendamiento),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
               'Authorization': `Bearer ${token}`

            },
        })
        .then((response) => {
            response.json()
            // console.log(response)
            if(response.status===201){
                toast("Máquina asociada con exito")
                // Actualizar la lista de máquinas asociadas
                traerMaquinasDelCliente()
                setIdMaquinaElegida("")
                setMaquinaElegida(null)
                cargarMaquinasSinAsociar()
            }

        })
        .catch((error) => {
          // console.log(error)
            // console.error("Error al asociar máquina: ", error.message);
            toast(error.message);
        });

    }
     if (!cliente) {
    return <p>Cargando datos...</p>;
  }
  return (
    <div className="contenedor-menu">

<div className="formulario-cliente">
  <h1>Asociar Máquina al Cliente {cliente.nombreEmpresa}</h1>

  <select value={idMaquinaElegida} onChange={mostrarFormulario}>
    {maquinaElegida &&
    <option value={maquinaElegida.id}>{maquinaElegida.numero} - {maquinaElegida.marca} - {maquinaElegida.modelo}</option>
    }
    {!maquinaElegida &&
    <option value="">Elegí una máquina</option>
    }
    {maquinasSinAsociar.map((maquina) => (
      <option key={maquina.id} value={maquina.id}>
        {maquina.numero} - {maquina.marca} - {maquina.modelo}
      </option>
    ))}
    {maquinasSinAsociar.length === 0 && (
      <option key="">No hay máquinas para mostrar.</option>
    )}
  </select>

  <label>
    Cargo fijo:
    <input type="text" ref={campoCargoFijo} />
  </label>



  {maquinaElegida?.tipoImpresion === 1 && (
    <label>
      Costo por Copia B&N:
      <input type="text" ref={campoCostoBYN} />
    </label>
  )}

  {maquinaElegida?.tipoImpresion === 0 && (
    <div>
      <label>
        Costo por Copia B&N:
        <input type="text" ref={campoCostoBYN} />
      </label>
      <label>
        Costo por Copia Color:
        <input type="text" ref={campoCostoColor} />
      </label>
    </div>
  )}

  <input type="button" value="Asociar Máquina" onClick={asociar} />

  <h2>Máquinas asociadas:</h2>

  <table>
    <tbody>
      {maquinasAsociadas.map((maquina) => (
        <tr key={maquina.id}>
          <td>
            {maquina.numero} - {maquina.marca} - {maquina.modelo}
          </td>
        </tr>
      ))}
      {maquinasAsociadas.length === 0 && (
        <tr>
          <td>No hay máquinas asociadas a este cliente.</td>
        </tr>
      )}
    </tbody>
  </table>
</div>
</div>

  )
}

export default AsociarMaquinas