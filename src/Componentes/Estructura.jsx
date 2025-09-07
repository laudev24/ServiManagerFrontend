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
    const isLogueado = !!localStorage.getItem("token");

  return (

    <div className="container-fluid">
        <div className="contenido-central">
       <header>
        <nav>
  {/* <nav className="nav-header"> */}
   {/* <div className="nav-left"> */}
    {/** Icono Home o espacio vacío del mismo tamaño */}
    {isInicio ? (
      <div className="icon-placeholder" />  // mantiene el espacio
    ) : (
        <img src="/Home.png" alt="Volver a inicio" onClick={irAInicio} />
      
    )}

    {!fromLogin && (
      <img src="/Back.png" alt="Volver atrás" onClick={volverAtras} />
    )}
    {/* </div> */}
    {/* <div className="nav-right"> */}
    {isLogueado && (
      <NavLink to="/" state={{ fromLogout: true }} className="logout-link">Logout</NavLink>
    )}
    {/* </div> */}

  {/* </nav> */}
  </nav>
</header>


        <main>
            <Outlet />
        </main>

     
        </div>
    </div>
   
  )
}

export default Estructura