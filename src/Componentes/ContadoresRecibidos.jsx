import React, { useEffect, useState, useRef, useCallback } from 'react';
import ContadorRecibido from './ContadorRecibido';
import { useNavigate } from 'react-router-dom';

const ContadoresRecibidos = () => {
  const [contadores, setContadores] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [maquinas, setMaquinas] = useState([]);
  const mensajesRef = useRef({});
  const token = localStorage.getItem("token");
  let navigate = useNavigate();


  useEffect(() => {
    traerClientes();
    traerMaquinas();
    traerContadores();
  }, []);

  const traerClientes = () => {
    fetch("https://localhost:5201/api/cliente", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(r => r.ok ? r.json() : Promise.reject("Error en clientes"))
      .then(setClientes)
      .catch(console.error);
  };

  const traerMaquinas = () => {
    fetch("https://localhost:5201/api/maquina", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(r => r.ok ? r.json() : Promise.reject("Error en maquinas"))
      .then(setMaquinas)
      .catch(console.error);
  };

  const traerContadores = () => {
    fetch("https://localhost:5201/api/contador", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
      .then(r => r.ok ? r.json() : Promise.reject("Error en contadores"))
      .then(setContadores)
      .catch(console.error);
  };

  const buscarCliente = useCallback((idCliente) => {
    const cliente = clientes.find(cli => cli.id === idCliente);
    return cliente ? cliente.nombreEmpresa : "Desconocido";
  }, [clientes]);

  const buscarMaquina = useCallback((idMaquina) => {
    const maq = maquinas.find(m => m.id === idMaquina);
    return maq ? `${maq.numero} - ${maq.marca} - ${maq.modelo}` : "Desconocida";
  }, [maquinas]);

  const handleMensajeChange = useCallback((envioId, texto) => {
    mensajesRef.current[envioId] = texto;
  }, []);


const handleConfirmar = useCallback((envioId) => {
  // podés guardar algo en localStorage, Redux, o pasar vía estado
  
  navigate('/registroContador');
}, []);


  return (
    <div className="contenedor-menu">
      <div className="formulario-cliente">
        <h1>Contadores Recibidos</h1>

        {contadores.map((contador) => (
          <article key={contador.id} className="bloque-contador">
            {contador.enviosContadores.map((envio) => (
              <ContadorRecibido
                key={envio.id}
                envio={envio}
                buscarCliente={buscarCliente}
                buscarMaquina={buscarMaquina}
                onMensajeChange={handleMensajeChange}
              />
            ))}
          </article>
        ))}
      </div>
    </div>
  );
};

export default ContadoresRecibidos;





// import React, { useEffect, useRef, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { useNavigate } from 'react-router-dom'
// import { guardarClientes } from '../features/clientesSlice'
// import { guardarMaquinas } from '../features/maquinasSlice'


// const ContadoresRecibidos = () => {
//     console.log("Componente ContadoresRecibidos montado");

//     let navigate = useNavigate()
//     const dispatch = useDispatch()
//     const [contadores, setContadores] = useState([])
//     const token = localStorage.getItem("token");
//     // const clientes = useSelector(state => state.clientesSlice.clientes)
//     // const maquinas = useSelector(state => state.maquinasSlice.maquinas)
//     const [clientes, setClientes] = useState([])
//     const [maquinas, setMaquinas] = useState([])
//     const [nuevoMensaje, setNuevoMensaje] = useState("")
//     const mensajesRef = useRef({});


//     useEffect(() => {
//     //   if(!localStorage.getItem("token")){
//     //     navigate("/")
//     //     return
//     //   }
//     //   if(localStorage.getItem("esAdmin") === "false"){
//     //     navigate("/inicio")
//     //     return
//     // }
//     //   if(!clientes) traerClientes()
//     //   if(!maquinas) traerMaquinas()
//         traerClientes()
//         traerMaquinas()
//         traerContadores()
//     }, [])

//     const renderCount = useRef(0);
// useEffect(() => {
//   renderCount.current += 1;
//   console.log("Render count:", renderCount.current);
// });

//     const traerClientes = () => {
//         fetch("https://localhost:5201/api/cliente", {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//                'Authorization': `Bearer ${token}`
//             }
//         })
//     .then(r =>{
//       if(!r.ok){
//         throw new Error("Error en la respuesta del servidor");
//       }
//       return r.json()
//     }) 
//     .then(datos => {
//         setClientes(datos)
//     //   dispatch(guardarClientes(datos))
//     })
//     .catch(error => {
//       console.error("Error al obtener los clientes:", error);
//     })
//     }

//     const traerMaquinas = () => {
//         console.log("Ejecutando traerMaquinas");

//         fetch("https://localhost:5201/api/maquina", {
//             method: 'GET',
//             headers: {
//               'Content-Type': 'application/json',
//                'Authorization': `Bearer ${token}`
//             }
//         })
//     .then(r =>{
//       if(!r.ok){
//         throw new Error("Error en la respuesta del servidor");
//       }
//       return r.json()
//     }) 
//     .then(datos => {
//         setMaquinas(datos)
//     //   dispatch(guardarMaquinas(datos))
//     })
//     .catch(error => {
//       console.error("Error al obtener las maquinas:", error);
//     })
//     }

//     const traerContadores = () => {
//         fetch(`https://localhost:5201/api/contador`,
//         {
//           method: 'GET',
//           headers: {
//             'Content-type': 'application/json; charset=UTF-8',
//             'Authorization': `Bearer ${token}`
//           }
//         })
//         .then(async r => {
//           const contentType = r.headers.get("content-type");
//           if (contentType && contentType.includes("application/json")) {
//             const data = await r.json();
//             if (!r.ok) {
//               throw new Error(data.message || data.error || "Error en la respuesta del servidor");
//             }
//             return data;
//           } else {
//             throw new Error("La respuesta no es JSON");
//           }
//         })
//         .then(datos => {
//             setContadores(datos)
//         //   console.log("Contadores recibidos:", datos);
//         })
//         .catch(error => {
//           console.error("Error al obtener los contadores recibidos:", error);
//         });
//     }

//     const buscarCliente = (idCliente) => {
//         const cliente = clientes.find(cli => cli.id === idCliente);
//         return cliente.nombreEmpresa
//     }

//     const buscarMaquina = (idMaquina) => {
//         // if(!maquinas) traerMaquinas()
//         const maquina = maquinas.find(maq => maq.id === idMaquina);
//         // console.log("Maquinas: " , maquinas)
//         // console.log("maq:" , maquina)
//         return `${maquina.numero} - ${maquina.marca} - ${maquina.modelo}`
//     }

//     const [mensajes, setMensajes] = useState({}); // key = envio.id

// const handleMensajeChange = (id, nuevoTexto) => {
//   setMensajes(prev => ({ ...prev, [id]: nuevoTexto }));
// };


//     // const buscarMensaje = (mensaje) => {
//     //     setNuevoMensaje(mensaje)
//     //     return mensaje
//     // }

//     const formatearFechaHora = (fechaISO) => {
//         const fecha = new Date(fechaISO); // convierte desde UTC a local automáticamente
//         const dia = String(fecha.getDate()).padStart(2, '0');
//         const mes = String(fecha.getMonth() + 1).padStart(2, '0');
//         const anio = fecha.getFullYear();
//         const horas = String(fecha.getHours()).padStart(2, '0');
//         const minutos = String(fecha.getMinutes()).padStart(2, '0');

//         return `${dia}/${mes}/${anio} ${horas}:${minutos}`;
//     }

//     const reenviarSolicitud = (clienteId) => {
//         //Mandar mensaje a cliente
//     }

//     const confirmar = () => {
//         //Mandar datos a Registro Contador

//     }



//   return (
//    <div className="contenedor-menu">
//   <div className="formulario-cliente">
//     <h1>Contadores Recibidos</h1>

//     {contadores.map((contador) => (
//       <article key={contador.id} className="bloque-contador">
//         {contador.enviosContadores.map((envio) => (
//           <div key={envio.id} className="envio-contador">
//             <h2>{buscarCliente(envio.clienteId)}</h2>
//             <h3>{buscarMaquina(envio.maquinaId)}</h3>
//             <p className='contador-p'>Contador {envio.tipoImpresion === 1 ? 'B/N' : 'Color'}</p>
//             <p className="contador-p">{formatearFechaHora(envio.fechaYHora)}</p>
//             <div className="grid-contador">
//               <div className="imagen-col">
//                 <img
//                   src={`data:image/jpeg;base64,${envio.imagen}`}
//                   alt="Imagen del contador"
//                   className="imagen-contador"
//                 />
//               </div>

//               <div className="input-col">
//                 <label>
//                   Ingresar valor:
//                   <input
//                     type="text"
//                     className="form-control"
//                     placeholder="Escribe el valor"
//                     // value={mensajes[envio.id] || envio.mensaje || ''}
//                     // onChange={(e) => handleMensajeChange(envio.id, e.target.value)}

//                     value={envio.mensaje || ''}
//                     onChange={(e) => {mensajesRef.current[envio.id] = e.target.value;}}
//                   />
//                 </label>
//               </div>

//               <div className="btn-col">
//                 <button className="btn-reenviar" onClick={reenviarSolicitud(envio.clienteId)}>Reenviar solicitud</button>
//               </div>

//               <div className="btn-col">
//                 <button className="btn-confirmar" onClick={confirmar}>Confirmar</button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </article>
//     ))}
//   </div>
// </div>

//   )
// }

// export default ContadoresRecibidos