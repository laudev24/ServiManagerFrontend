import React from 'react'
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom'

const Estructura = () => {
     const location = useLocation();
    const isInicio = location.pathname === '/inicio' || location.pathname === '/inicioAdm';
    const fromLogin = location.state?.fromLogin;


    const irAInicio = () => {
        if(localStorage.getItem("esAdministrador") === "true"){
            window.location.href = "/InicioAdm";
        }
        else {
            window.location.href = "/Inicio";
        }
    }
    const volverAtras = () => {
        
        window.history.back();
    }

  return (

    <div className="container-fluid">
        <div className="contenido-central">
       <header>
  <nav className="nav-header">
    {/** Icono Home o espacio vacío del mismo tamaño */}
    {isInicio ? (
      <div className="icon-placeholder" />  // mantiene el espacio
    ) : (
      <NavLink to="/InicioAdm" className="icon-link">
        <img src="/Home.png" alt="Volver a inicio" onClick={irAInicio} />
      </NavLink>
    )}

    {!fromLogin && (
      <img src="/Back.png" alt="Volver atrás" onClick={volverAtras} />
    )}
  </nav>
</header>


        <main>
            <Outlet />
        </main>

        <footer>
            <NavLink to="/" state={{ fromLogout: true }}>Logout</NavLink>
        </footer>
        </div>
    </div>
   
  )
}

export default Estructura