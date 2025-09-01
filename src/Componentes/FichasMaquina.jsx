import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';


const FichasMaquina = () => {
    const { id } = useParams();
    let navigate = useNavigate()
    const token = localStorage.getItem("token")
    const API_URL=import.meta.env.VITE_API_URL
    
    const [insumosElegidos, setInsumosElegidos] = useState("") // Ojo que esta recibiendo ahora solo un insumo, pero la idea es que pueda recibir una lista
    const [fichas, setFichas] = useState([])
    const [campoClienteElegidoId, setCampoClienteElegidoId] = useState("")
    const [clientes, setClientes] = useState([])
    const [maquina, setMaquina] = useState("")
    const [insumos, setInsumos] = useState([])
    
    useEffect(() => {
        cargarFichas()
        cargarInsumos()
        cargarClientes()
        cargarMaquina()
    }, [])
    
    
    const cargarFichas = () => {
        fetch(`${API_URL}/fichaTecnica/maquina/${id}`, {
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
            setFichas(datos)
            // console.log(fichas)
        })
        .catch(error => {
            console.error("Error al obtener las fichas:", error);
        })
    }
    const cargarInsumos = () => {
        fetch(`${API_URL}/Insumo`, {
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
            setInsumos(datos)
        })
        .catch(error => {
            console.error("Error al obtener los insumos:", error);
        })
    }
    const cargarClientes = () => {
        const maquinaId = Number(id)
        fetch(`${API_URL}/arrendamiento/arrendamiento/maquina/${maquinaId}`, {
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
            const arrendamientos = datos
            setClientes(arrendamientos.map((a => a.cliente)))
        })
        .catch(error => {
            console.error("Error al obtener los clientes:", error);
        })
    }

    const filtrarFichas = () => {
        const cliId = Number(campoClienteElegidoId)
        const insId = Number(insumosElegidos)

        if(campoClienteElegidoId == "" && insumosElegidos == ""){
            cargarFichas()
        }
        else if(campoClienteElegidoId != "" && insumosElegidos != ""){
            fetch(`${API_URL}/fichaTecnica/cliente/${cliId}/insumo/${insId}`, {
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
                setFichas(datos)
            })
            .catch(error => {
                console.error("Error al obtener las fichas:", error);
            })
        }
        else if(campoClienteElegidoId == "" && insumosElegidos != ""){
            fetch(`${API_URL}/fichaTecnica/maquina/${id}/insumo/${insId}`, {
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
                setFichas(datos)
            })
            .catch(error => {
                console.error("Error al obtener las fichas:", error);
            })
        }
        else if(campoClienteElegidoId != "" && insumosElegidos == ""){
            fetch(`${API_URL}/fichaTecnica/cliente/${cliId}/maquina/${id}`, {
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
                setFichas(datos)
            })
            .catch(error => {
                console.error("Error al obtener las fichas:", error);
            })
        }
    }

    const handleModificar = (idFicha) => {
        navigate(`/modificarFicha/${idFicha}`)
    }

    const handleEliminar = (idFicha) => {
        fetch(`${API_URL}/fichaTecnica/${idFicha}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(async (r) => {
            if (r.status === 204) {
                toast("Ficha eliminada");
                console.log(r.status)
                setFichas(prev => prev.filter(c => c.id !== idFicha));
            } else {
                console.log(r.status)
                toast(r.mensaje || "Error eliminando ficha");
            }
        })
        .catch((err) => {
            console.log("Error en la conexión: " + err)
            toast("Error de conexión al eliminar ficha");
        });
    }
      
    const mostrarNombreEmpresa = (id) => {
        const cliente = clientes.find(c => c.id === Number(id))
        if(cliente != undefined) return cliente.nombreEmpresa 
    }

    const cargarMaquina = () => {
        fetch(`${API_URL}/maquina/${id}`, {
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
            setMaquina(datos)
        })
        .catch(error => {
            console.error("Error al obtener la máquina:", error);
        })
    }

    //  const handleChange = (event) => {
    //     //Si queremos usar select multiple:
    //     //   const options = event.target.options;
    //     //   const values = [];

    //     //   for (let i = 0; i < options.length; i++) {
    //     //     if (options[i].selected) {
    //     //       values.push(options[i].value);
    //     //     }
    //     // }

    //     //   setInsumosElegidos(values);
    // } 

    const formatearFechaHora = (fechaISO) => {
        const fecha = new Date(fechaISO); // convierte desde UTC a local automáticamente
        const dia = String(fecha.getDate()).padStart(2, '0');
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const anio = fecha.getFullYear();
        const horas = String(fecha.getHours()).padStart(2, '0');
        const minutos = String(fecha.getMinutes()).padStart(2, '0');

        return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
    }

    return (
    <div className="contenedor-menu">

<div className="contenedor-secundario">
  <h1>Fichas Técnicas de la Máquina {maquina.numero}</h1>

  <button
    onClick={() =>
      navigate('/nuevaFichaTecnica', {
        state: { from: 'fichasMaquina', id }
      })
    }
  >
    Crear Ficha Técnica
  </button>

  <label>
    Seleccionar Cliente:
    <select
      value={campoClienteElegidoId}
      onChange={(e) => setCampoClienteElegidoId(e.target.value)}
    >
      <option value="">Todos los Clientes</option>
      {clientes.map((m) => (
        <option key={m.id} value={m.id}>
          {m.nombreEmpresa}
        </option>
      ))}
      {clientes.length === 0 && <option>No hay clientes para mostrar</option>}
    </select>
  </label>

  <label>
    Seleccionar Insumo:
    <select
      value={insumosElegidos}
      onChange={(e) => setInsumosElegidos(e.target.value)}
    >
      <option value="">Todos los Insumos</option>
      {insumos.map((i) => (
        <option key={i.id} value={i.id}>
          {i.nombreInsumo}
        </option>
      ))}
      {insumos.length === 0 && <option>No hay insumos para mostrar</option>}
    </select>
  </label>

  <button onClick={filtrarFichas}>Filtrar</button>

  <table>
    <tbody>
      {fichas.map((ficha) => (
        <tr key={ficha.id}>
          <td data-label="Fecha">
            <Link to={`/verFichaTecnica/${ficha.id}`}>
              {formatearFechaHora(ficha.fechaYHora)}
            </Link>
          </td>
          <td data-label="Cliente">
            {mostrarNombreEmpresa(ficha.clienteId)}
          </td>
          <td data-label="Máquina">{maquina.numero}</td>
          <td data-label="Modificar">
            <button onClick={() => handleModificar(ficha.id)}>Modificar</button>
          </td>
          <td data-label="Eliminar">
            <button className="eliminar" onClick={() => handleEliminar(ficha.id)}>
              Eliminar
            </button>
          </td>
        </tr>
      ))}
      {fichas.length === 0 && (
        <tr>
          <td colSpan={5} style={{ textAlign: 'center' }}>
            No hay resultados
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>
</div>



        // <div>
        //     <h1>Fichas Técnicas de la Máquina {maquina.numero}</h1>
        //     <button onClick={() => navigate('/nuevaFichaTecnica', { state: { from: 'fichasMaquina' ,  id }})} > 
        //         Crear Ficha Técnica
        //     </button><br />
        //     <label>Seleccionar Cliente:
        //         <select value={campoClienteElegidoId} onChange={(e) => {
        //             setCampoClienteElegidoId(e.target.value);
        //         } }>
        //             <option key="" value="">Todos los Clientes</option>
        //             {clientes.map(m => <option key={m.id} value={m.id}> {m.nombreEmpresa}</option>)}
        //             {clientes.length === 0 && (
        //                 <option value="">No hay clientes para mostrar</option>
        //             )}
        //         </select>
        //     </label><br /><label>Seleccionar Insumo:
        //         <select /*multiple*/ value={insumosElegidos} onChange={(e) => { setInsumosElegidos(e.target.value); } }>
        //             <option key="" value="">Todos los Insumos</option>
        //             {insumos.map(i => <option key={i.id} value={i.id}>{i.nombreInsumo}</option>)}
        //             {insumos.length === 0 && (
        //                 <option value="">No hay insumos para mostrar.</option>
        //             )}
        //         </select>
        //     </label><br /><button onClick={filtrarFichas}>Filtrar</button><table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
        //         <tbody>
        //             {fichas.map((ficha) => (
        //                 <tr key={ficha.id}>
        //                     <td style={{ padding: "8px" }}>
        //                         <span style={{ marginLeft: "10px" }}><Link to={`/verFichaTecnica/${ficha.id}`}>{formatearFechaHora(ficha.fechaYHora)}</Link></span>
        //                     </td>
        //                     <td style={{ padding: "8px" }}>
        //                         <span style={{ marginLeft: "10px" }}>{mostrarNombreEmpresa(ficha.clienteId)}</span>
        //                     </td>
        //                     <td style={{ padding: "8px" }}>
        //                         <span style={{ marginLeft: "10px" }}>{maquina.numero}</span>
        //                     </td>

        //                     <td style={{ padding: "8px" }}>
        //                         <button onClick={() => handleModificar(ficha.id)}>Modificar</button>
        //                     </td>
        //                     <td style={{ padding: "8px" }}>
        //                         <button onClick={() => handleEliminar(ficha.id)} style={{ color: "red" }}>
        //                             Eliminar
        //                         </button>
        //                     </td>
        //                 </tr>
        //             ))}
        //             {fichas.length === 0 && (
        //                 <tr key="noResult">
        //                     <td colSpan={5} style={{ textAlign: "center" }}>No hay resultados</td>
        //                 </tr>
        //             )}
        //         </tbody>
        //     </table> 
        // </div>
    )
}

export default FichasMaquina