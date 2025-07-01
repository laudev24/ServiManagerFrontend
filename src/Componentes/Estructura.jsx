import React from 'react'
import { Outlet, Link, NavLink } from 'react-router-dom'

const Estructura = () => {

    const volverAtras = () => {
        window.history.back();
    }

  return (

    <div className="container-fluid">
        <div className="contenido-central">
        <header>
            <nav>
            <NavLink to="/InicioAdm" className="icon-link">
                <img src="/Home.png" alt="Volver a inicio" />
            </NavLink>
            <img src="/Back.png" alt="Volver atrás" onClick={volverAtras} />
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
    // Original code commented out

    // <div className='container-fluid'>
    //     <header className='row'>
    //         <nav>
    //             <NavLink to="/InicioAdm">
    //                 <img src="/Home.png" alt="Volver a inicio" />
    //             </NavLink>

    //             <img src="/Back.png" alt="Volver atrás" onClick={volverAtras}/>
            
    //         </nav>
    //     </header>
    //     <main className='row'>
    //         <Outlet/>
    //     </main>
    //     <footer className='row'>
    //         <NavLink className="" to="/">Logout</NavLink>
    //     </footer>
    // </div>
  )
}

export default Estructura