import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { guardarClientes } from '../features/clientesSlice';
import { guardarMaquinas } from '../features/maquinasSlice';


const NuevaFichaTecnica = () => {
  const clientes = useSelector(state => state.clientesSlice.clientes);
  const maquinas = useSelector(state => state.maquinasSlice.maquinas);
  const fichas = useSelector(state => state.fichasTecnicasSlice.fichasTecnicas);
  const tokenSelector = useSelector(state => state.usuarioSlice.token)
  // const [token, setToken] = useState("")
    const token = localStorage.getItem("token")


  const campoIdClienteElegido = useRef("");
  const campoIdMaquinaElegida = useRef("");
  const campoContadorBYN = useRef("");
  const campoContadorColor = useRef("");
  const campoIdInsumosElegidos = useRef("");
  const campoDescripcion = useRef("");
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { from, id } = location.state || {};
  const [maquina, setMaquina] = useState("")
  const [insumoElegido, setInsumoElegido] = useState("")
  const [insumos, setInsumos] = useState([])


  useEffect(() => {
    // if(token==="")setToken(localStorage.getItem("token"))
    //   else setToken(tokenSelector)
    if(clientes.length===0)traerClientes()
    if(insumos.length===0)traerInsumos()
    traerMaquinas()
  }, [])

  const traerClientes = () => {
    fetch("https://localhost:5201/api/cliente", {
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
        dispatch(guardarClientes(datos))
    })
    .catch(error => {
        console.error("Error al obtener los clientes:", error);
    })
  }

  const traerInsumos = () => {
    fetch("https://localhost:5201/api/insumo", {
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
        setInsumos(datos)
    })
    .catch(error => {
        console.error("Error al obtener los insumos:", error);
    })
  }

  const traerMaquinas = () => {
    if(from == "fichasTecnicas"){
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
    else if(from == "fichasMaquina"){
      fetch(`https://localhost:5201/api/maquina/${id}`, {
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
        setMaquina(datos)
      })
      .catch(error => {
        console.error("Error al obtener las maquinas:", error);
      })
    }
  }
  
  
  const ingresarFicha = () => {
    // const insumosElegidos = []
    // const selectedIds = Array.from(campoIdInsumosElegidos.current.selectedOptions, option => option.value);

    // const insumosSeleccionados = selectedIds
    //   .map((idIn) => insumos.find((i) => i.id === idIn))
    //   .filter(Boolean);
    if(from=="fichasTecnicas") setMaquina(maquinas.find(c => c.id === Number(campoIdMaquinaElegida.current.value)))
    const insumoAEnviar = insumos.find(c => c.id === Number(insumoElegido))
  const insumosAEnviar = [insumoAEnviar]
    const ficha = {
      clienteId : Number(campoIdClienteElegido.current.value),
      maquinaId : maquina.id,
      fechaYHora : null,
      contadorColor : Number(campoContadorColor.current.value),
      contadorBYN : Number(campoContadorBYN.current.value),
      // insumos : insumosAEnviar,
      descripcion : campoDescripcion.current.value
    }
    console.log("Datos a enviar:", ficha);
    
    fetch("https://localhost:5201/api/fichaTecnica", {
      method: 'POST',
      body: JSON.stringify(ficha),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
        'Authorization': `Bearer ${token}`

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
    <div className="contenedor-menu">

<div className="formulario-cliente">
  <h1>Crear Ficha Técnica</h1>

  <select className="cliente" ref={campoIdClienteElegido}>
    <option value="">Elegir empresa</option>
    {clientes.map((cliente) => (
      <option key={cliente.id} value={cliente.id}>
        {cliente.nombreEmpresa}
      </option>
    ))}
    {clientes.length === 0 && <option key="">No hay clientes para mostrar</option>}
  </select>

  {from === "fichasMaquina" && (
    <p><em>Máquina número:</em> {maquina.numero}</p>
  )}

  {from === "fichasTecnicas" && (
    <>
      <select className="maquina" ref={campoIdMaquinaElegida}>
        <option value="">Elegir máquina</option>
        {maquinas.map((maquina) => (
          <option key={maquina.id} value={maquina.id}>{maquina.numero}</option>
        ))}
        {maquinas.length === 0 && <option key="">No hay máquinas para mostrar</option>}
      </select>
    </>
  )}

  <label>
    Contador B&N:
    <input type="text" ref={campoContadorBYN} />
  </label>

  <label>
    Contador Color:
    <input type="text" ref={campoContadorColor} />
  </label>

  <label>
    Elegir insumos:
    <select
      className="insumos"
      value={insumoElegido}
      onChange={(e) => setInsumoElegido(e.target.value)}
    >
      <option value="">Elegir insumos:</option>
      {insumos.map((i) => (
        <option key={i.id} value={i.id}>{i.nombreInsumo}</option>
      ))}
      {insumos.length === 0 && <option key="">No hay insumos para mostrar</option>}
    </select>
  </label>

  <label>
    Descripción:
    <textarea ref={campoDescripcion} />
  </label>

  <input type="button" value="Crear Ficha" onClick={ingresarFicha} />
</div>
</div>

    // <div>
    //   <h1>Crear Ficha Técnica</h1>
    //   <select className="cliente" ref={campoIdClienteElegido}>
    //     <option value="">Elegir empresa</option>
    //     {clientes.map((cliente) => (
    //         <option key={cliente.id} value={cliente.id}>{cliente.nombreEmpresa}</option>
    //     ))}
    //     {clientes.length===0 && <option key="">No hay clientes para mostrar</option>}
    //   </select><br/>
    //   {from === "fichasMaquina" && <p><em>Máquina número: </em>{maquina.numero}</p>}
    //   {from === "fichasTecnicas" && <><select className="maquina" ref={campoIdMaquinaElegida}>
    //     <option value="">Elegir máquina</option>
    //     {maquinas.map((maquina) => (
    //       <option key={maquina.id} value={maquina.id}>{maquina.numero}</option>
    //     ))}
    //     {maquinas.length===0 && <option key="">No hay clientes para mostrar</option>}
    //   </select><br/></>}
    //   <label>Contador B&N: 
    //     <input type="text" ref={campoContadorBYN}/>
    //   </label><br />
    //    <label>Contador Color: 
    //     <input type="text" ref={campoContadorColor}/>
    //   </label><br />
    //   <select /*multiple*/ className="insumos" value={insumoElegido} onChange={(e) => setInsumoElegido(e.target.value)}>
    //     <option value="">Elegir insumos: </option>
    //     {insumos.map((i) => (
    //       <option key={i.id} value={i.id}>{i.nombreInsumo}</option>
    //     ))}
    //     {insumos.length===0 && <option key="">No hay insumos para mostrar</option>}
    //   </select><br/>
    //   <label>Descripcion: 
    //     <textarea ref={campoDescripcion}/>
    //   </label><br />
    //   <input type="button" value="Crear Ficha" onClick={ingresarFicha}/>
    // </div>
  )
}

export default NuevaFichaTecnica