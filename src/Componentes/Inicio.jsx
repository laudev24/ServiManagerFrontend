import React from 'react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Inicio = () => {

    const [nombre, setNombre] = useState("")
    let navigate = useNavigate()
    const nombreSelector = localStorage.getItem("nombre")

    useEffect(() => {
        if(!localStorage.getItem("token"))
        navigate("/")
        if(localStorage.getItem("esAdministrador") === "true")
        navigate("/InicioAdm")
        if(nombre==="")setNombre(localStorage.getItem("nombre"))
        else setNombre(nombreSelector)

    }, [])


    const verChats = () => {
        navigate("/chat")
    }

    const solicitarServicio = () => {
        // navigate("/solicitudes")
    }

    const enviarContador = () => {
        // navigate("/contador")
    }


  return (
    <div className="contenedor-menu">
       <div className="menu-principal">
        <h1>Bienvenido a ServiManager, {nombre}</h1>
        <input type="button" value="Chat" className="btn-menu" onClick={verChats} />
        <input type="button" value="Solicitar Servicio Técnico" className="btn-menu" onClick={solicitarServicio} />
        <input type="button" value="Enviar Contador" className="btn-menu" onClick={enviarContador} />
        



    </div>
    </div>
  )
}

export default Inicio