import React from 'react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'


const Inicio = () => {

    const [nombre, setNombre] = useState("")
    let navigate = useNavigate()
    const nombreSelector = localStorage.getItem("nombre")
    const token = localStorage.getItem("token")
    const API_URL=import.meta.env.VITE_API_URL
    const nombreUsuario = localStorage.getItem("usuario")
    const id = localStorage.getItem("clienteId")
    const [maquinasAsociadas, setMaquinasAsociadas] = useState([])
    const [loading, setLoading] = useState(true);
   
  const traerMaquinasDelCliente = () => {
    fetch(`${API_URL}/cliente/maquinas-del-cliente?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(r => r.json())
      .then(datos => setMaquinasAsociadas(datos))
      .finally(() => setLoading(false))
      .catch(error => console.error("Error al obtener las maquinas:", error));
  }

    useEffect(() => {
   
        if(nombre==="")setNombre(localStorage.getItem("nombre"))
        else setNombre(nombreSelector)
      traerMaquinasDelCliente()


    }, [])


    const solicitarServicio = () => {
        console.log("maquinasAsociadas:", maquinasAsociadas);
        if(!maquinasAsociadas){
            toast.error("No tienes máquinas asociadas. Contáctate con Diego.")
        }
        else{
        navigate("/nuevaSolicitud")
        }
    }

    const enviarContador = () => {
        if(!maquinasAsociadas){
            toast.error("No tienes máquinas asociadas. Contáctate con Diego.")
        }
        else{
        navigate("/enviarContador")
        }
    }

    const verContadores = () => {

        if(!maquinasAsociadas){
            toast.error("No tienes máquinas asociadas. Contáctate con Diego.")
        }
        else{
        navigate("/contadoresEnviados")
        }
    }

    const verSolicitudes = () => {
        if(!maquinasAsociadas){
            toast.error("No tienes máquinas asociadas. Contáctate con Diego.")
        }
        else{
        navigate("/misSolicitudes")
        }
    }

    if(loading) {
      return <div>Cargando...</div>;
    }
    
        

  return (
    <div className="contenedor-menu">
       <div className="contenedor-secundario">
             <div className="encabezado-bienvenida">
                <img src="/LogoDiegoVidal.jpeg" alt="Logo" className="logo-servimanager" />
                <h1>Bienvenido/a a ServiManager, {nombre}</h1>
            </div>
            <Link to="/datosUsuario" className="menu-usuario">
                <figure>
                    <img src="/usuarioAzul3.png" alt="Usuario" />
                    <figcaption>Ver mis datos</figcaption>
                </figure>
            </Link>
            {maquinasAsociadas.length == 0 &&
            <p className='inicioCliente-p'>No tienes máquinas asociadas aún. Contáctate con Diego</p>}
            <input type="button" value="Solicitar Servicio Técnico" className="btn-menu" onClick={solicitarServicio} />
            <input type="button" value="Ver mis solicitudes" className="btn-menu" onClick={verSolicitudes} />
            <input type="button" value="Enviar Contador" className="btn-menu" onClick={enviarContador} />
            <input type="button" value="Contadores Enviados" className="btn-menu" onClick={verContadores} />

        



        </div>
    </div>
  )
}

export default Inicio