import React, { useEffect } from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Clientes = () => {
    const id = useSelector(state => state.usuarioSlice.id);
    const apikey = useSelector(state => state.usuarioSlice.apiKey);
    const [clientesFiltrados, setClientesFiltrados] = useState([])
    const [categorias, setCategorias] = useState([])
    const [search, setSearch] = useState('')
    let navigate = useNavigate();

    // Pedir al backend el listado de clientes - Funciona bien
    useEffect(() => {
        fetch("https://localhost:5201/api/cliente")
        .then(r =>{
            if(!r.ok){
                throw new Error("Error en la respuesta del servidor");
            }
            return r.json()
            }) 
        .then(datos => {
           setClientesFiltrados(datos)
        })
        .catch(error => {
            console.error("Error al obtener los clientes:", error);
        })
    }, [])

    // Crear metodo obtenerCategorias en backend
    // useEffect(() => {
    //       fetch("https://localhost:5201/api/cliente", {
    //         method: 'GET',
    //         headers: {
    //           'Content-Type': 'application/json',
    //           'apikey': apiKey,
    //           'iduser':  id
    //         },
    //       })
    //       .then(r => r.json())
    //       .then(datos => {
    //          setCategorias(datos)
    //       })
    //   }, [])
    
    const conAlerta = () => {
    // // Pedir al backend el listado de clientes con alerta - o filtrarlo aca?
      //     fetch("")
      //     .then(r => r.json())
      //     .then(datos => {
                // setclientesFiltrados = datos.Clientes
      //     })
    }

    // revisar si esto funciona creando agregando clientes a la bd
    const searchBar = () => {
        setClientesFiltrados( clientesFiltrados.filter(item =>
            item.toLowerCase().includes(search.toLowerCase())
        ));

    }

    const handleModificar = (id) => {
        navigate(`/modificarCliente/${id}`) 
    }

    const handleEliminar = (idCliente) => {
            // // Pedir al backend que elimine a este cliente
fetch(`https://localhost:5201/api/cliente/${idCliente}`, {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
  },
})
.then(async (r) => {
  if (r.status === 204) {
    toast("Cliente eliminado");
    console.log(r.status)
    setClientesFiltrados(prev => prev.filter(c => c.id !== idCliente));
  } else {
    console.log(r.status)
    // const json = await r.json();
    toast(json.mensaje || "Error eliminando cliente");
  }
})
.catch((err) => {
    console.log("Error en la conexión: " + err)

  toast("Error de conexión al eliminar cliente");
});



    // fetch(`https://localhost:5201/api/cliente/${idCliente}`, {
    //   method: 'DELETE',
    //   headers: {
    //       'Content-Type': 'application/json',
    //       //Elegir useSelector o localStorage
    //     //   'apikey': apikey,
    //     //   'iduser': localStorage.getItem("id"),
    //   },
    //   })
    //   .then(r=>r.json())
    //   .then((json) => {
    //       if(json.codigo===204){
    //         toast(json.mensaje)
    //         setClientesFiltrados(clientesFiltrados.splice(idCliente, 1))
    //       }
    //       else {
    //         toast(json.mensaje);
    //       }

    //   })             
          
    }


  return (
    <div className='verClientes'>
        <h1>Clientes</h1>
        <Link to="/nuevoCliente">Crear nuevo cliente</Link> <br />
        <input type="button" value="Con Alertas" onClick={conAlerta}/> <br />
        <select name="categoriaDeCliente">
            <option value="">Elegir categoría</option>
            {categorias.map((categoria) => (
                <option key={categoria.id}>{categoria.nombre}</option>
            ))}
            {categorias.length===0 && <option key="">No hay categorías para mostrar</option>}
        </select>
        {/* Lo siguiente es un search bar */}
        <div style={{ padding: '1rem' }}>
            <input
                type="text"
                placeholder="Buscar cliente..."
                value={search}
                onChange={(e) => {setSearch(e.target.value), searchBar(e.target.value)}}
                style={{
                padding: '0.5rem',
                fontSize: '1rem',
                borderRadius: '4px',
                border: '1px solid #ccc'
                }}
            />
         
        </div>

        {/* Listado de clientes, cada uno con su link a modificar y boton eliminar  */}
        <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
            <tbody>
                {clientesFiltrados.map((cliente) => (
                <tr key={cliente.id}>
                    <td style={{ padding: "8px" }}>
                        {/* Iconos condicionales */}
                        {cliente.tieneMensajes && <span title="Tiene mensajes"><img src='../proyectoInicial/images/mensaje.png' /> </span>}
                        {cliente.tienePagosPendientes && (
                            <span title="Pagos pendientes" style={{ marginLeft: "5px" }}>
                            <img src='../proyectoInicial/images/pago.png' />
                            </span>
                        )}
                        {/* Nombre */}
                        <span style={{ marginLeft: "10px" }}>{cliente.nombre}</span>
                    </td>
                    <td style={{ padding: "8px" }}>
                    <button onClick={() => handleModificar(cliente.id)}>Modificar</button>
                    </td>
                    <td style={{ padding: "8px" }}>
                    <button onClick={() => handleEliminar(cliente.id)} style={{ color: "red" }}>
                        Eliminar
                    </button>
                    </td>
                </tr>
                ))}
                {clientesFiltrados.length === 0 && <tr><td>No hay resultados</td></tr>}
            </tbody>
        </table>
    </div>
  )
}

export default Clientes