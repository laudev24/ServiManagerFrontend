import React from 'react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'


const Inicio = () => {

    const [nombre, setNombre] = useState("")
    let navigate = useNavigate()
    const nombreSelector = localStorage.getItem("nombre")

    useEffect(() => {
        if(!localStorage.getItem("token"))
        navigate("/")
    console.log("esAdmin", localStorage.getItem("esAdmin"))
        if(localStorage.getItem("esAdmin") === "true") {
            console.log("Entra")
            navigate("/inicioAdm")
        }
            if(nombre==="")setNombre(localStorage.getItem("nombre"))
        else setNombre(nombreSelector)

    }, [])


    const verChats = () => {
        navigate("/chat")
    }

    const solicitarServicio = () => {
        navigate("/nuevaSolicitud")
    }

    const enviarContador = () => {
        navigate("/enviarContador")
    }


  return (
    <div className="contenedor-menu">
       <div className="menu-principal">
            <h1>Bienvenido a ServiManager, {nombre}</h1>
            <Link to="/datosUsuario" className="menu-usuario">
                <figure>
                    <img src="/usuarioAzul3.png" alt="Usuario" />
                    <figcaption>Ver mis datos</figcaption>
                </figure>
            </Link>
            <input type="button" value="Chat" className="btn-menu" onClick={verChats} />
            <input type="button" value="Solicitar Servicio Técnico" className="btn-menu" onClick={solicitarServicio} />
            <input type="button" value="Enviar Contador" className="btn-menu" onClick={enviarContador} />
        



        </div>
    </div>
  )
}

export default Inicio