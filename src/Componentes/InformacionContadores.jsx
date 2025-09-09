import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const InformacionContadores = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const clienteId = state?.clienteId;
  const maquinaId = state?.maquinaId;

  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_API_URL;

  const [contadores, setContadores] = useState([]);
  const [arrendamiento, setArrendamiento] = useState(null); // objeto
  const [envioContador, setEnvioContador] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [descuento, setDescuento] = useState(''); // controlado como string para el input
  const descuento = useRef()
// const [total, setTotal] = useState(0);
  // ---------- FETCHERS ----------
  const traerContadoresDelCliente = async () => {
    try {
      const r = await fetch(`${API_URL}/contador/cliente/${clienteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!r.ok) throw new Error('Error al traer contadores del cliente');
      const data = await r.json();
      setContadores(data);
    } catch (e) {
      console.error('Error al obtener los contadores del cliente:', e);
    }
  };

  const traerEnvioContador = async () => {
    try {
      const id = state?.envioIds?.[0];
      if (!id) return;
      const r = await fetch(`${API_URL}/envioContador/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!r.ok) throw new Error('Error al traer envioContador');
      const data = await r.json();
      setEnvioContador(data);
    } catch (e) {
      console.error('Error al obtener el envioContador:', e);
    }
  };

  const traerArrendamiento = async () => {
    try {
      const r = await fetch(
        `${API_URL}/arrendamiento/maquina/${maquinaId}/cliente/${clienteId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!r.ok) throw new Error('Error al traer arrendamiento');
      const data = await r.json();
      // Si el API devuelve array, tomamos el primero; si es objeto, lo dejamos
      const a = Array.isArray(data) ? data[0] : data;
      setArrendamiento(a ?? null);
    } catch (e) {
      console.error('Error al obtener el arrendamiento:', e);
    } finally {
      setLoading(false);
    }
  };

  // ---------- EFFECTS ----------
  useEffect(() => {
    if (!clienteId) return;
    traerContadoresDelCliente();
    traerEnvioContador();
  }, [clienteId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (maquinaId && clienteId) traerArrendamiento();
  }, [maquinaId, clienteId]); // eslint-disable-line react-hooks/exhaustive-deps


const calcularTotalCopias = (m) => {
//       const contadorFinal = m.mensaje || 0;
//       const contadorInicial = parseInt(arrendamiento.UltimoContadorBYN || 0) 
//       return (contadorFinal - contadorInicial);
    } 
    const calcularMontoByN = (m) => {
//       const totalCopias = calcularTotalCopias(m);
//       const precioByN = parseFloat(arrendamiento.costoPorCopiaBYN);
//       return (totalCopias * precioByN);
    }
    const calcularMontoColor = (m) => {
//       const totalCopias = calcularTotalCopias(m);
//       const precioColor = parseFloat(arrendamiento.costoPorCopiaColor);
//       return (totalCopias * precioColor);
    }

    const calcularTotalAAbonar = (m) => {
//       if(arrendamiento.tipoImpresion === "Color"){
//         const totalByN = calcularMontoByN(m);
//         const totalColor = calcularMontoColor(m);
//         const descuentoValor = parseFloat(descuento) || 0;
//         return (totalByN + totalColor - descuentoValor).toFixed(2);
      }
//       const descuentoValor = parseFloat(descuento.current?.value) || 0;
//       const total = (calcularMontoByN(m) - descuentoValor).toFixed(2);
//       // setTotal(total)
//       return total
//     }

//   // Si quieres calcular un total global (suma de todas las filas menos descuento una vez):
//   const totalGlobal = useMemo(() => {
//     if (!arrendamiento) return '0.00';
//     const dcto = parseFloat(descuento);
//     const suma = (state?.mensajes || []).reduce((acc, msg) => {
//       const esColor = msg.tipoImpresion === 'Color';
//       const parcial = esColor
//         ? calcularMontoByN(msg) + calcularMontoColor(msg)
//         : calcularMontoByN(msg);
//       return acc + parcial;
//     }, 0);
//     return (Math.max(0, suma - dcto)).toFixed(2);
//   }, [arrendamiento, descuento, state?.mensajes]); // eslint-disable-line react-hooks/exhaustive-deps

  // ---------- GUARDAR ----------
  const guardar = async () => {
    try {
      if (!arrendamiento) {
        toast.error('No hay arrendamiento cargado');
        return;
      }

      const arrendamientoModificado = { ...arrendamiento };
      // Si querés actualizar último contador con el mensaje B/N, elegilo acá:
      // Ej: primer mensaje Monocromático (ajusta según tu data real)
      const mensajeBN = (state?.mensajes || []).find(
        (m) => m.tipoImpresion === 'Monocromatico' || m.tipoImpresion === 'B/N'
      );
      if (mensajeBN) {
        arrendamientoModificado.ultimoContadorBYN = parseInt(mensajeBN.mensaje) || 0;
      }

      const r = await fetch(`${API_URL}/arrendamiento/${arrendamientoModificado.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(arrendamientoModificado),
      });

      if (!r.ok) {
        const text = await r.text();
        throw new Error(`Error ${r.status}: ${text}`);
      }

      await r.json();
      toast.success('Arrendamiento actualizado con éxito');

      // Confirmar envioContador
      if (envioContador) {
        const r2 = await fetch(`${API_URL}/envioContador/confirmar`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(envioContador),
        });
        if (!r2.ok) throw new Error('Error al actualizar envioContador');
      }

      // Ejemplo: navegar con total global (si aplica)
      // navigate(`/pagos/${clienteId}`, { state: { clienteId, maquinaId, total: totalGlobal } });
    } catch (err) {
      console.error('Error PUT:', err);
      toast.error('Error al actualizar: ' + err.message);
    }
  };

  const enviarACliente = () => {

  }
  // console.log(state.mensajes)

  if (loading) return <p>Cargando datos...</p>;

  // Si no hay arrendamiento, mostramos un fallback
  if (!arrendamiento) return <p>No se encontró arrendamiento.</p>;

  return (
    // <div className="contenedor-menu">
    //   <div className="contenedor-secundario">
    //     <h1>{state.clienteNombre}</h1>
    //     <h2>{state.maquinaNombre}</h2>
    //     <p>{state.fechaFormateada}</p>

    //     {(state?.mensajes || []).map((m, i) => {
    //       const totalCopiasBN = calcularTotalCopias(m);
    //       const montoBN = calcularMontoByN(m);
    //       const esColor = m.tipoImpresion === 'Color';
    //       const montoColor = esColor ? calcularMontoColor(m) : 0;
    //       const totalConDescuento = calcularTotalAAbonar(m);

          // return (
//             <div key={i} className="tabla-resumen">
//               <h3>{ m.tipoImpresion === "Color" ? 'B/N' : 'Color'}</h3>

//               <table>
//                 <tbody>
//                   {/* B/N */}
//                   <tr>
//                     <td><em>Contador B/N inicial:</em></td>
//                     <td>{arrendamiento.ultimoContadorBYN ?? 0}</td>
//                   </tr>
//                   <tr>
//                     <td><em>Contador B/N final:</em></td>
//                     <td>{m.mensaje}</td>
//                   </tr>
//                   <tr>
//                     <td><em>Total copias B/N:</em></td>
//                     <td>{totalCopiasBN}</td>
//                   </tr>
//                   <tr>
//                     <td><em>Monto a abonar B/N:</em></td>
//                     <td>{montoBN}</td>
//                   </tr>


//                   {/* Color (solo si aplica) */}
//                   {esColor && (
//                     <>
//                       <tr>
//                         <td><em>Contador Color inicial:</em></td>
//                         <td>{arrendamiento.ultimoContadorColor ?? 0}</td>
//                       </tr>
//                       <tr>
//                         <td><em>Contador Color final:</em></td>
//                         <td>{m.mensaje}</td>
//                       </tr>
//                       <tr>
//                         <td><em>Total copias color:</em></td>
//                         <td>{totalCopiasBN /* placeholder si usas el mismo mensaje */}</td>
//                       </tr>
//                       <tr>
//                         <td><em>Monto a abonar Color:</em></td>
//                         <td>{montoColor}</td>
//                       </tr>
//                     </>
//                   )}

//                   {/* Descuento (global simple) */}
//                   <tr>
//                     <td colSpan="2">
//                       <label>
//                         Descuento:{' '}
//                         <input
//                           type="number"
//                           className="input-descuento"
//                           value={descuento}
//                           onChange={(e) => setDescuento(e.target.value)}
//                           step="0.01"
//                           min="0"
//                         />
//                       </label>
                      
//                     </td>
                  
//                     <td>
//                       <button onClick={() => {calcularTotalAAbonar()}}>Aplicar descuento</button>
//                     </td>
//                   </tr>

//                   {/* Total con descuento para esta fila */}
//                   <tr>
//                     <td>
//                       <em>Total a abonar con descuento:</em>
//                     </td>
//                     <td>{totalConDescuento}</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </div>
//           );
//         })}

//         {/* Total global opcional */}
//         {/* <div style={{ marginTop: 12,  marginBottom: 12 }}>
//           <strong>Total global con descuento:</strong> {totalGlobal}
//         </div> */}

//         <button onClick={guardar}>Guardar</button>
//         <button className="btn-contrasenia" onClick={() => { /* enviar notificación */ }}>
//           Enviar a {state.clienteNombre}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default InformacionContadores;



















// import React, { useEffect, useRef } from 'react'
// import { useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';

// const InformacionContadores = () => {

//     const { state } = useLocation();
//     const clienteId=state.clienteId
//     const maquinaId=state.maquinaId
//     const token = localStorage.getItem("token");
//     const API_URL=import.meta.env.VITE_API_URL
//     const [contadores, setContadores] = useState([])
//     const [arrendamiento, setArrendamiento] = useState(null)
//     const [envioContador, setEnvioContador] = useState(null)
//     const [total, setTotal] = useState(0)
//     const [loading, setLoading] = useState(true)
//     const descuento = useRef(null);
//     let navigate = useNavigate();
    
//     // console.log("Datos recibidos:", state); 


//     const traerContadoresDelCliente = () => {
      
//       fetch(`${API_URL}/contador/cliente/${clienteId}`, {
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//       })
//       .then(r => r.ok ? r.json() : Promise.reject("Error al traer contadores del cliente"))
//       .then(data => {
//         // console.log("Contadores del cliente:", data);
//         setContadores(data);
//       })
//       .catch(e =>
//         console.error("Error al obtener los contadores del cliente:", e))
      
//     }

//     const traerEnvioContador = () => {
//       fetch(`${API_URL}/envioContador/${state.envioIds[0]}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`
//         }
//       })
//         .then(r => r.ok ? r.json() : Promise.reject("Error al traer envioContador"))
//         .then(data => {
//           setEnvioContador(data);
//           // console.log("EnvioContador:", data);
//         }
//         )
//         .catch(e =>
//           console.error("Error al obtener el envioContador:", e))
//     }

//     useEffect(() => {
//        traerContadoresDelCliente()
//        traerEnvioContador()
//     }, [clienteId]);

  

//     const traerArrendamiento = () => {
//       fetch(`${API_URL}/arrendamiento/maquina/${maquinaId}/cliente/${clienteId}`, {
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//       })
//       .then(r => r.ok ? r.json() : Promise.reject("Error al traer arrendamiento"))
//       .then(data => {
//         // console.log("Arrendamiento:", data);
//         setArrendamiento(data);
//         setLoading(false)
//       })
//       .catch(e =>
//         console.error("Error al obtener el arrendamiento:", e))
//     }

//     useEffect(() => {
//       if(maquinaId && clienteId) traerArrendamiento()
//     }, [maquinaId, clienteId]);

//     if (loading) {
//       traerArrendamiento()
//       return <p>Cargando datos...</p>;
//     }

//     const calcularTotalCopias = (m) => {
//       const contadorFinal = parseInt(m.mensaje) || 0;
//       const contadorInicial = parseInt(arrendamiento.UltimoContadorBYN || 0) 
//       return (contadorFinal - contadorInicial);
//     } 
//     const calcularMontoByN = (m) => {
//       const totalCopias = calcularTotalCopias(m);
//       const precioByN = parseFloat(arrendamiento[0].costoPorCopiaBYN);
//       // console.log( "costoByN:", precioByN);
//       return (totalCopias * precioByN);
//     }
//     const calcularMontoColor = (m) => {
//       const totalCopias = calcularTotalCopias(m);
//       const precioColor = parseFloat(arrendamiento[0].costoPorCopiaColor);
//       // console.log( "costoColor:", precioColor);
//       return (totalCopias * precioColor);
//     }

//     const calcularTotalAAbonar = (m) => {
//       if(arrendamiento.tipoImpresion === "Color"){
//         const totalByN = calcularMontoByN(m);
//         const totalColor = calcularMontoColor(m);
//         const descuentoValor = parseFloat(descuento.current?.value) || 0;
//         return (totalByN + totalColor - descuentoValor).toFixed(2);
//       }
//       const descuentoValor = parseFloat(descuento.current?.value) || 0;
//       const total = (calcularMontoByN(m) - descuentoValor).toFixed(2);
//       setTotal(total)
//       return total
//     }
   
//     const guardar = () => {
//       // hacer un put del arrendamiento actualizando el ultimo contador

//  const arrendamientoModificado = arrendamiento[0]
// // console.log("Arrendamiento antes de modificar:", arrendamientoModificado);
   
//   //  console.log("arrendamientoId:", arrendamientoModificado.id);
//       fetch(`${API_URL}/arrendamiento/${arrendamientoModificado.id}`, {
//   method: 'PUT',
//   headers: {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${token}`
//   },
//   body: JSON.stringify(arrendamientoModificado)
// })
//   .then(response => {
//     if (!response.ok) {
//       return response.text().then(text => {
//         throw new Error(`Error ${response.status}: ${text}`);
//       });
//     }
//     return response.json();
//   })
//   .then(data => {
//     toast.success("Arrendamiento actualizado con éxito");
//     // console.log("Respuesta:", data);
//   })
//   .catch(err => {
//     console.error("Error PUT:", err);
//     toast.error("Error al actualizar arrendamiento: " + err.message);
//   });

//     // console.log("state:", state);
//     // console.log("Contadores:", contadores);
//     // const contadorParaActualizar = state.envioIds[0]
//     // console.log("Contador para actualizar:", contadorParaActualizar);

// fetch(`${API_URL}/envioContador/confirmar`, {
//   method: 'PUT',
//   headers: {
//     'Authorization': `Bearer ${token}`,
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify(envioContador)
// })
//   .then(r => r.ok ? r.json() : Promise.reject("Error al actualizar envioContador"))
//   .catch(err => {
//     console.error("Error PUT:", err);
//     toast.error("Error al confirmar envio:" );
//   });

//       // navigate(`/pagos/${clienteId}`, { state: { clienteId, maquinaId, total } });
//     }

//     const enviarACliente = (clienteId) => () => {
//       // enviar notificacion al cliente
//     }


//   return (
    
          <div className="contenedor-menu">

      <div className="contenedor-secundario">
            <h1>{state.clienteNombre}</h1>
            <h2>{state.maquinaNombre}</h2>
            <p>{state.fechaFormateada}</p>

              {state.mensajes.map((m, i) => (
                  
           <div key={i} className="tabla-resumen"> {/*tabla-resumen*/}
            <h3>{m.tipoImpresion === 1 ? "B/N" : "Color"}</h3>

            <table>
              <tbody>
              {/* Inicial y Final */}
                <tr>
                  <td><em>Contador B/N inicial:</em></td>
                  <td>{arrendamiento.ultimoContadorBYN || 0}</td>
                </tr>
                <tr>
                  <td><em>Contador B/N final:</em></td>
                  <td>{m.mensaje}</td>
                </tr>

              {/* Total y Monto a abonar */}
                <tr>
                  <td><em>Total copias B/N:</em></td>
                  <td>{calcularTotalCopias(m)}</td>

                </tr>
                <tr>
                  <td><em>Monto a abonar B/N:</em></td>

                  <td>{calcularMontoByN(m)}</td>
                </tr>
              </tbody>
            </table>
            </div>
            ))}

           
        <table>
          <tbody>
            <tr>
              <td><strong>Total a abonar sin descuento:</strong></td>
              <td>{calcularTotalAAbonar()}</td>
            </tr>
            {/* </tbody>
            </table>
            <table>
              <tbody> */}

            {/* Descuento */}
            <tr>
              <td colSpan="2">
                <label>Descuento:
                  <input type="text" className="input-descuento" ref={descuento}/>
                </label>
              </td>
            {/* </tr>
            <tr> */}
              <td>
                <button onClick={() => calcularTotalAAbonar()}>Aplicar descuento</button>
              </td>
            </tr>

            <tr>
              <td><strong>Total a abonar con descuento :</strong></td>
              <td>{calcularTotalAAbonar()}</td>
            </tr>
          </tbody>
        </table>
      {/* </div>*/}

              
              <button onClick={guardar}>Guardar</button>
              <button className='btn-contrasenia' onClick={enviarACliente(state.clienteId)}>Enviar a {state.clienteNombre}</button>
          </div>
          </div>
        )
      }

      export default InformacionContadores