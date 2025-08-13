import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'

const InicioAdm = () => {
  const nombreSelector = useSelector(state => state.usuarioSlice.nombre)
  const [nombre, setNombre] = useState("")
  
  useEffect(() => {
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
    navigate("/")
  }


  return (
    <div className="contenedor-menu">
       <div className="menu-principal">
        <div className="encabezado-bienvenida">
          <img src="/LogoDiegoVidal.jpeg" alt="Logo" className="logo-servimanager" />
          <h1>Hola {nombre}!</h1>
        </div>
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
          <input type="button" value="Notificaciones" className="btn-menu" onClick={verChats} />
          <input type="button" value="Bloc de notas" className="btn-menu" onClick={verChats} />

        </div>
    </div>

  )
}

export default InicioAdm