import React from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'

const InicioAdm = () => {
    const clientes =useSelector(state => state.clientesSlice.clientes);
    const maquinas =useSelector(state => state.maquinasSlice.clientes);
    const fichasTecnicas =useSelector(state => state.fichasTecnicasSlice.clientes);

    const dispatch = useDispatch();
    let navigate = useNavigate();

      const verClientes = () => {
              navigate("/clientes")
   

      }
      const verMaquinas = () => {
       
             navigate("/maquinas")
      }
      const verFichas = () => {
        // // Pedir al backend el listado de fichas tecnicas 
      // useEffect(() => {
      //     fetch("")
      //     .then(r => r.json())
      //     .then(datos => {
      //        dispatch(guardarFichasTecnicas(datos.fichasTecnicas))
      //        navigate("/fichasTecnicas")
      //     })
      // }, [])
            navigate("/fichasTecnicas")
      }
      const verSolicitudes = () => {
        // // Pedir al backend el listado de solicitudes
      // useEffect(() => {
      //     fetch("")
      //     .then(r => r.json())
      //     .then(datos => {
      //        dispatch(guardarFichasTecnicas(datos.solicitudes))
      //        navigate("/solicitudes")
      //     })
      // }, [])
          navigate("/solicitudes")
      }

      const verInsumos = () => {
        // // Pedir al backend el listado de fichas tecnicas insumos
      //     fetch("")
      //     .then(r => r.json())
      //     .then(datos => {
      //        dispatch(guardarFichasTecnicas(datos.insumos))
      //        navigate("/insumos")
      //     })
      // }, [])
          navigate("/insumos")
      }

      const verChats = () => {
        // // Pedir al backend el listado de fichas chats
      //     fetch("")
      //     .then(r => r.json())
      //     .then(datos => {
      //        dispatch(guardarFichasTecnicas(datos.chats))
      //        navigate("/chats")
      //     })
      // }, [])
          navigate("/chats")
      }


  return (
    <div>
      {/* Esto va en el cabezal: */}
        <h1>Hola usuario!</h1>
        <Link to="/datosUsuario">
            <figure>
                <img src="/react/usuarioAzul3.png" />
                <figcaption>Ver mis datos</figcaption>
            </figure>
        </Link>
        {/* Hasta aqui va en el cabezal */}

        <input type="button" value="Clientes" className="btnClientes" onClick={verClientes}/> <br />
        <input type="button" value="Máquinas" className="btnMaquinas" onClick={verMaquinas}/><br />
        <input type="button" value="Fichas Técnicas" className="btnFichasTecnicas" onClick={verFichas}/> <br />
        
        <input type="button" value="Solicitudes" className="btnSolicitudes" onClick={verSolicitudes}/><br />
        <input type="button" value="Insumos" className="btnInsumos" onClick={verInsumos}/><br />
        <input type="button" value="Chats" className="btnChats" onClick={verChats}/>

    </div>
  )
}

export default InicioAdm