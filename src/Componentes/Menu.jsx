import React from 'react'
import { Link } from 'react-router-dom'

const Menu = () => {
  return (
    <div>
        <Link to="/datosUsuario">
            <figure>
                <img src="/usuarioAzul3.png" />
                <figcaption>Ver mis datos</figcaption>
            </figure>
        </Link>
    </div>
    
  )
}

export default Menu