import React, { use, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { guardarClientes, eliminarCliente } from '../features/clientesSlice' 
import { guardarCategorias } from '../features/categoriasSlice';


const Clientes = () => {
    const listaClientes=useSelector(state => state.clientesSlice.clientes || []);
    const categorias=useSelector(state => state.categoriasSlice.categorias || []);
    const tokenSelector = useSelector(state => state.usuarioSlice.token)
    // const [token, setToken] = useState("")
    const token = localStorage.getItem("token")
    
    const dispatch = useDispatch();
    let navigate = useNavigate();
    const [clientesFiltrados, setClientesFiltrados] = useState([])
    // const [categorias, setCategorias] = useState([])
    const [search, setSearch] = useState('')
    const [paginaActual, setPaginaActual] = useState(1);
    const itemsPorPagina = 10;

    const totalPaginas = Math.ceil(clientesFiltrados.length / itemsPorPagina);
    const indiceInicial = (paginaActual - 1) * itemsPorPagina;
    const clientesPaginados = clientesFiltrados.slice(indiceInicial, indiceInicial + itemsPorPagina);


    const ordenarClientes = () => {
        const clientesOrdenados = [...clientesFiltrados].sort((a, b) => 
            a.nombre.localeCompare(b.nombre))
        setClientesFiltrados(clientesOrdenados)
    }


   

    useEffect(() => {
       if(!localStorage.getItem("token"))
      navigate("/")
      // console.log("ListaClientes: ", listaClientes)
      if (!listaClientes.length) {
        traerClientes();
      } else {
        setClientesFiltrados(listaClientes);
      }
      if(!categorias.length)traerCategorias()
    }, [listaClientes, categorias])

  
    

//     useEffect(() => {
//   console.log("Token guardado en state:", token);
// }, [token]);
    
    const traerClientes = () => {
        fetch("https://localhost:5201/api/cliente", {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            }
        })
        .then(r =>{
            console.log("Status: ", r.status)
            if(!r.ok){
                throw new Error("Error en la respuesta del servidor");
            }
            return r.json()
            }) 
        .then(datos => {
            setClientesFiltrados(datos)
            dispatch(guardarClientes(datos))
            // ordenarClientes()
        })
        .catch(error => {
            console.error("Error al obtener los clientes:", error);
        })
    }
    const traerCategorias = () => {
          fetch("https://localhost:5201/api/categoria", {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            }
        })
          .then(r =>{
            if(!r.ok){
                throw new Error("Error en la respuesta del servidor");
            }
            return r.json()
            })
          .then(datos => {
            //  setCategorias(datos)
             dispatch(guardarCategorias(datos))
          })
      }
    
    const conAlerta = () => {
    // // Pedir al backend el listado de clientes con alerta - o filtrarlo aca?
      //     fetch("")
      //     .then(r =>{
            // if(!r.ok){
            //     throw new Error("Error en la respuesta del servidor");
            // }
            // return r.json()
            // })
      //     .then(datos => {
                // setclientesFiltrados = datos.Clientes
      //     })
    }

    const filtrarPorCategoria = (c) => {
        const idCategoria = Number(c)
        // console.log("ID de categoria: ", idCategoria)
        if(c != ""){
            fetch(`https://localhost:5201/api/cliente/por-categoria?categoria=${idCategoria}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
               'Authorization': `Bearer ${token}`
            }
        })
            .then(r =>{
                if(!r.ok){
                    throw new Error("Error en la respuesta del servidor");
                }
                return r.json()
                }) 
            .then(datos => {
                setClientesFiltrados(datos)
                // ordenarClientes()
                // console.log("Clientes que llegan del fetch: ",datos)
                // console.log("Clientes por categoria: ",clientesFiltrados)
                // dispatch(guardarClientes(datos))
            })
            .catch(error => {
                console.error("Error al obtener los clientes:", error);
            })
        }
        else{
            if(!listaClientes.length)traerClientes()
                else setClientesFiltrados(listaClientes)
            // ordenarClientes()
        }
    }

    const searchBar = (value) => {
        const textoBusqueda = value.toLowerCase().trim();

        if (textoBusqueda !== "") {
            setClientesFiltrados(
            listaClientes.filter(cliente =>
                cliente.nombreEmpresa.toLowerCase().startsWith(textoBusqueda)
            )
            );
            // ordenarClientes()
        } else {
            setClientesFiltrados(listaClientes);
            // ordenarClientes()
        }
    };

    

    const handleModificar = (id) => {
        navigate(`/modificarCliente/${id}`) 
    }

    const handleEliminar = (idCliente) => {

        fetch(`https://localhost:5201/api/cliente/${idCliente}`, {
            method: 'DELETE',
           headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        })
        .then(async (r) => {
            if (r.status === 204) {
                toast("Cliente eliminado");
                console.log(r.status)
                setClientesFiltrados(prev => prev.filter(c => c.id !== idCliente));
                dispatch(eliminarCliente(idCliente))
                // ordenarClientes()
            } else {
                console.log(r.status)
                toast(r.mensaje || "Error eliminando cliente");
            }
        })
        .catch((err) => {
            console.log("Error en la conexión: " + err)
            toast("Error de conexión al eliminar cliente");
        });
    }

    


  return (
    <div className="contenedor-menu">

       <div className="ver-clientes">
  <h1>Clientes</h1>

  <Link to="/nuevoCliente">Crear nuevo cliente</Link><br />

  <input type="button" value="Con Alertas" onClick={conAlerta} /><br />

  <select
    className="categoriaDeCliente"
    onChange={(e) => filtrarPorCategoria(e.target.value)}
  >
    <option value="">Todas las categorías</option>
    {categorias.map((categoria) => (
      <option key={categoria.id} value={categoria.id}>
        {categoria.nombre}
      </option>
    ))}
    {categorias.length === 0 && (
      <option key="">No hay categorías para mostrar</option>
    )}
  </select>

  <div className="search-bar">
    <input
      type="text"
      placeholder="Buscar cliente..."
      value={search}
      onChange={(e) => {
        setSearch(e.target.value);
        searchBar(e.target.value);
      }}
    />
  </div>

  <table>
    <tbody>
      {clientesPaginados.map((cliente) => (
        <tr key={cliente.id}>
          <td data-label="Nombre">
            {cliente.tieneMensajes && (
              <span title="Tiene mensajes">
                <img src="../proyectoInicial/images/mensaje.png" alt="mensaje" />
              </span>
            )}
            {cliente.tienePagosPendientes && (
              <span title="Pagos pendientes" style={{ marginLeft: "5px" }}>
                <img src="../proyectoInicial/images/pago.png" alt="pago" />
              </span>
            )}
            <span style={{ marginLeft: "10px" }}>
              <Link to={`/verCliente/${cliente.id}`}>{cliente.nombreEmpresa}</Link>
            </span>
          </td>
          <td data-label="Modificar">
            <button onClick={() => handleModificar(cliente.id)}>Modificar</button>
          </td>
          <td data-label="Eliminar">
            <button className="eliminar" onClick={() => handleEliminar(cliente.id)}>Eliminar</button>
          </td>
        </tr>
      ))}
      {clientesFiltrados.length === 0 && (
        <tr>
          <td colSpan="3">No hay resultados</td>
        </tr>
      )}
    </tbody>
  </table>

  {totalPaginas > 1 && (
    <div className="paginador">
      <button
        disabled={paginaActual === 1}
        onClick={() => setPaginaActual(paginaActual - 1)}
      >
        Anterior
      </button>
      <span>Página {paginaActual} de {totalPaginas}</span>
      <button
        disabled={paginaActual === totalPaginas}
        onClick={() => setPaginaActual(paginaActual + 1)}
      >
        Siguiente
      </button>
    </div>
  )}
</div>
 </div>





    // <div className='verClientes'>
    //     <h1>Clientes</h1>
    //     <Link to="/nuevoCliente">Crear nuevo cliente</Link> <br />
    //     <input type="button" value="Con Alertas" onClick={conAlerta}/> <br />
    //     <select className="categoriaDeCliente" onChange={(e) =>filtrarPorCategoria(e.target.value)}>
    //         <option value="">Elegir categoría</option>
    //         {categorias.map((categoria) => (
    //             <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
    //         ))}
    //         {categorias.length===0 && <option key="">No hay categorías para mostrar</option>}
    //     </select>
    //     {/* Lo siguiente es un search bar */}
    //     <div style={{ padding: '1rem' }}>
    //         <input
    //             type="text"
    //             placeholder="Buscar cliente..."
    //             value={search}
    //             onChange={(e) => {
    //                 setSearch(e.target.value); 
    //                 searchBar(e.target.value);
    //             }}
    //             style={{
    //             padding: '0.5rem',
    //             fontSize: '1rem',
    //             borderRadius: '4px',
    //             border: '1px solid #ccc'
    //             }}
    //         />
         
    //     </div>

    //     {/* Listado de clientes, cada uno con su link a modificar y boton eliminar  */}
    //     <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
    //         <tbody>
    //             {clientesFiltrados.map((cliente) => (
    //             <tr key={cliente.id}>
    //                 <td style={{ padding: "8px" }}>
    //                     {/* Iconos condicionales */}
    //                     {cliente.tieneMensajes && <span title="Tiene mensajes"><img src='../proyectoInicial/images/mensaje.png' /> </span>}
    //                     {cliente.tienePagosPendientes && (
    //                         <span title="Pagos pendientes" style={{ marginLeft: "5px" }}>
    //                         <img src='../proyectoInicial/images/pago.png' />
    //                         </span>
    //                     )}
    //                     {/* Nombre */}
    //                     <span style={{ marginLeft: "10px" }}><Link to={`/verCliente/${cliente.id}`}>{cliente.nombreEmpresa}</Link></span>
    //                 </td>
    //                 <td style={{ padding: "8px" }}>
    //                 <button onClick={() => handleModificar(cliente.id)}>
    //                     Modificar</button>
    //                 </td>
    //                 <td style={{ padding: "8px" }}>
    //                 <button onClick={() => handleEliminar(cliente.id)} style={{ color: "red" }}>
    //                     Eliminar
    //                 </button>
    //                 </td>
    //             </tr>
    //             ))}
    //             {clientesFiltrados.length === 0 && <tr><td>No hay resultados</td></tr>}
    //         </tbody>
    //     </table>
    // </div>
  )
}

export default Clientes