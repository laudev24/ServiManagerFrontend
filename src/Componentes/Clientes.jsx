import React, { use, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { guardarClientes, eliminarCliente } from '../features/clientesSlice' 
import { guardarCategorias } from '../features/categoriasSlice';

const Clientes = () => {
  const listaClientes = useSelector(state => state.clientesSlice.clientes || []);
  const categorias = useSelector(state => state.categoriasSlice.categorias || []);
  const token = localStorage.getItem("token")
  const API_URL = import.meta.env.VITE_API_URL

  const dispatch = useDispatch();
  let navigate = useNavigate();

  
  const [baseClientes, setBaseClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([])
  const [search, setSearch] = useState('')
  const [fechaPagoFiltro, setFechaPagoFiltro] = useState("") 
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
    if (!listaClientes.length) {
      traerClientes();
    } else {
      setBaseClientes(listaClientes);
      setClientesFiltrados(listaClientes);
    }
    if (!categorias.length) traerCategorias()
  }, [listaClientes, categorias])

  const traerClientes = () => {
    fetch(`${API_URL}/cliente`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(r => {
        if (!r.ok) {
          throw new Error("Error en la respuesta del servidor");
        }
        return r.json()
      })
      .then(datos => {
        setBaseClientes(datos);
        setClientesFiltrados(datos);
        dispatch(guardarClientes(datos))
      })
      .catch(error => {
        console.error("Error al obtener los clientes:", error);
      })
  }

  const traerCategorias = () => {
    fetch(`${API_URL}/categoria`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(r => {
        if (!r.ok) {
          throw new Error("Error en la respuesta del servidor");
        }
        return r.json()
      })
      .then(datos => {
        dispatch(guardarCategorias(datos))
      })
  }

  
  const aplicarFiltros = (source, nombreTexto = search, fechaSel = fechaPagoFiltro) => {
    let base = [...source];

    const textoBusqueda = nombreTexto.toLowerCase().trim();
    if (textoBusqueda !== "") {
      base = base.filter(cliente =>
        cliente.nombreEmpresa?.toLowerCase().startsWith(textoBusqueda)
      );
    }

    if (fechaSel !== "") {
      const fp = Number(fechaSel); // 0,1,2
      base = base.filter(c => c.fechaPago === fp);
    }

    return base;
  };

  const conAlerta = () => {
    
  }

  const filtrarPorCategoria = (c) => {
    setPaginaActual(1);
    const idCategoria = Number(c);

    if (c !== "") {
      fetch(`${API_URL}/cliente/por-categoria?categoria=${idCategoria}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
        .then(r => {
          if (!r.ok) {
            throw new Error("Error en la respuesta del servidor");
          }
          return r.json()
        })
        .then(datos => {
          setBaseClientes(datos);
          const combinados = aplicarFiltros(datos);
          setClientesFiltrados(combinados);
        })
        .catch(error => {
          console.error("Error al obtener los clientes:", error);
        })
    } else {
      // Sin categoría: base = lista completa
      const nuevaBase = listaClientes.length ? listaClientes : baseClientes;
      setBaseClientes(nuevaBase);
      setClientesFiltrados(aplicarFiltros(nuevaBase));
    }
  }

  const searchBar = (value) => {
    setPaginaActual(1);
    setSearch(value);
    setClientesFiltrados(aplicarFiltros(baseClientes, value, fechaPagoFiltro));
  };

  // NUEVO: filtro por FechaPago (enum 0/1/2)
  const filtrarPorFechaPago = (valor) => {
    setPaginaActual(1);
    setFechaPagoFiltro(valor);
    setClientesFiltrados(aplicarFiltros(baseClientes, search, valor));
  };

  const handleModificar = (id) => {
    navigate(`/modificarCliente/${id}`) 
  }

  const handleEliminar = (idCliente) => {
    fetch(`${API_URL}/cliente/${idCliente}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
      .then(async (r) => {
        if (r.status === 204) {
          toast("Cliente eliminado");
          setBaseClientes(prev => prev.filter(c => c.id !== idCliente));
          setClientesFiltrados(prev => prev.filter(c => c.id !== idCliente));
          dispatch(eliminarCliente(idCliente))
        } else {
          toast("Error eliminando cliente");
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

        {/* Filtro por categoría */}
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

        <select
          value={fechaPagoFiltro}
          onChange={(e) => filtrarPorFechaPago(e.target.value)}
        >
          <option value="">Todas las fechas de pago</option>
          <option value="0">1–10</option>
          <option value="1">11–20</option>
          <option value="2">21–30</option>
        </select>

        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={search}
            onChange={(e) => {
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
  )
}

export default Clientes
