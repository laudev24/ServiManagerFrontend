import React from 'react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'


const Inicio = () => {

    const [nombre, setNombre] = useState("")
    let navigate = useNavigate()
    const nombreSelector = localStorage.getItem("nombre")

    useEffect(() => {
   
        if(nombre==="")setNombre(localStorage.getItem("nombre"))
        else setNombre(nombreSelector)

    }, [])


    const solicitarServicio = () => {
        navigate("/nuevaSolicitud")
    }

    const enviarContador = () => {
        navigate("/enviarContador")
    }

    const verContadores = () => {
        navigate("/contadoresEnviados")
    }

    const verSolicitudes = () => {
        navigate("/misSolicitudes")
    }


  return (
    <div className="contenedor-menu">
       <div className="contenedor-secundario">
             <div className="encabezado-bienvenida">
                <img src="/LogoDiegoVidal.jpeg" alt="Logo" className="logo-servimanager" />
                <h1>Bienvenido a ServiManager, {nombre}</h1>
            </div>
            <Link to="/datosUsuario" className="menu-usuario">
                <figure>
                    <img src="/usuarioAzul3.png" alt="Usuario" />
                    <figcaption>Ver mis datos</figcaption>
                </figure>
            </Link>
            {/* <input type="button" value="Chat" className="btn-menu" onClick={verChats} /> */}
            <input type="button" value="Solicitar Servicio Técnico" className="btn-menu" onClick={solicitarServicio} />
            <input type="button" value="Ver mis solicitudes" className="btn-menu" onClick={verSolicitudes} />
            <input type="button" value="Enviar Contador" className="btn-menu" onClick={enviarContador} />
            <input type="button" value="Contadores Enviados" className="btn-menu" onClick={verContadores} />

        



        </div>
    </div>
  )
}

export default Inicio