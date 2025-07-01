import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

const InicioAdm = () => {
  const nombreSelector = useSelector(state => state.usuarioSlice.nombre)
  const [nombre, setNombre] = useState("")
  
  useEffect(() => {
    if(!localStorage.getItem("token"))
      navigate("/")
    if(nombre==="")setNombre(localStorage.getItem("nombre"))
      else setNombre(nombreSelector)

  }, [])
  

  let navigate = useNavigate()

  const verClientes = () => {
    navigate("/clientes")
  }

  const verMaquinas = () => {
    navigate("/maquinas")
  }

  const verFichas = () => {
    navigate("/fichasTecnicas")
  }

  const verSolicitudes = () => {
    navigate("/solicitudes")
  }

  const verInsumos = () => {
    navigate("/insumos")
  }

  const verChats = () => {
    navigate("/chats")
  }


  return (
    <div className="contenedor-menu">
       <div className="menu-principal">
          <h1>Hola {nombre}!</h1>

          <Link to="/datosUsuario" className="menu-usuario">
            <figure>
              <img src="/usuarioAzul3.png" alt="Usuario" />
              <figcaption>Ver mis datos</figcaption>
            </figure>
          </Link>

          <input type="button" value="Clientes" className="btn-menu" onClick={verClientes} />
          <input type="button" value="Máquinas" className="btn-menu" onClick={verMaquinas} />
          <input type="button" value="Fichas Técnicas" className="btn-menu" onClick={verFichas} />
          <input type="button" value="Solicitudes" className="btn-menu" onClick={verSolicitudes} />
          <input type="button" value="Insumos" className="btn-menu" onClick={verInsumos} />
          <input type="button" value="Chats" className="btn-menu" onClick={verChats} />
        </div>
    </div>

    // <div>
    //   {/* Esto va en el cabezal: */}
    //     <h1>Hola {nombre}!</h1>
    //     <Link to="/datosUsuario">
    //         <figure>
    //             <img src="/public/usuarioAzul3.png" />
    //             <figcaption>Ver mis datos</figcaption>
    //         </figure>
    //     </Link>
    //     {/* Hasta aqui va en el cabezal */}

    //     <input type="button" value="Clientes" className="btnClientes" onClick={verClientes}/> <br />
    //     <input type="button" value="Máquinas" className="btnMaquinas" onClick={verMaquinas}/><br />
    //     <input type="button" value="Fichas Técnicas" className="btnFichasTecnicas" onClick={verFichas}/> <br />
        
    //     <input type="button" value="Solicitudes" className="btnSolicitudes" onClick={verSolicitudes}/><br />
    //     <input type="button" value="Insumos" className="btnInsumos" onClick={verInsumos}/><br />
    //     <input type="button" value="Chats" className="btnChats" onClick={verChats}/>

    // </div>
  )
}

export default InicioAdm