import React from 'react'

const Solicitudes = () => {
  const token = localStorage.getItem("token")

  useEffect(() => {
   traerSolicitudes()

  }, [])
  
  const traerSolicitudes = () => {
    
    
  }


  return (
     <div className="contenedor-menu">
  <div className="formulario-cliente">
    <h1>Solicitudes</h1>

  
  </div>
</div>
  )
}

export default Solicitudes