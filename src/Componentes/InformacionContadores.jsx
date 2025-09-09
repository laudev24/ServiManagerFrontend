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
      console.log(data)
    } catch (e) {
      console.error('Error al obtener los contadores del cliente:', e);
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
  }, [clienteId]); 

  useEffect(() => {
    if (maquinaId && clienteId) traerArrendamiento();
  }, [maquinaId, clienteId]); 


  const calcularTotalCopias = (m) => {
    const totalCopiasInicial = m.tipoImpresion === "Monocromatico" ? arrendamiento.ultimoContadorBYN : arrendamiento.ultimoContadorColor
    return m.mensaje - totalCopiasInicial
  }

  const calcularMontoByN = () => {

  }
  const calcularTotalAAbonar = () => {

  }

  // ---------- GUARDAR ----------
  const guardar = async () => {
        
        //actualizar contador, ahi se actualiza el ultimo contador del arrendamiento






      }
  const enviarACliente = () => {
    //TODO
  }
  // console.log(state.mensajes)

  if (loading) return <p>Cargando datos...</p>;

  // Si no hay arrendamiento, mostramos un fallback
  if (!arrendamiento) return <p>No se encontró arrendamiento.</p>;

  return (
   
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
                  <td><em>Contador {m.tipoImpresion === 1 ? "B/N" : "Color"} inicial:</em></td>
                  <td>{m.tipoImpresion === 1 ? arrendamiento.ultimoContadorBYN || 0 : arrendamiento.ultimoContadorColor || 0} </td>
                </tr>
                <tr>
                  <td><em>Contador {m.tipoImpresion === 1 ? "B/N" : "Color"} final:</em></td>
                  <td>{m.mensaje}</td>
                </tr>

              {/* Total y Monto a abonar */}
                <tr>
                  <td><em>Total copias {m.tipoImpresion === 1 ? "B/N" : "Color"}:</em></td>
                  <td>{calcularTotalCopias(m)}</td>

                </tr>
                <tr>
                  <td><em>Monto a abonar {m.tipoImpresion === 1 ? "B/N" : "Color"}:</em></td>

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