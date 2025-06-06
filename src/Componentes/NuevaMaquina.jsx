import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { guardarMaquinas } from '../features/maquinasSlice'
import { useDispatch } from 'react-redux'

const NuevaMaquina = () => {
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
    

    // useEffect(() => {
    //   fetch("https://localhost:5201/api/tipoMaquina")
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
    //   fetch("https://localhost:5201/api/tipoImpresion")
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
            numero: campoNumero.current.value,
            marca: campoMarca.current.value,
            modelo: campoModelo.current.value,
            tiposImpresion: campoTipoImpresion.current.value,
            tiposMaquina: campoTipoMaquina.current.value,
            cantidadContadores: campoCantidadContadores.current.value,
        };

        console.log("Datos a enviar:", maquinaNueva);

        fetch("https://localhost:5201/api/maquina", {
        method: 'POST',
        body: JSON.stringify(maquinaNueva),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
        })
        .then((response) => response.json())
        .then((datos) => {
            console.log(datos.codigo)
            if(datos.codigo===201){
                navigate("/maquinas")
                console.log(datos.mensaje);
                toast("Máquina creada con éxito.")
            }
            else {
            console.log(datos.mensaje)
                toast(datos.mensaje);
                dispatch(guardarMaquinas(datos))
                // toast("Hasta aca llegue")
            }
        })
        .catch((error) => {
            console.error("Error al crear máquina: ", error.message); // usa correctamente "error"
            toast("Error al crear máquina.");
        });
    }


    return (
        <div> 
            <h1>Registro de nueva máquina</h1>
            <label>Número:
                <input type="text" className="numero" ref={campoNumero}/>
            </label><br/>
            <label>Marca:
                <input type="text" className="marca" ref={campoMarca}/>
            </label><br/>
            <label>Modelo:
                <input type="text" className="modelo" ref={campoModelo}/>
            </label><br/>
            <label>Año:
                <input type="text" className="anio" ref={campoAnio}/>
            </label><br/>

            <select className="tipoMaquina" ref={campoTipoMaquina}>
                <option value="">Tipo de máquina</option>
                {tiposMaquina.map((tm) => (
                    <option key={tm.id}>{tm.nombre}</option>
                ))}
                {tiposMaquina.length===0 && <option key="">No hay tipos de máquina para mostrar</option>}
            </select><br/>
        
            <select className="tipoImpresion" ref={campoTipoImpresion}>
                <option value="">Tipo de impresión</option>
                {tiposImpresion.map((ti) => (
                    <option key={ti.id}>{ti.nombre}</option>
                ))}
                {tiposImpresion.length===0 && <option key="">No hay tipos de impresión  para mostrar</option>}
            </select><br/>

            <label>Cantidad de contadores:
                <input type="text" className="cantidadContadores" ref={campoCantidadContadores}/>
            </label><br/>
            
            <input type="button" value="Registrar Máquina" onClick={registrar}/>
        </div>
    )
}

export default NuevaMaquina