import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';


const FichasMaquina = () => {
    const { id } = useParams();
    let navigate = useNavigate()
    
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
        fetch(`https://localhost:5201/api/fichaTecnica/maquina/${id}`)
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
        fetch("https://localhost:5201/api/Insumo")
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
        fetch(`https://localhost:5201/api/arrendamiento/arrendamiento/maquina/${maquinaId}`)
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
            fetch(`https://localhost:5201/api/fichaTecnica/cliente/${cliId}/insumo/${insId}`)
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
            fetch(`https://localhost:5201/api/fichaTecnica/maquina/${id}/insumo/${insId}`)
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
            fetch(`https://localhost:5201/api/fichaTecnica/cliente/${cliId}/maquina/${id}`)
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
        fetch(`https://localhost:5201/api/fichaTecnica/${idFicha}`, {
          method: 'DELETE',
          headers: {
          'Content-Type': 'application/json',
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
        fetch(`https://localhost:5201/api/maquina/${id}`)
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
    //     if(insumosElegidos!="")
    //         setInsumosElegidos(event);
    //     else
    //         cargarInsumos()
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
        <div>
            <h1>Fichas Técnicas de la Máquina {maquina.numero}</h1>
            <Link to="/nuevaFichaTecnica">Crear Ficha Técnica</Link> <br />
            <label>Seleccionar Cliente:
                <select value={campoClienteElegidoId}  onChange={(e) => {
                    setCampoClienteElegidoId(e.target.value);
                }}>
                    <option key="" value="">Todos los Clientes</option>
                    {clientes.map(m => <option key={m.id} value={m.id}> {m.nombreEmpresa}</option>)}
                    {clientes.length === 0 && (
                        <option value="">No hay clientes para mostrar</option>
                    )}
                </select> 
            </label>
            <br/>
            <label>Seleccionar Insumo:  
                <select /*multiple*/ value={insumosElegidos} onChange={(e) => {setInsumosElegidos(e.target.value)}}>
                <option key="" value="">Todos los Insumos</option>
                {insumos.map(i => <option key={i.id} value={i.id}>{i.nombreInsumo}</option>)}
                {insumos.length === 0 && (
                    <option value="">No hay insumos para mostrar.</option>
                )}
                </select>
            </label>
            <br />
        
            <button onClick={filtrarFichas}>Filtrar</button>
        
            <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
                <tbody>
                    {fichas.map((ficha) => (
                        <tr key={ficha.id}>
                            <td style={{ padding: "8px" }}>
                                <span style={{ marginLeft: "10px" }}><Link to={`/verFichaTecnica/${ficha.id}`}>{formatearFechaHora(ficha.fechaYHora)}</Link></span>
                            </td>
                            <td style={{ padding: "8px" }}>
                                <span style={{ marginLeft: "10px" }}>{mostrarNombreEmpresa(ficha.clienteId)}</span>
                            </td>
                            <td style={{ padding: "8px" }}>
                                <span style={{ marginLeft: "10px" }}>{maquina.numero}</span>
                            </td>
                    
                            <td style={{ padding: "8px" }}>
                                <button onClick={() => handleModificar(ficha.id)}>Modificar</button>
                            </td>
                            <td style={{ padding: "8px" }}>
                                <button onClick={() => handleEliminar(ficha.id)} style={{ color: "red" }}>
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                    {fichas.length === 0 && (
                        <tr key="noResult">
                            <td colSpan={5} style={{ textAlign: "center" }}>No hay resultados</td>
                        </tr>
                    )}
                </tbody>
            </table> 
        </div>
    )
}

export default FichasMaquina