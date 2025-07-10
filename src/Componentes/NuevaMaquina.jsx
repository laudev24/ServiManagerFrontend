import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { guardarMaquinas } from '../features/maquinasSlice'
import { useDispatch, useSelector } from 'react-redux'

const NuevaMaquina = () => {
    const tokenSelector = useSelector(state => state.usuarioSlice.token)
    // const [token, setToken] = useState("")
    const token = localStorage.getItem("token")


    const campoNumero = useRef("")
    const campoMarca = useRef("")
    const campoModelo = useRef("")
    const campoAnio = useRef("")
    const campoTipoMaquina = useRef("")
    const campoTipoImpresion = useRef("")
    const campoCantidadContadores = useRef("")

    const [tiposMaquina, setTiposMaquina] = useState([])
    const [tiposImpresion, setTiposImpresion] = useState([])

    const dispatch = useDispatch();
    let navigate = useNavigate();
    
    useEffect(() => {
       if(!localStorage.getItem("token"))
      navigate("/")
       if(localStorage.getItem("esAdmin") === "false"){
        navigate("/inicio")
       }
  
    }, [])
    

    // useEffect(() => {
    //   fetch("https://localhost:5201/api/tipo", {
        //     method: 'GET',
        //     headers: {
        //       'Content-Type': 'application/json',
        //        'Authorization': `Bearer ${token}`
        //     }
        // })
    //   .then(r =>{
    //         if(!r.ok){
    //             throw new Error("Error en la respuesta del servidor");
    //         }
    //         return r.json()
    //         })
    //   .then(datos => {
    //       setTiposMaquina(datos)
    //   })
    //   .catch(error => {
    //       console.error("Error al obtener los tipos de maquina:", error);
    //   })
    // }, [])
    // useEffect(() => {
    //   fetch("https://localhost:5201/api/tipoImpresion", {
        //     method: 'GET',
        //     headers: {
        //       'Content-Type': 'application/json',
        //        'Authorization': `Bearer ${token}`
        //     }
        // })
    //   .then(r =>{
    //         if(!r.ok){
    //             throw new Error("Error en la respuesta del servidor");
    //         }
    //         return r.json()
    //         })
    //   .then(datos => {
    //       setTiposImpresion(datos)
    //   })
    //   .catch(error => {
    //       console.error("Error al obtener los tipos de impresion:", error);
    //   })
    // }, [])
    
    const registrar = () => {
        const maquinaNueva = {
            id: 0,
            numero: campoNumero.current.value,
            marca: campoMarca.current.value,
            modelo: campoModelo.current.value,
            año: campoAnio.current.value,
            activa: true,
            tiposImpresion: campoTipoImpresion.current.value || 0,
            tipo: campoTipoMaquina.current.value,
            cantidadContadores: Number(campoCantidadContadores.current.value),
        };

        console.log("Datos a enviar:", maquinaNueva);

        fetch("https://localhost:5201/api/maquina", {
        method: 'POST',
        body: JSON.stringify(maquinaNueva),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
            'Authorization': `Bearer ${token}`

        },
        })
        .then(async r =>{
                 const contentType = r.headers.get("content-type");
        
              // Si la respuesta es JSON
              if (contentType && contentType.includes("application/json")) {
                const data = await r.json();
                if (!r.ok) {
                  const message = data.message || data.error || "Error en la respuesta del servidor";
                  const inner = data.innerException?.message;
                  const fullMessage = inner ? `${message} | ${inner}` : message;

                  toast.error(fullMessage);
                  throw new Error(fullMessage);
                  toast.error(data.message || data.error || "Error en la respuesta del servidor");
                  throw new Error(data.message || data.error || "Error en la respuesta del servidor");
                }
                return data;
              } else {
                // Si es texto plano
                const text = await r.text();
                if (!r.ok) {
                  toast.error(text || "Error en la respuesta del servidor");
                  throw new Error(text || "Error en la respuesta del servidor");
                }
                throw new Error("Respuesta inesperada del servidor");
              }
            })
        .then((response) => {
            response.json()
            console.log(response)
            if(response.status===201){
                toast("Máquina creada con éxito.")
                navigate("/maquinas")
            }
        })
        // .catch((error) => {
        //     console.error("Error al crear máquina: ", error.message); // usa correctamente "error"
        //     toast("Error al crear máquina.");
        // });
    }


    return (
    <div className="contenedor-menu">

<div className="formulario-cliente">
  <h1>Registro de nueva máquina</h1>

  <label>
    Número:
    <br />
    <input type="text" ref={campoNumero} />
  </label>

  <label>
    Marca:
    <br />
    <input type="text" ref={campoMarca} />
  </label>

  <label>
    Modelo:
    <br />
    <input type="text" ref={campoModelo} />
  </label>

  <label>
    Año:
    <br />
    <input type="text" ref={campoAnio} />
  </label>

  <label>
    Tipo de máquina:
    <input type="text" ref={campoTipoMaquina} />
  </label>

  <label>
    Tipo de impresión:
    <select className="tipoImpresion" ref={campoTipoImpresion}>
      <option value="">Tipo de impresión</option>
      {tiposImpresion.map((ti) => (
        <option key={ti.id}>{ti.nombre}</option>
      ))}
      {tiposImpresion.length === 0 && (
        <option key="">No hay tipos de impresión para mostrar</option>
      )}
    </select>
  </label>

  <label>
    Cantidad de contadores:
    <input type="text" ref={campoCantidadContadores} />
  </label>

  <input type="button" value="Registrar Máquina" onClick={registrar} />
</div>
</div>


        // <div> 
        //     <h1>Registro de nueva máquina</h1>
        //     <label>Número:
        //         <input type="text" className="numero" ref={campoNumero}/>
        //     </label><br/>
        //     <label>Marca:
        //         <input type="text" className="marca" ref={campoMarca}/>
        //     </label><br/>
        //     <label>Modelo:
        //         <input type="text" className="modelo" ref={campoModelo}/>
        //     </label><br/>
        //     <label>Año:
        //         <input type="text" className="anio" ref={campoAnio}/>
        //     </label><br/>
        //     <label>Tipo de máquina:
        //         <input type="text" className="tipoMaquina" ref={campoTipoMaquina}/>
        //     </label><br/>
        //     {/* <label>Tipo de impresión:
        //         <input type="text" className="tipoImpresion" ref={campoTipoImpresion}/>
        //     </label><br/> */}

        //     {/* <select className="tipoMaquina" ref={campoTipoMaquina}>
        //         <option value="">Tipo de máquina</option>
        //         {tiposMaquina.map((tm) => (
        //             <option key={tm.id}>{tm.nombre}</option>
        //         ))}
        //         {tiposMaquina.length===0 && <option key="">No hay tipos de máquina para mostrar</option>}
        //     </select><br/> */}
        
        //     <select className="tipoImpresion" ref={campoTipoImpresion}>
        //         <option value="">Tipo de impresión</option>
        //         {tiposImpresion.map((ti) => (
        //             <option key={ti.id}>{ti.nombre}</option>
        //         ))}
        //         {tiposImpresion.length===0 && <option key="">No hay tipos de impresión para mostrar</option>}
        //     </select><br/>

        //     <label>Cantidad de contadores:
        //         <input type="text" className="cantidadContadores" ref={campoCantidadContadores}/>
        //     </label><br/>
            
        //     <input type="button" value="Registrar Máquina" onClick={registrar}/>
        // </div>
    )
}

export default NuevaMaquina